import { DynamoAnalyzedVoteRepository } from "../adapters/dynamo-analyzed-vote-repository";
export const handler = async (_event: any = {}): Promise<any> => {
  const headers = {
    "Access-Control-Allow-Origin":
      "http://kjs222-congressional-application.s3-website-us-east-1.amazonaws.com",
    "Access-Control-Allow-Credentials": true,
  };

  console.log("event", _event);

  const queryStringParameters = _event.queryStringParameters || {};
  if (!queryStringParameters.chamber) {
    return { statusCode: 400, headers, body: "Missing chamber" };
  }

  const chamber = queryStringParameters.chamber;

  if (chamber !== "house" && chamber !== "senate") {
    return { statusCode: 400, headers, body: "Invalid chamber" };
  }

  const repo = new DynamoAnalyzedVoteRepository();
  const data = await repo.getVotes(chamber);
  console.log("data", data);
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ status: "success", data }),
  };
};
