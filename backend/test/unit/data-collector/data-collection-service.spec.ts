// import { describe } from "mocha";
import { expect } from "chai";
// import { stub, restore, SinonStub } from "sinon";
// import { collectAndSaveData } from "../../../src/data-collector/services/data-collection-service";
// import { VoteFetcher } from "../../../src/data-collector/ports/vote-fetcher";
// import { RawDataRepository } from "../../../src/data-collector/ports/raw-data-repository";

describe("collectAndSaveData", () => {
  it("should run", () => {
    expect(false).to.be.true;
  });
  // const getLastVoteReceivedStub = stub();
  // const saveRawVotesStub = stub();
  // const saveLastVoteReceivedStub = stub();
  // const mockRepo: RawDataRepository = {
  //   getLastVoteReceived: getLastVoteReceivedStub,
  //   saveRawVotes: saveRawVotesStub,
  //   saveLastVoteReceived: saveLastVoteReceivedStub,
  // };
  // const getRecentVoteDataStub: SinonStub<any[], any> = stub();
  // const batchGetVotesStub: SinonStub<any[], any> = stub();
  // const mockFetcher: VoteFetcher = {
  //   getRecentVotes: getRecentVoteDataStub,
  //   getVote: batchGetVotesStub,
  // };
  // beforeEach(() => {
  //   restore();
  // });
  // it("should call getLastVoteReceived with the chamber", async () => {
  //   const chamber: string = "house";
  //   const mockLastVoteReceived = {
  //     roll_call: "123",
  //     date: "2020-01-01",
  //   };
  //   getLastVoteReceivedStub.resolves(mockLastVoteReceived);
  //   getRecentVoteDataStub.resolves([]);
  //   await collectAndSaveData(mockRepo, mockFetcher);
  //   expect(getLastVoteReceivedStub.calledWith(chamber)).to.be.true;
  // });
});
