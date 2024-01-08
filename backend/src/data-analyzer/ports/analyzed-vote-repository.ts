import { VoteOverview } from "../../types/analyzed-data-schemas";

export interface AnalyzedVoteRepository {
  getVoteList: (congress: number, chamber: string) => Promise<VoteOverview[]>;
  saveVoteList: (
    congress: number,
    chamber: string,
    voteList: VoteOverview[]
  ) => Promise<void>;
  saveVoteAnalysis: (data: {
    key: string;
    sort: string;
    analysis: Record<string, any>;
  }) => Promise<void>;
}
