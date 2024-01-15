import { expect } from "chai";
import { stub, restore, SinonStub } from "sinon";

import { DynamoAnalyzedVoteRepository } from "../../../src/api/adapters/dynamo-analyzed-vote-repository";

import { handler } from "../../../src/api/handlers/votes-handler";

describe("handler", () => {
  describe("handler", () => {
    let getVotesStub: SinonStub;

    beforeEach(() => {
      restore();
      getVotesStub = stub(DynamoAnalyzedVoteRepository.prototype, "getVotes");
    });

    it("should call getVotes with the correct params when a valid query param present", async () => {
      getVotesStub.resolves([]);
      await handler({ queryStringParameters: { chamber: "house" } });
      expect(getVotesStub.calledWith("house")).to.be.true;
    });

    it("should return the expected response on a successful call", async () => {
      getVotesStub.resolves([]);
      const response = await handler({
        queryStringParameters: { chamber: "house" },
      });
      expect(response).to.deep.include({
        statusCode: 200,
        body: JSON.stringify({ status: "success", data: [] }),
      });
    });

    it("should return the expected response on an invalid request without a chamber", async () => {
      const response = await handler({});
      expect(response).to.deep.include({
        statusCode: 400,
        body: "Missing chamber",
      });
    });

    it("should return the expected response on an invalid request with a bad chamber", async () => {
      const response = await handler({
        queryStringParameters: { chamber: "bad" },
      });
      expect(response).to.deep.include({
        statusCode: 400,
        body: "Invalid chamber",
      });
    });
  });
});
