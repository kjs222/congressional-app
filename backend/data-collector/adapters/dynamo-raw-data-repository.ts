import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { VoteResult } from "../../types/propublica-schemas";
import { RawDataRepository } from "../ports/raw-data-repository";

export class DynamoRawDataRepository implements RawDataRepository {
  private readonly client = new DynamoDBClient({ region: "us-east-1" });
  private readonly docClient = DynamoDBDocumentClient.from(this.client);
  private readonly tableName = "congressDataCollectorRawVotes";

  async saveRawVote(batchId: string, rollCall: number, rawVote: VoteResult) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        part: batchId,
        sort: rollCall.toString(),
        raw: rawVote,
      },
    });
    const response = await this.docClient.send(command);
    console.log(JSON.stringify(response));
    return { batchId, rollCall };
  }

  async saveLastVoteReceived(
    batchId: string,
    chamber: string,
    rollCall: number,
    date: string
  ) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        part: "last",
        sort: chamber,
        rollCall: rollCall,
        date,
        batchId,
      },
    });
    const response = await this.docClient.send(command);
    console.log(JSON.stringify(response));
    return { batchId, chamber };
  }
}
