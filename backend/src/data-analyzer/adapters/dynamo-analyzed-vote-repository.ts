import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";
import { VoteOverviewWithId } from "../../types/analyzed-data-schemas";
import { voteOverviewWithIdSchema } from "../../types/analyzed-data-schemas";
import logger from "../../logger";
export class DynamoAnalyzedVoteRepository implements AnalyzedVoteRepository {
  private readonly client =
    process.env.NODE_ENV === "test"
      ? new DynamoDBClient({
          region: "localhost",
          endpoint: "http://localhost:8000",
        })
      : new DynamoDBClient({ region: "us-east-1" });
  private readonly docClient = DynamoDBDocumentClient.from(this.client);
  private readonly tableName = "congressAnalyzedVotes";

  async saveVoteAnalysis(data: {
    key: string;
    sort: string;
    analysis: Record<string, any>;
  }): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        part: data.key,
        sort: data.sort,
        analysis: JSON.stringify(data.analysis),
      },
    });

    await this.docClient.send(command);
    return;
  }

  async saveVoteList(
    congress: number,
    chamber: string,
    voteList: VoteOverviewWithId[]
  ) {
    const sort = `${congress}-${chamber.toLowerCase()}`;

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        part: "all-votes",
        sort: sort,
        orderedVotes: JSON.stringify(voteList),
        lastVote: voteList[0].date,
      },
    });
    await this.docClient.send(command);
    return;
  }

  async getVoteList(
    congress: number,
    chamber: string
  ): Promise<VoteOverviewWithId[]> {
    const sort = `${congress}-${chamber.toLowerCase()}`;
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        part: { S: "all-votes" },
        sort: { S: sort },
      },
    });
    const response = await this.docClient.send(command);
    const item = response.Item;

    if (!item) return [];
    const orderedVotes = JSON.parse(item.orderedVotes.S?.toString() || "[]");

    const schema = z.array(voteOverviewWithIdSchema);

    const parsed = schema.safeParse(orderedVotes);

    if (parsed.success) {
      return parsed.data;
    } else {
      logger.error("Error parsing response in getVoteList", {
        error: parsed.error,
      });
      throw new Error("Error parsing last vote received");
    }
  }
}
