import { expect } from "chai";
import { simpleFaker } from "@faker-js/faker";
import { generateMock } from "@anatine/zod-mock";

import {
  voteSummaryWithIdSchema,
  partyVoteWithIdSchema,
  stateVoteWithIdSchema,
} from "../../../src/types/analyzed-data-schemas";
import { Chamber } from "../../../src/types";

import { DynamoAnalyzedVoteRepository as AnalyzerRepo } from "../../../src/data-analyzer/adapters/dynamo-analyzed-vote-repository";

import { handler } from "../../../src/api/handlers/vote-handler";

describe("handler", () => {
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

  context("when the query string is empty", () => {
    it("should return the expected response on a successful call", async () => {
      const result = await handler({
        pathParameters: { id: `${chamber}-${rollCall.toString()}` },
      });

      expect(result.statusCode).to.equal(200);

      expect(result.body).to.equal(
        JSON.stringify({
          status: "success",
          data: summaryAnalysis,
        })
      );
    });
  });

  context("when the query string is party", () => {
    it("should return the expected response on a successful call", async () => {
      const result = await handler({
        pathParameters: { id: `${chamber}-${rollCall.toString()}` },
        queryStringParameters: { party: "democratic" },
      });

      expect(result.statusCode).to.equal(200);

      expect(result.body).to.deep.equal(
        JSON.stringify({
          status: "success",
          data: demAnalysis,
        })
      );
    });
  });

  context("when the query string is state", () => {
    it("should return the expected response on a successful call", async () => {
      const result = await handler({
        pathParameters: { id: `${chamber}-${rollCall.toString()}` },
        queryStringParameters: { state: "CO" },
      });

      expect(result.statusCode).to.equal(200);

      expect(result.body).to.deep.equal(
        JSON.stringify({
          status: "success",
          data: stateAnalysis,
        })
      );
    });
  });
});
