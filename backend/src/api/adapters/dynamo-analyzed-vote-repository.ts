import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";
import {
  PartyVote,
  StateVote,
  VoteOverview,
  VoteSummary,
  partyVoteWithIdSchema,
  stateVoteWithIdSchema,
  voteSummaryWithIdSchema,
  voteOverviewWithIdSchema,
} from "../../types/analyzed-data-schemas";
import { Chamber } from "../../types";
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

  async getVoteSummary(partitionKey: string): Promise<VoteSummary | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        part: { S: partitionKey },
        sort: { S: "summary" },
      },
    });
    const response = await this.docClient.send(command);
    const item = response.Item;

    if (!item) return null;
    const toJson = JSON.parse(item.analysis.S?.toString() || "{}");

    const schema = voteSummaryWithIdSchema;

    const parsed = schema.safeParse(toJson);

    if (parsed.success) {
      return parsed.data;
    } else {
      logger.error("Error parsing response in getVoteSummary", {
        error: parsed.error,
      });
      throw new Error("Error parsing vote summary");
    }
  }

  async getVoteStateDetail(
    partitionKey: string,
    state: string
  ): Promise<StateVote | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        part: { S: partitionKey },
        sort: { S: `state-${state}` },
      },
    });
    const response = await this.docClient.send(command);
    const item = response.Item;

    if (!item) return null;
    const toJson = JSON.parse(item.analysis.S?.toString() || "{}");

    const schema = stateVoteWithIdSchema;

    const parsed = schema.safeParse(toJson);

    if (parsed.success) {
      return parsed.data;
    } else {
      logger.error("Error parsing response in getVoteStateDetail", {
        error: parsed.error,
      });
      throw new Error("Error parsing vote summary");
    }
  }

  async getVotePartyDetail(
    partitionKey: string,
    party: "democratic" | "republican"
  ): Promise<PartyVote | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        part: { S: partitionKey },
        sort: { S: `party-${party}` },
      },
    });
    const response = await this.docClient.send(command);
    const item = response.Item;

    if (!item) return null;
    const toJson = JSON.parse(item.analysis.S?.toString() || "{}");

    const schema = partyVoteWithIdSchema;

    const parsed = schema.safeParse(toJson);

    if (parsed.success) {
      return parsed.data;
    } else {
      logger.error("Error parsing response in getVotePartyDetail", {
        error: parsed.error,
      });
      throw new Error("Error parsing vote summary");
    }
  }

  async getVotes(
    chamber: Chamber,
    limit?: number,
    offset?: number
  ): Promise<VoteOverview[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "#partitionKeyAttribute = :partitionKeyValue",
      ExpressionAttributeNames: {
        "#partitionKeyAttribute": "part",
      },
      ExpressionAttributeValues: {
        ":partitionKeyValue": { S: "all-votes" },
      },
    };

    const command = new QueryCommand(params);

    const response = await this.docClient.send(command);
    const items = response.Items;

    if (!items || !items.length) return [];

    const schema = z.array(voteOverviewWithIdSchema);
    // to do: add an id on this...
    const toJson = items
      .map((item) => {
        const orderedVotes = JSON.parse(
          item.orderedVotes.S?.toString() || "[]"
        );
        const parsed = schema.safeParse(orderedVotes);
        if (parsed.success) {
          return parsed.data;
        } else {
          logger.error("Error parsing response in getVotes", {
            error: parsed.error,
          });
          throw new Error("Error parsing vote summary");
        }
      })
      .flat();

    const forChamber = toJson.filter(
      (vote) => vote.chamber.toLowerCase() === chamber
    );

    const ordered = forChamber.sort((a, b) => {
      const dateComparison =
        new Date(b.date).getTime() - new Date(a.date).getTime();

      // If dates are different, sort by date in descending order
      if (dateComparison !== 0) {
        return dateComparison;
      }

      // If dates are the same, sort by rollCall in descending order
      return b.rollCall - a.rollCall;
    });

    limit = limit || 100;
    offset = offset || 0;

    const subset = ordered.slice(offset, offset + limit);

    return subset;
  }
}
