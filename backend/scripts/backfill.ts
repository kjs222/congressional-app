import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// write a script that scans a whole dynamodb table and sends the part and sort keys from each item to an sqs queue
// the script should take the table name and queue url as arguments

export async function backfill(tableName: string, queueUrl: string) {
  const client = new DynamoDBClient({ region: "us-east-1" });
  const sqsClient = new SQSClient({ region: "us-east-1" });

  // in scan command, just get the partitionKey called part and the sort key called sort
  const command = new ScanCommand({
    TableName: tableName,
    ProjectionExpression: "part, #s",
    ExpressionAttributeNames: {
      "#s": "sort",
    },
  });

  const response = await client.send(command);
  const items = response.Items || [];
  console.log(`Found ${items.length} items`);

  for (const item of items) {
    const message = {
      part: item.part.S,
      sort: item.sort.S,
    };

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
      MessageGroupId: `${message.part}${message.sort}`,
      MessageDeduplicationId: `${message.part}${message.sort}-${Date.now()}`,
    });
    const response = await sqsClient.send(command);
    console.log(JSON.stringify(response));
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return;
}

// (async () => {
//   const tableName = "addTableNameHere";
//   const queueUrl = "add queue url here";
//   await backfill(tableName, queueUrl);
// })();
