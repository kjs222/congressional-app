export interface VoteOverview {
  id: string;
  chamber: string;
  congress: string;
  rollCall: string;
  session: string;
  date: string;
  description: string;
  question: string;
  result: string;
  url: string;
  billTitle?: string;
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

export interface PartyVote {
  party: string;
  totalYes: number;
  totalNo: number;
  totalNotVoting: number;
  totalPresent: number;
  percentYes: number;
  percentNo: number;
  position: string;
  percentVoteWithParty: number | null;
  yesVoters: string[];
  noVoters: string[];
  notVoting: string[];
  presentVoters: string[];
}
