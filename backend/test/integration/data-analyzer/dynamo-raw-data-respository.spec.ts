import { expect } from "chai";
import { simpleFaker } from "@faker-js/faker";

import { DynamoRawDataRepository } from "../../../src/data-analyzer/adapters/dynamo-raw-data-repository";
import { DynamoRawDataRepository as CollectorRepo } from "../../../src/data-collector/adapters/dynamo-raw-data-repository";

import { propublicaVoteWithPositionSchema } from "../../../src/types/propublica-schemas";
import { Chamber } from "../../../src/types";
import { generateMock } from "@anatine/zod-mock";

describe("DynamoRawDataRepository", () => {
  const batchId = simpleFaker.string.alphanumeric(10);
  const chamber = simpleFaker.string.alphanumeric(10) as Chamber;
  const rollCallGood = simpleFaker.number.int(1000);
  const rollCallBad = rollCallGood + 1;
  const validVote = generateMock(propublicaVoteWithPositionSchema);

  before(async () => {
    const collectorRepo = new CollectorRepo();

    await collectorRepo.saveRawVotes([
      {
        batchId,
        chamber,
        rollCall: rollCallGood,
        rawVote: validVote,
      },
      {
        batchId,
        chamber,
        rollCall: rollCallBad,
        rawVote: { foo: "bar" },
      },
    ]);
  });

  describe("getRawVote", () => {
    it("should return the expected response on a successful call", async () => {
      const repo = new DynamoRawDataRepository();
      const sort = `${chamber}-${rollCallGood.toString()}`;
      const result = await repo.getRawVote(batchId, sort);
      expect(result).to.deep.equal(validVote);
    });

    it("should return null if the vote is not found", async () => {
      const repo = new DynamoRawDataRepository();
      const sort = "anything";
      const result = await repo.getRawVote(batchId, sort);
      expect(result).to.be.null;
    });

    it("should throw an error if the vote is not expected format", async () => {
      const repo = new DynamoRawDataRepository();
      const sort = `${chamber}-${rollCallBad.toString()}`;
      try {
        await repo.getRawVote(batchId, sort);
        expect.fail("Should have thrown an error");
      } catch (e) {
        const err = e as Error;
        expect(err.name).to.equal("Error");
      }
    });
  });
});
