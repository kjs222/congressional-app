import { expect } from "chai";
import { simpleFaker } from "@faker-js/faker";

import { DynamoRawDataRepository } from "../../../src/data-collector/adapters/dynamo-raw-data-repository";
import { Chamber } from "../../../src/types";
import { RawVoteInput } from "../../../src/data-collector/ports/raw-data-repository";

describe("DynamoRawDataRepository", () => {
  describe("saveLastVoteReceived", () => {
    it("should return the expected response on a successful call", async () => {
      const repo = new DynamoRawDataRepository();
      const batchId = simpleFaker.string.alphanumeric(10);
      const chamber = simpleFaker.string.alphanumeric(10);

      const response = await repo.saveLastVoteReceived(
        batchId,
        chamber as Chamber,
        123,
        "2021-01-01"
      );
      expect(response).to.deep.equal({ batchId, chamber });
    });
  });

  describe("getLastVoteReceived", () => {
    it("should return the expected response on a successful call", async () => {
      const repo = new DynamoRawDataRepository();
      const batchId = simpleFaker.string.alphanumeric(10);
      const chamber = simpleFaker.string.alphanumeric(10);

      await repo.saveLastVoteReceived(
        batchId,
        chamber as Chamber,
        123,
        "2021-01-01"
      );

      const response = await repo.getLastVoteReceived(chamber as Chamber);
      expect(response).to.deep.equal({
        batchId,
        chamber,
        date: "2021-01-01",
        rollCall: 123,
      });
    });
  });

  describe("saveRawVote", () => {
    it.only("should return the expected response on a successful call", async () => {
      const repo = new DynamoRawDataRepository();
      const batchId = simpleFaker.string.alphanumeric(10);
      const chamber = simpleFaker.string.alphanumeric(10) as Chamber;
      const rollCall = simpleFaker.number.int(1000);
      const input = {
        batchId,
        chamber,
        rollCall,
        rawVote: { foo: "bar" },
      } as unknown as RawVoteInput;

      const response = await repo.saveRawVotes([input]);
      expect(response).to.be.undefined;

      const getVote = await repo.getRawVote(batchId, chamber, rollCall);
      expect(getVote).to.deep.equal({ foo: "bar" });
    });
  });
});
