import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { RawDataRepository } from "../ports/raw-data-repository";
import {
  VoteWithPosition,
  propublicaVoteWithPositionSchema,
} from "../../types/propublica-schemas";
import logger from "../../logger";

export class DynamoRawDataRepository implements RawDataRepository {
  private readonly client =
    process.env.NODE_ENV === "test"
      ? new DynamoDBClient({
          region: "localhost",
          endpoint: "http://localhost:8000",
        })
      : new DynamoDBClient({ region: "us-east-1" });
  private readonly docClient = DynamoDBDocumentClient.from(this.client);
  private readonly tableName = "congressDataCollectorRaw";

  async getRawVote(
    key: string,
    sort: string
  ): Promise<VoteWithPosition | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        part: { S: key },
        sort: { S: sort },
      },
    });
    const response = await this.docClient.send(command);
    const item = response.Item;

    if (!item) return null;

    const parsed = JSON.parse(item.raw.S as string);

    const schemaParsed = propublicaVoteWithPositionSchema.safeParse(parsed);

    if (schemaParsed.success) {
      return schemaParsed.data;
    } else {
      logger.error("Error parsing response in getRawVote", {
        error: schemaParsed.error,
      });
      throw new Error("Error parsing raw vote");
    }
  }
}
