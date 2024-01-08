import {
  AnalyzerMessage,
  AnalyzerMessageSender,
} from "../ports/analyzer-message-sender";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SQSAnalyzerMessageSender implements AnalyzerMessageSender {
  private readonly client = new SQSClient({ region: "us-east-1" });
  private readonly queueUrl = process.env.ANALYZER_MESSAGE_QUEUE_URL || "";

  async send(message: AnalyzerMessage): Promise<any> {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    });

    const response = await this.client.send(command);
    console.log(JSON.stringify(response));
    return;
  }
}
