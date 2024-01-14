import { expect } from "chai";
import { stub, restore, SinonStub } from "sinon";
import { generateMock } from "@anatine/zod-mock";
import { collectAndSaveData } from "../../../src/data-collector/services/data-collection-service";
import { VoteFetcher } from "../../../src/data-collector/ports/vote-fetcher";
import { RawDataRepository } from "../../../src/data-collector/ports/raw-data-repository";
import { AnalyzerMessageSender } from "../../../src/data-collector/ports/analyzer-message-sender";
import {
  propublicaRecentVotesSchema,
  propublicaVoteResultSchema,
  propublicaVoteWithPositionSchema,
  propublicaVoteSchema,
} from "../../../src/types/propublica-schemas";

describe("collectAndSaveData", () => {
  let getLastVoteReceivedStub: SinonStub;
  let saveRawVotesStub: SinonStub;
  let saveLastVoteReceivedStub: SinonStub;
  let sendMessageStub: SinonStub;
  let analyzerMessageSenderStub: AnalyzerMessageSender;
  let mockRepo: RawDataRepository;
  let getRecentVoteDataStub: SinonStub<any[], any> = stub();
  let getVoteStub: SinonStub<any[], any> = stub();
  let mockFetcher: VoteFetcher;

  beforeEach(() => {
    restore();
    getLastVoteReceivedStub = stub();
    saveRawVotesStub = stub();
    saveLastVoteReceivedStub = stub();
    sendMessageStub = stub();
    analyzerMessageSenderStub = {
      send: sendMessageStub,
    };
    mockRepo = {
      getLastVoteReceived: getLastVoteReceivedStub,
      saveRawVotes: saveRawVotesStub,
      saveLastVoteReceived: saveLastVoteReceivedStub,
    };
    getRecentVoteDataStub = stub();
    getVoteStub = stub();
    mockFetcher = {
      getRecentVotes: getRecentVoteDataStub,
      getVote: getVoteStub,
    };
  });

  it("should call getLastVoteReceived with both chambers", async () => {
    const mockLastVoteReceived = {
      rollCall: "123",
      date: "2020-01-01",
    };
    const recentVoteData = recentVotesSetUp(
      Number(mockLastVoteReceived.rollCall),
      0
    );
    getLastVoteReceivedStub.resolves(mockLastVoteReceived);
    getRecentVoteDataStub.resolves(recentVoteData);
    await collectAndSaveData(mockRepo, mockFetcher, analyzerMessageSenderStub);
    expect(getLastVoteReceivedStub.calledWith("house")).to.be.true;
    expect(getLastVoteReceivedStub.calledWith("senate")).to.be.true;
  });

  it("should call getRecentVoteData with both chambers and lastVoteReceived", async () => {
    const mockLastVoteReceived = {
      rollCall: "123",
      date: "2020-01-01",
    };
    const recentVoteData = recentVotesSetUp(
      Number(mockLastVoteReceived.rollCall),
      0
    );
    getLastVoteReceivedStub.resolves(mockLastVoteReceived);
    getRecentVoteDataStub.resolves(recentVoteData);
    await collectAndSaveData(mockRepo, mockFetcher, analyzerMessageSenderStub);
    expect(getRecentVoteDataStub.calledWith("house")).to.be.true;
    expect(getRecentVoteDataStub.calledWith("senate")).to.be.true;
  });

  it("should call batchGetVotes", async () => {
    const mockLastVoteReceived = {
      rollCall: "123",
      date: "2020-01-01",
    };
    const recentVoteData = recentVotesSetUp(
      Number(mockLastVoteReceived.rollCall)
    );

    const recentVote = generateMock(propublicaVoteResultSchema);
    getLastVoteReceivedStub.resolves(mockLastVoteReceived);
    getRecentVoteDataStub.resolves(recentVoteData);
    getVoteStub.resolves(recentVote);
    await collectAndSaveData(mockRepo, mockFetcher, analyzerMessageSenderStub);
    expect(getVoteStub.callCount).to.equal(2);
  });

  it("should call saveRawVotes", async () => {
    const mockLastVoteReceived = {
      rollCall: "123",
      date: "2020-01-01",
    };
    const recentVoteData = recentVotesSetUp(
      Number(mockLastVoteReceived.rollCall)
    );

    const recentVote = generateMock(propublicaVoteResultSchema);
    getLastVoteReceivedStub.resolves(mockLastVoteReceived);
    getRecentVoteDataStub.resolves(recentVoteData);
    getVoteStub.resolves(recentVote);
    await collectAndSaveData(mockRepo, mockFetcher, analyzerMessageSenderStub);
    expect(saveRawVotesStub.callCount).to.equal(2);
  });

  it("should call saveLastVoteReceived", async () => {
    const mockLastVoteReceived = {
      rollCall: "123",
      date: "2020-01-01",
    };
    const recentVoteData = recentVotesSetUp(
      Number(mockLastVoteReceived.rollCall)
    );

    const recentVote = generateMock(propublicaVoteResultSchema);
    getLastVoteReceivedStub.resolves(mockLastVoteReceived);
    getRecentVoteDataStub.resolves(recentVoteData);
    getVoteStub.resolves(recentVote);
    await collectAndSaveData(mockRepo, mockFetcher, analyzerMessageSenderStub);
    expect(saveLastVoteReceivedStub.callCount).to.equal(2);
  });

  it("should call sendMessage", async () => {
    const mockLastVoteReceived = {
      rollCall: "123",
      date: "2020-01-01",
    };
    const recentVoteData = recentVotesSetUp(
      Number(mockLastVoteReceived.rollCall)
    );

    const recentVote = generateMock(propublicaVoteResultSchema);
    getLastVoteReceivedStub.resolves(mockLastVoteReceived);
    getRecentVoteDataStub.resolves(recentVoteData);
    getVoteStub.resolves(recentVote);
    await collectAndSaveData(mockRepo, mockFetcher, analyzerMessageSenderStub);
    expect(sendMessageStub.callCount).to.equal(2);
  });
});

function recentVotesSetUp(
  lastRollCallNumber: number,
  numVotesBeforeLast: number = 1
) {
  const lastVote = generateMock(propublicaVoteWithPositionSchema);
  lastVote.roll_call = lastRollCallNumber;

  const votes = [];

  for (let i = 0; i < numVotesBeforeLast; i++) {
    votes.push(generateMock(propublicaVoteSchema));
  }
  votes.push(lastVote);

  const recentVoteData = generateMock(propublicaRecentVotesSchema);
  recentVoteData.votes = votes;
  return recentVoteData;
}
