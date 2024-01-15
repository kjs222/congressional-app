import {
  AnalyzerMessage,
  AnalyzerMessageSender,
} from "../ports/analyzer-message-sender";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import * as crypto from "crypto";
import logger from "../../logger";

export class SQSAnalyzerMessageSender implements AnalyzerMessageSender {
  private readonly client = new SQSClient({ region: "us-east-1" });
  private readonly queueUrl = process.env.ANALYZER_MESSAGE_QUEUE_URL || "";

  async send(message: AnalyzerMessage): Promise<any> {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
      MessageGroupId: `${message.part}${message.sort}`,
      MessageDeduplicationId: this.createHash(message),
    });

    const response = await this.client.send(command);
    logger.info("Sent message to SQS", { response });
    return;
  }

  private createHash(message: AnalyzerMessage): string {
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(message));
    return hash.digest("hex");
  }
}
