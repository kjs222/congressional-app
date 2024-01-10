export const handler = async (_event: any = {}): Promise<any> => {
  console.log("event", _event);
  return { statusCode: 200 };
};
