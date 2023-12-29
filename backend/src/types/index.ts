export type Chamber = "senate" | "house";
export const allChambers: Chamber[] = ["senate", "house"];

export interface LastVoteReceived {
  chamber: Chamber;
  rollCall: number;
  date: string;
  batchId: string;
}
