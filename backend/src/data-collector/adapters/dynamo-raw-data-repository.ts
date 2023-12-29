import {
  DynamoDBClient,
  GetItemCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { RawDataRepository, RawVoteInput } from "../ports/raw-data-repository";
import { Chamber, LastVoteReceived } from "../../types";
import { ddbLatestSchema } from "../../types/ddb-schemas";

export class DynamoRawDataRepository implements RawDataRepository {
  private readonly client = new DynamoDBClient({ region: "us-east-1" });
  private readonly docClient = DynamoDBDocumentClient.from(this.client);
  private readonly tableName = "congressDataCollectorRaw";

  async saveRawVotes(rawVoteInput: RawVoteInput[]): Promise<any> {
    const putRequestArray = rawVoteInput.map((input) => {
      return {
        PutRequest: {
          Item: {
            part: { S: input.batchId },
            sort: { S: `${input.chamber}-${input.rollCall.toString()}` },
            raw: { S: JSON.stringify(input.rawVote) },
          },
        },
      };
    });

    const batches = [];
    while (putRequestArray.length > 0) {
      batches.push(putRequestArray.splice(0, 15));
    }

    for (const batch of batches) {
      const command = new BatchWriteItemCommand({
        RequestItems: {
          congressDataCollectorRaw: batch,
        },
      });
      const response = await this.docClient.send(command);
      console.log(JSON.stringify(response));
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    return;
  }

  async saveLastVoteReceived(
    batchId: string,
    chamber: Chamber,
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

  async getLastVoteReceived(
    chamber: Chamber
  ): Promise<LastVoteReceived | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        part: { S: "last" },
        sort: { S: chamber },
      },
    });
    const response = await this.docClient.send(command);
    const item = response.Item;

    if (!item) return null;

    const parsed = ddbLatestSchema.safeParse(item);

    if (parsed.success) {
      return {
        date: parsed.data.date.S,
        batchId: parsed.data.batchId.S,
        rollCall: Number(parsed.data.rollCall.N),
        chamber,
      };
    } else {
      console.error(parsed.error);
      throw new Error("Error parsing last vote received");
    }
  }
}
