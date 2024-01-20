import {
  CreateTableCommand,
  DynamoDBClient,
  ScalarAttributeType,
  AttributeDefinition,
  KeySchemaElement,
  BillingMode,
} from "@aws-sdk/client-dynamodb";

const dynamoDBConfig = {
  region: "localhost",
  endpoint: "http://localhost:8000",
};

const ddb = new DynamoDBClient(dynamoDBConfig);

const rawTableParams = {
  TableName: "congressDataCollectorRaw",
  KeySchema: [
    { AttributeName: "part", KeyType: "HASH" },
    { AttributeName: "sort", KeyType: "RANGE" },
  ] as KeySchemaElement[],
  AttributeDefinitions: [
    { AttributeName: "part", AttributeType: ScalarAttributeType.S },
    { AttributeName: "sort", AttributeType: ScalarAttributeType.S },
  ] as AttributeDefinition[],
  BillingMode: "PAY_PER_REQUEST" as BillingMode,
};

const analyzedTableParams = {
  TableName: "congressAnalyzedVotes",
  KeySchema: [
    { AttributeName: "part", KeyType: "HASH" },
    { AttributeName: "sort", KeyType: "RANGE" },
  ] as KeySchemaElement[],
  AttributeDefinitions: [
    { AttributeName: "part", AttributeType: ScalarAttributeType.S },
    { AttributeName: "sort", AttributeType: ScalarAttributeType.S },
  ] as AttributeDefinition[],
  BillingMode: "PAY_PER_REQUEST" as BillingMode,
};

export const run = async () => {
  try {
    await ddb.send(new CreateTableCommand(rawTableParams));
    await ddb.send(new CreateTableCommand(analyzedTableParams));
    console.log("Tables created successfully");
  } catch (err) {
    console.log("Error", err);
  }
};

(async () => {
  await run();
})();
