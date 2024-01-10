export const handler = async (_event: any = {}): Promise<any> => {
  console.log("event", _event);
  return { statusCode: 200 };
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
