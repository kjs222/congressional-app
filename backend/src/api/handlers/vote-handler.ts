import { DynamoAnalyzedVoteRepository } from "../adapters/dynamo-analyzed-vote-repository";

export const handler = async (_event: any = {}): Promise<any> => {
  const headers = {
    "Access-Control-Allow-Origin":
      "http://kjs222-congressional-application.s3-website-us-east-1.amazonaws.com",
    "Access-Control-Allow-Credentials": true,
  };

  const pathParameters = _event.pathParameters || {};
  const partitionKey = pathParameters.id;

  const queryStringParameters = _event.queryStringParameters || {};
  const repo = new DynamoAnalyzedVoteRepository();

  if (queryStringParameters.party) {
    const party = queryStringParameters.party;
    const data = await repo.getVotePartyDetail(partitionKey, party);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "success", data }),
    };
  }

  if (queryStringParameters.state) {
    const state = queryStringParameters.state;
    const data = await repo.getVoteStateDetail(partitionKey, state);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "success", data }),
    };
  }

  const data = await repo.getVoteSummary(partitionKey);
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ status: "success", data }),
  };
};

/* 

{
  version: '2.0',
  routeKey: 'GET /vote/{id}',
  rawPath: '/vote/test',
  rawQueryString: 'hi=tayto',
  queryStringParameters: { hi: 'tayto' },
  requestContext: {
    http: {
      method: 'GET',
      path: '/vote/test',
      protocol: 'HTTP/1.1',
      sourceIp: '54.86.50.139',
      userAgent: 'PostmanRuntime/7.36.0'
    },
    requestId: 'RTqPcifVoAMEMgg=',
    routeKey: 'GET /vote/{id}',
    stage: '$default',
    time: '10/Jan/2024:04:58:36 +0000',
    timeEpoch: 1704862716129
  },
  pathParameters: { id: 'test' },
  isBase64Encoded: false
}

*/
