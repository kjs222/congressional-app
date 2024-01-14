import { VoteOverviewWithId } from "../../types/analyzed-data-schemas";

export interface AnalyzedVoteRepository {
  getVoteList: (
    congress: number,
    chamber: string
  ) => Promise<VoteOverviewWithId[]>;
  saveVoteList: (
    congress: number,
    chamber: string,
    voteList: VoteOverviewWithId[]
  ) => Promise<void>;
  saveVoteAnalysis: (data: {
    key: string;
    sort: string;
    analysis: Record<string, any>;
  }) => Promise<void>;
}
