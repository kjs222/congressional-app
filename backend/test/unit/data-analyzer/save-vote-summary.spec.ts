import { expect } from "chai";
import { stub, restore, SinonStub } from "sinon";
import { generateMock } from "@anatine/zod-mock";

import { AnalyzedVoteRepository } from "../../../src/data-analyzer/ports/analyzed-vote-repository";

import { propublicaVoteWithPositionSchema } from "../../../src/types/propublica-schemas";
import { saveVoteSummary } from "../../../src/data-analyzer/services/save-vote-summary";

describe("saveVoteSummary", () => {
  let saveVoteAnalysisStub: SinonStub;
  let mockRepo: AnalyzedVoteRepository;

  beforeEach(() => {
    restore();
    saveVoteAnalysisStub = stub();
    mockRepo = {
      saveVoteAnalysis: saveVoteAnalysisStub,
      getVoteList: stub(),
      saveVoteList: stub(),
    };
  });

  it("should call saveVoteAnalysis with the correct params", async () => {
    const mockRawVote = generateMock(propublicaVoteWithPositionSchema);
    await saveVoteSummary(mockRawVote, mockRepo);
    expect(saveVoteAnalysisStub.calledOnce).to.be.true;
    expect(saveVoteAnalysisStub.args[0][0].key).to.equal(
      `${mockRawVote.congress}-${mockRawVote.chamber}-${mockRawVote.session}-${mockRawVote.roll_call}`
    );
    expect(saveVoteAnalysisStub.args[0][0].sort).to.equal("summary");
  });
});
