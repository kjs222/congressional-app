import { number, z } from "zod";

export const ddbLatestSchema = z.object({
  part: z.string(),
  sort: z.string(), // TODO: make this an enum
  rollCall: z.number(),
  date: z.string(),
  batchId: z.string(),
});
