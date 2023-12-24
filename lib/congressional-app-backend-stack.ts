import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as eventBridge from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class CongressionalAppBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // table to track last processed batch
    const batchTable = new dynamo.Table(
      this,
      "congressDataCollectorLastBatch",
      {
        partitionKey: { name: "last", type: dynamo.AttributeType.STRING },
        sortKey: { name: "batchId", type: dynamo.AttributeType.STRING },
        tableName: "congressDataCollectorLastBatch",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    // table to store raw vote information
    const rawVotesTable = new dynamo.Table(
      this,
      "congressDataCollectorRawVotes",
      {
        partitionKey: { name: "batchId", type: dynamo.AttributeType.STRING },
        sortKey: { name: "voteId", type: dynamo.AttributeType.STRING },
        tableName: "congressDataCollectorRawVotes",
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

    const congressDataCollectorLambda = new lambda.NodejsFunction(
      this,
      "congressDataCollectorLambda",
      {
        entry: "./backend/handlers/data-collector.ts",
        handler: "handler",
        environment: {
          BATCH_TABLE_NAME: batchTable.tableName,
          RAW_VOTES_TABLE_NAME: rawVotesTable.tableName,
        },
        initialPolicy: [
          new iam.PolicyStatement({
            actions: ["dynamodb:GetItem", "dynamodb:PutItem"],
            resources: [
              batchTable.tableArn,
              // batchTable.tableArn + "/index/*",
              rawVotesTable.tableArn,
              // rawVotesTable.tableArn + "/index/*",
            ],
          }),
        ],
      }
    );

    dataCollectorRule.addTarget(
      new targets.LambdaFunction(congressDataCollectorLambda)
    );
  }
}
