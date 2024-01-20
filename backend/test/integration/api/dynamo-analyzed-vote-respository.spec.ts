import { expect } from "chai";
import { simpleFaker } from "@faker-js/faker";
import { generateMock } from "@anatine/zod-mock";

import {
  voteSummaryWithIdSchema,
  partyVoteWithIdSchema,
  stateVoteWithIdSchema,
} from "../../../src/types/analyzed-data-schemas";

import { DynamoAnalyzedVoteRepository as AnalyzerRepo } from "../../../src/data-analyzer/adapters/dynamo-analyzed-vote-repository";
import { DynamoAnalyzedVoteRepository as ApiRepo } from "../../../src/api/adapters/dynamo-analyzed-vote-repository";

import { Chamber } from "../../../src/types";

describe("DynamoAnalyzedVoteRepository", () => {
  const chamber = simpleFaker.string.alphanumeric(10) as Chamber;
  const rollCall = simpleFaker.number.int(1000);

  const summaryAnalysis = generateMock(voteSummaryWithIdSchema);
  const demAnalysis = generateMock(partyVoteWithIdSchema);
  const stateAnalysis = generateMock(stateVoteWithIdSchema);

  before(async () => {
    const analyzerRepo = new AnalyzerRepo();
    await Promise.all([
      analyzerRepo.saveVoteAnalysis({
        key: `${chamber}-${rollCall.toString()}`,
        sort: "summary",
        analysis: summaryAnalysis,
      }),
      analyzerRepo.saveVoteAnalysis({
        key: `${chamber}-${rollCall.toString()}`,
        sort: "state-CO",
        analysis: stateAnalysis,
      }),
      analyzerRepo.saveVoteAnalysis({
        key: `${chamber}-${rollCall.toString()}`,
        sort: "party-democratic",
        analysis: demAnalysis,
      }),
    ]);
  });
  describe("getVoteSummary", () => {
    it("should return the expected response on a successful call", async () => {
      const repo = new ApiRepo();
      const part = `${chamber}-${rollCall.toString()}`;
      const result = await repo.getVoteSummary(part);
      expect(result).to.deep.equal(summaryAnalysis);
    });
  });
  describe("getVoteStateDetail", () => {
    it("should return the expected response on a successful call", async () => {
      const repo = new ApiRepo();
      const part = `${chamber}-${rollCall.toString()}`;
      const state = "CO";
      const result = await repo.getVoteStateDetail(part, state);
      expect(result).to.deep.equal(stateAnalysis);
    });
  });
  describe("getVotePartyDetail", () => {
    it("should return the expected response on a successful call", async () => {
      const repo = new ApiRepo();
      const part = `${chamber}-${rollCall.toString()}`;
      const party = "democratic";
      const result = await repo.getVotePartyDetail(part, party);
      expect(result).to.deep.equal(demAnalysis);
    });
  });
});
