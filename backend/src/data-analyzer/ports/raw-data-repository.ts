import { VoteResult } from "../../types/propublica-schemas";

export interface RawDataRepository {
  getRawVote(key: string, sort: string): Promise<VoteResult | null>;
}
