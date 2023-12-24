export const handler = async (event: any = {}): Promise<any> => {
  console.log(event);
  return { message: "hello world" };
};
