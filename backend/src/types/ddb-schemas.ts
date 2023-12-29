import { z } from "zod";

export const ddbLatestSchema = z.object({
  part: z.object({ S: z.string() }),
  sort: z.object({ S: z.string() }),
  rollCall: z.object({ N: z.any() }),
  date: z.object({ S: z.string() }),
  batchId: z.object({ S: z.string() }),
});
