import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as eventBridge from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class CongressionalAppBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // table to store raw vote information from data collector
    const rawVotesTable = new dynamo.Table(
      this,
      "congressDataCollectorRawVotes",
      {
        partitionKey: { name: "part", type: dynamo.AttributeType.STRING },
        sortKey: { name: "sort", type: dynamo.AttributeType.STRING },
        tableName: "congressDataCollectorRaw",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      }
    );

    // event scheduled for 10pm MT every day
    const dataCollectorRule = new eventBridge.Rule(
      this,
      "congressDataCollectorRule",
      {
        schedule: eventBridge.Schedule.expression("cron(0 4 * * ? *)"),
        description: "rule to trigger data collection daily",
      }
    );

    const proPublicaApiSecret = new secrets.Secret(
      this,
      "proPublicaApiSecret",
      {
        secretName: "proPublicaApiSecret",
      }
    );

    const dataAnalyzerQueue = new sqs.Queue(this, "dataAnalyzerQueue", {
      queueName: "dataAnalyzer.fifo",
      fifo: true,
      visibilityTimeout: cdk.Duration.seconds(240),
    });

    const congressDataCollectorLambda = new lambda.NodejsFunction(
      this,
      "congressDataCollectorLambda",
      {
        entry: "./src/data-collector/handler.ts",
        handler: "handler",
        environment: {
          RAW_VOTES_TABLE_NAME: rawVotesTable.tableName,
          PRO_PUBLICA_API_KEY_SECRET_ARN: proPublicaApiSecret.secretArn,
          ANALYZER_MESSAGE_QUEUE_URL: dataAnalyzerQueue.queueUrl,
        },
        timeout: cdk.Duration.seconds(240),
        memorySize: 512,
        initialPolicy: [
          new iam.PolicyStatement({
            actions: [
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:BatchWriteItem",
            ],
            resources: [rawVotesTable.tableArn],
          }),
          new iam.PolicyStatement({
            actions: ["secretsmanager:GetSecretValue"],
            resources: [proPublicaApiSecret.secretArn],
          }),
          new iam.PolicyStatement({
            actions: ["sqs:SendMessage"],
            resources: [dataAnalyzerQueue.queueArn],
          }),
        ],
      }
    );

    dataCollectorRule.addTarget(
      new targets.LambdaFunction(congressDataCollectorLambda)
    );

    const analyzedVotesTable = new dynamo.Table(
      this,
      "congressAnalyzedVotesTable",
      {
        partitionKey: { name: "part", type: dynamo.AttributeType.STRING },
        sortKey: { name: "sort", type: dynamo.AttributeType.STRING },
        tableName: "congressAnalyzedVotes",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      }
    );

    const congressDataAnalyzerLambda = new lambda.NodejsFunction(
      this,
      "congressDataAnalyzerLambda",
      {
        entry: "./src/data-analyzer/handler.ts",
        handler: "handler",
        timeout: cdk.Duration.seconds(240),
        memorySize: 512,
        initialPolicy: [
          new iam.PolicyStatement({
            actions: ["dynamodb:GetItem", "dynamodb:PutItem"],
            resources: [rawVotesTable.tableArn, analyzedVotesTable.tableArn],
          }),
        ],
      }
    );

    congressDataAnalyzerLambda.addEventSource(
      new SqsEventSource(dataAnalyzerQueue)
    );

    const apiLambdaVotes = new lambda.NodejsFunction(
      this,
      "getVotesApiLambda",
      {
        entry: "./src/api/handlers/votes-handler.ts",
        handler: "handler",
        initialPolicy: [
          new iam.PolicyStatement({
            actions: ["dynamodb:GetItem"],
            resources: [analyzedVotesTable.tableArn],
          }),
        ],
      }
    );

    const apiLambdaVote = new lambda.NodejsFunction(this, "getVoteApiLambda", {
      entry: "./src/api/handlers/vote-handler.ts",
      handler: "handler",
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ["dynamodb:GetItem"],
          resources: [analyzedVotesTable.tableArn],
        }),
      ],
    });

    const api = new apigateway.HttpApi(this, "VotesApi", {
      apiName: "Votes API",
    });

    const votesIntegration = new HttpLambdaIntegration(
      "votes-api-integration",
      apiLambdaVotes
    );

    api.addRoutes({
      path: "/votes",
      methods: [apigateway.HttpMethod.GET],
      integration: votesIntegration,
    });

    const voteIntegration = new HttpLambdaIntegration(
      "vote-api-integration",
      apiLambdaVote
    );

    api.addRoutes({
      path: "/vote/{id}",
      methods: [apigateway.HttpMethod.GET],
      integration: voteIntegration,
    });
  }
}
