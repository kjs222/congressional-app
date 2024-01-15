import { expect } from "chai";
import { stub, restore, SinonStub } from "sinon";

import { DynamoAnalyzedVoteRepository } from "../../../src/api/adapters/dynamo-analyzed-vote-repository";

import { handler } from "../../../src/api/handlers/vote-handler";

describe("handler", () => {
  describe("handler", () => {
    let getVoteSummaryStub: SinonStub;
    let getPartyDetailStub: SinonStub;
    let getStateDetailStub: SinonStub;

    beforeEach(() => {
      restore();
      getVoteSummaryStub = stub(
        DynamoAnalyzedVoteRepository.prototype,
        "getVoteSummary"
      );
      getPartyDetailStub = stub(
        DynamoAnalyzedVoteRepository.prototype,
        "getVotePartyDetail"
      );
      getStateDetailStub = stub(
        DynamoAnalyzedVoteRepository.prototype,
        "getVoteStateDetail"
      );
    });

    it("should call getVoteSummary with the correct params when no query params present", async () => {
      getVoteSummaryStub.resolves(null);
      await handler({ pathParameters: { id: "123" } });
      expect(getVoteSummaryStub.calledWith("123")).to.be.true;
    });

    it("should call getVotePartyDetail with the correct params when query params present", async () => {
      getVoteSummaryStub.resolves(null);
      await handler({
        pathParameters: { id: "123" },
        queryStringParameters: { party: "democratic" },
      });
      expect(getPartyDetailStub.calledWith("123", "democratic")).to.be.true;
    });

    it("should call getVoteStateDetail with the correct params when query params present", async () => {
      getVoteSummaryStub.resolves(null);
      await handler({
        pathParameters: { id: "123" },
        queryStringParameters: { state: "CO" },
      });
      expect(getStateDetailStub.calledWith("123", "CO")).to.be.true;
    });

    it("should return the expected response on a successful call", async () => {
      getVoteSummaryStub.resolves({
        any: "thing",
      });
      const response = await handler({
        pathParameters: { id: "123" },
      });
      expect(response).to.deep.include({
        statusCode: 200,
        body: JSON.stringify({ status: "success", data: { any: "thing" } }),
      });
    });
  });
});
