import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as eventBridge from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";

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

    const congressDataCollectorLambda = new lambda.NodejsFunction(
      this,
      "congressDataCollectorLambda",
      {
        entry: "./backend/handlers/data-collector.ts",
        handler: "handler",
        environment: {
          RAW_VOTES_TABLE_NAME: rawVotesTable.tableName,
          PRO_PUBLICA_API_KEY_SECRET_ARN: proPublicaApiSecret.secretArn,
        },
        initialPolicy: [
          new iam.PolicyStatement({
            actions: ["dynamodb:GetItem", "dynamodb:PutItem"],
            resources: [rawVotesTable.tableArn],
          }),
          new iam.PolicyStatement({
            actions: ["secretsmanager:GetSecretValue"],
            resources: [proPublicaApiSecret.secretArn],
          }),
        ],
      }
    );

    dataCollectorRule.addTarget(
      new targets.LambdaFunction(congressDataCollectorLambda)
    );
  }
}
