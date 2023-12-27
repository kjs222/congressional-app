export interface RawDataRepository {
  saveRawVote(batchId: string, rollCall: number, rawVote: any): Promise<any>;
  saveLastVoteReceived(
    batchId: string,
    chamber: string,
    rollCall: number,
    date: string
  ): Promise<any>;
}
