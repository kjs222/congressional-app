import { DynamoAnalyzedVoteRepository } from "../adapters/dynamo-analyzed-vote-repository";
export const handler = async (_event: any = {}): Promise<any> => {
  console.log("event", _event);

  const queryStringParameters = _event.queryStringParameters || {};
  if (!queryStringParameters.chamber) {
    return { statusCode: 400, body: "Missing chamber" };
  }

  const chamber = queryStringParameters.chamber;

  if (chamber !== "house" && chamber !== "senate") {
    return { statusCode: 400, body: "Invalid chamber" };
  }

  const repo = new DynamoAnalyzedVoteRepository();
  const data = await repo.getVotes(chamber);
  console.log("data", data);
  return { statusCode: 200, body: JSON.stringify({ status: "success", data }) };
};
