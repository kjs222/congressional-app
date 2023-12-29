import { number, z } from "zod";

export const ddbLatestSchema = z.object({
  part: z.object({ S: z.string() }),
  sort: z.object({ S: z.string() }),
  rollCall: z.object({ N: z.number() }),
  date: z.object({ S: z.string() }),
  batchId: z.object({ S: z.string() }),
});
