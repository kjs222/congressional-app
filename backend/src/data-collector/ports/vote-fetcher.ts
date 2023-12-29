import {
  RecentVotesResponse,
  VoteResult,
} from "../../types/propublica-schemas";

export interface VoteFetcher {
  getRecentVotes(
    chamber: string,
    offset?: number
  ): Promise<RecentVotesResponse>;
  getVote(
    congress: number,
    chamber: string,
    session: number,
    rollCall: number
  ): Promise<VoteResult>;
}
