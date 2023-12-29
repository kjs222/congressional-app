import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { DynamoRawDataRepository } from "../data-collector/adapters/dynamo-raw-data-repository";
import { ProPublicaVoteFetcher } from "../data-collector/adapters/propublica-vote-fetcher";
import { collectAndSaveData } from "../data-collector/services/data-collection-service";

export const handler = async (event: any = {}): Promise<any> => {
  const apiKey = await getAPIKeyFromSecretsManager();
  const repo = new DynamoRawDataRepository();
  const fetcher = new ProPublicaVoteFetcher(apiKey);
  try {
    await collectAndSaveData(repo, fetcher);
    return { statusCode: 200 };
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

const getAPIKeyFromSecretsManager = async (): Promise<string> => {
  const secretArn = process.env.PRO_PUBLICA_API_KEY_SECRET_ARN!;
  const secretsManagerClient = new SecretsManagerClient({
    region: "us-east-1",
  });

  const getSecretValueCommand = new GetSecretValueCommand({
    SecretId: secretArn,
  });

  const result = await secretsManagerClient.send(getSecretValueCommand);

  return result.SecretString!;
};
