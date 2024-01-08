export interface AnalyzerMessageSender {
  send(message: AnalyzerMessage): Promise<any>;
}

export interface AnalyzerMessage {
  part: string;
  sort: string;
}
