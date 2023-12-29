import { Chamber, LastVoteReceived } from "../../types";

export interface RawDataRepository {
  saveRawVotes(rawVotes: RawVoteInput[]): Promise<any>;
  saveLastVoteReceived(
    batchId: string,
    chamber: Chamber,
    rollCall: number,
    date: string
  ): Promise<any>;
  getLastVoteReceived(chamber: Chamber): Promise<LastVoteReceived | null>;
}

export interface RawVoteInput {
  batchId: string;
  chamber: Chamber;
  rollCall: number;
  rawVote: any;
}
