import { z } from "zod";

const propublicaVoteBreakdownSchema = z.object({
  yes: z.number(),
  no: z.number(),
  present: z.number(),
  not_voting: z.number().optional(),
});

const propublicaPartyVoteBreakdownSchema = propublicaVoteBreakdownSchema.extend(
  { majority_position: z.string() }
);

const propublicaVoteSchema = z.object({
  chamber: z.string(), // add options?
  congress: z.number(),
  session: z.number(),
  roll_call: z.number(),
  source: z.string(),
  url: z.string(),
  vote_uri: z.string().optional(),
  bill: z.object({
    bill_id: z.string().optional(),
    number: z.string().optional(),
    api_uri: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    latest_action: z.string().nullable().optional(),
  }),
  // amendment: z.string(),
  question: z.string(),
  description: z.string(),
  vote_type: z.string(), // add options?
  date: z.string(), // can i do datestring?
  time: z.string(),
  result: z.string(), // add options?
  tie_breaker: z.string().optional(),
  tie_breaker_vote: z.string().optional(),
  democratic: propublicaPartyVoteBreakdownSchema,
  republican: propublicaPartyVoteBreakdownSchema,
  independent: propublicaVoteBreakdownSchema,
  total: propublicaVoteBreakdownSchema,
});

const propublicaPositionSchema = z.object({
  member_id: z.string(),
  name: z.string(),
  party: z.string(), // add options?
  state: z.string(),
  district: z.string().optional(),
  vote_position: z.string(), // add options?
  dw_nominate: z.number().nullable(),
});

const propublicaVoteWithPositionSchema = propublicaVoteSchema.extend({
  positions: z.array(propublicaPositionSchema),
});

export const propublicaRecentVotesSchema = z.object({
  chamber: z.string(),
  num_results: z.number(),
  offset: z.number(),
  votes: z.array(propublicaVoteSchema),
});

export const propublicaVoteResultSchema = z.object({
  votes: z.object({
    vote: propublicaVoteWithPositionSchema,
  }),
});

export type RecentVotesResponse = z.infer<typeof propublicaRecentVotesSchema>;
export type RecentVote = z.infer<typeof propublicaVoteSchema>;

export type VoteResult = z.infer<typeof propublicaVoteResultSchema>;
