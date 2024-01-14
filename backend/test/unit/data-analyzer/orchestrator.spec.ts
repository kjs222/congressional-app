import { expect } from "chai";
import { stub, restore, SinonStub } from "sinon";
import { generateMock } from "@anatine/zod-mock";
import { RawDataRepository } from "../../../src/data-analyzer/ports/raw-data-repository";
import { AnalyzedVoteRepository } from "../../../src/data-analyzer/ports/analyzed-vote-repository";
import { propublicaVoteWithPositionSchema } from "../../../src/types/propublica-schemas";
import * as savePartySummary from "../../../src/data-analyzer/services/save-party-summary";
import * as saveStateSummary from "../../../src/data-analyzer/services/save-state-summary";
import * as saveVoteSummary from "../../../src/data-analyzer/services/save-vote-summary";
import * as appendNewVoteToList from "../../../src/data-analyzer/services/update-vote-list";

import { run } from "../../../src/data-analyzer/services/orchestrator";

describe("run", () => {
  let savePartySummaryStub: SinonStub;
  let saveStateSummaryStub: SinonStub;
  let saveVoteSummaryStub: SinonStub;
  let appendNewVoteToListStub: SinonStub;
  let getRawVoteStub: SinonStub;
  let mockRepo: AnalyzedVoteRepository;
  let mockRawRepo: RawDataRepository;

  beforeEach(() => {
    restore();
    getRawVoteStub = stub();

    mockRepo = {
      getVoteList: getRawVoteStub,
      saveVoteList: stub(),
      saveVoteAnalysis: stub(),
    };
    savePartySummaryStub = stub(savePartySummary, "savePartySummary");
    saveStateSummaryStub = stub(saveStateSummary, "saveStateSummary");
    saveVoteSummaryStub = stub(saveVoteSummary, "saveVoteSummary");
    appendNewVoteToListStub = stub(appendNewVoteToList, "appendNewVoteToList");
    mockRawRepo = {
      getRawVote: getRawVoteStub,
    };
  });

  it("should call getRawVote with the correct params", async () => {
    getRawVoteStub.resolves(null);
    await run("house", "123", mockRawRepo, mockRepo);
    expect(getRawVoteStub.calledWith("house", "123")).to.be.true;
  });

  it("should call appendNewVoteToListStub", async () => {
    const mockRawVote = generateMock(propublicaVoteWithPositionSchema);
    getRawVoteStub.resolves(mockRawVote);
    savePartySummaryStub.resolves();
    saveVoteSummaryStub.resolves();
    saveStateSummaryStub.resolves();

    await run("house", "123", mockRawRepo, mockRepo);
    expect(appendNewVoteToListStub.calledWith(mockRawVote, mockRepo)).to.be
      .true;
  });

  it("should call saveVoteSummaryStub", async () => {
    const mockRawVote = generateMock(propublicaVoteWithPositionSchema);
    getRawVoteStub.resolves(mockRawVote);
    savePartySummaryStub.resolves();
    saveVoteSummaryStub.resolves();
    saveStateSummaryStub.resolves();

    await run("house", "123", mockRawRepo, mockRepo);
    expect(saveVoteSummaryStub.calledWith(mockRawVote, mockRepo)).to.be.true;
  });

  it("should call savePartySummaryStub twice", async () => {
    const mockRawVote = generateMock(propublicaVoteWithPositionSchema);
    getRawVoteStub.resolves(mockRawVote);
    savePartySummaryStub.resolves();
    saveVoteSummaryStub.resolves();
    saveStateSummaryStub.resolves();

    await run("house", "123", mockRawRepo, mockRepo);
    expect(savePartySummaryStub.calledTwice).to.be.true;
  });

  it("should call saveStateSummaryStub at least once", async () => {
    const mockRawVote = generateMock(propublicaVoteWithPositionSchema);
    getRawVoteStub.resolves(mockRawVote);
    savePartySummaryStub.resolves();
    saveVoteSummaryStub.resolves();
    saveStateSummaryStub.resolves();

    await run("house", "123", mockRawRepo, mockRepo);
    expect(saveStateSummaryStub.callCount).to.be.greaterThan(0);
  });
});
