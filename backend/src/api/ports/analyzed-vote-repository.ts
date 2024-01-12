import { Chamber } from "../../types";
import {
  VoteOverview,
  VoteSummary,
  PartyVote,
  StateVote,
} from "../../types/analyzed-data-schemas";

export interface AnalyzedVoteRepository {
  getVoteSummary(partitionKey: string): Promise<VoteSummary | null>;

  getVoteStateDetail(
    partitionKey: string,
    state: string // type this
  ): Promise<StateVote | null>;

  getVotePartyDetail(
    partitionKey: string,
    party: "democratic" | "republican"
  ): Promise<PartyVote | null>;
  // get by partition key and sort key of party-<party>

  getVotes(
    chamber: Chamber,
    limit?: number,
    offset?: number
  ): Promise<VoteOverview[]>;
  // impl: part = all-votes, then filter by sort contains chamber, then order by date
}
