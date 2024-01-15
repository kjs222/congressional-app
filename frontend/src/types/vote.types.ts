export interface VoteOverview {
  id: string;
  chamber: string;
  congress: string;
  rollCall: string;
  session: string;
  description: string;
  question: string;
  result: string;
}

export interface VoteSummary {
  id: string;
  totalYes: number;
  totalNo: number;
  totalNotVoting: number;
  totalPresent: number;
  democraticPosition: string;
  republicanPosition: string;
  percentYes: number;
  percentNo: number;
  result: string;
}
