import { SQSEvent, SQSHandler } from "aws-lambda";

import { run } from "./services/orchestrator";

import { DynamoRawDataRepository } from "./adapters/dynamo-raw-data-repository";
import { DynamoAnalyzedVoteRepository } from "./adapters/dynamo-analyzed-vote-repository";

const rawDataRepo = new DynamoRawDataRepository();
const analyzedVoteRepo = new DynamoAnalyzedVoteRepository();

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log("Received event", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const { part, sort } = JSON.parse(record.body);
    await run(part, sort, rawDataRepo, analyzedVoteRepo);
  }
};
