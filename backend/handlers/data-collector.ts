import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const handler = async (event: any = {}): Promise<any> => {
  console.log(event);
  const client = new DynamoDBClient({ region: "us-east-1" });
  const command = new PutCommand({
    // TableName: process.env.RAW_VOTES_TABLE_NAME || "",
    TableName: "congressDataCollectorRawVotes",
    Item: {
      batchId: "testBatchId",
      voteId: "testVoteId",
      rawVote: JSON.stringify({ hi: "hello" }),
    },
  });

  const docClient = DynamoDBDocumentClient.from(client);
  const response = await docClient.send(command);
  console.log(response);

  return { message: "hello world" };
};
