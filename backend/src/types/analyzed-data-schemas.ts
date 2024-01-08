import { z } from "zod";

export const voteOverviewSchema = z.object({
  chamber: z.string(),
  congress: z.number(),
  rollCall: z.number(),
  session: z.number(),
  date: z.string(),
  question: z.string(),
  description: z.string(),
  result: z.string(),
  url: z.string().url(),
  billTitle: z.string().optional().nullable(),
  billNumber: z.string().optional().nullable(),
  billLatestAction: z.string().optional().nullable(),
});

export const voteOverviewRecordSchema = z.object({
  part: z.string(), // "all-votes"
  sort: z.string(), // "<congress>-<chamber>"
  orderedVotes: z.array(voteOverviewSchema),
  lastVote: z.string().datetime(),
});

export const voteSummarySchema = z.object({
  result: z.string(),
  percentYes: z.number(),
  percentNo: z.number(),
  totalYes: z.number(),
  totalNo: z.number(),
  totalNotVoting: z.number(),
  totalPresent: z.number(),
  democraticPosition: z.string(),
  republicanPosition: z.string(),
});

export const voteSummaryRecordSchema = z.object({
  part: z.string(), // "<congress>-<chamber>-<session>-<rollCall>"
  sort: z.string(), // "summary"
  analysis: voteSummarySchema,
});

export const partyVoteSchema = z.object({
  party: z.string(),
  totalYes: z.number(),
  totalNo: z.number(),
  totalNotVoting: z.number(),
  totalPresent: z.number(),
  percentYes: z.number(),
  percentNo: z.number(),
  position: z.string(),
  percentVoteWithParty: z.number().nullable(),
  yesVoters: z.array(z.string()),
  noVoters: z.array(z.string()),
  notVoting: z.array(z.string()),
  presentVoters: z.array(z.string()),
});

export const partyVoteRecordSchema = z.object({
  part: z.string(), // "<congress>-<chamber>-<session>-<rollCall>"
  sort: z.string(), // "party-<party abbreviation>"
  analysis: partyVoteSchema,
});

export const stateVoteSchema = z.object({
  state: z.string(),
  totalYes: z.number(),
  totalNo: z.number(),
  totalNotVoting: z.number(),
  totalPresent: z.number(),
  percentYes: z.number(),
  percentNo: z.number(),
  position: z.string(),
  yesRepublicanVoters: z.array(z.string()),
  yesDemocraticVoters: z.array(z.string()),
  yesIndependentVoters: z.array(z.string()),
  noRepublicanVoters: z.array(z.string()),
  noDemocraticVoters: z.array(z.string()),
  noIndependentVoters: z.array(z.string()),
  presentVoters: z.array(z.string()),
  notVoting: z.array(z.string()),
});

export const stateVoteRecordSchema = z.object({
  part: z.string(), // "<congress>-<chamber>-<session>-<rollCall>"
  sort: z.string(), // "state-<state abbreviation>"
  analysis: stateVoteSchema,
});

export type VoteOverview = z.infer<typeof voteOverviewSchema>;
export type VoteOverviewRecord = z.infer<typeof voteOverviewRecordSchema>;

export type VoteSummary = z.infer<typeof voteSummarySchema>;
export type VoteSummaryRecord = z.infer<typeof voteSummaryRecordSchema>;

export type PartyVote = z.infer<typeof partyVoteSchema>;
export type PartyVoteRecord = z.infer<typeof partyVoteRecordSchema>;

export type StateVote = z.infer<typeof stateVoteSchema>;
export type StateVoteRecord = z.infer<typeof stateVoteRecordSchema>;
