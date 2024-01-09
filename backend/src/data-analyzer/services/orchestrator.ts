import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";
import { RawDataRepository } from "../ports/raw-data-repository";
import { savePartySummary } from "./save-party-summary";
import { saveStateSummary } from "./save-state-summary";
import { saveVoteSummary } from "./save-vote-summary";
import { appendNewVoteToList } from "./update-vote-list";

export const run = async (
  part: string,
  sort: string,
  rawVoteRepo: RawDataRepository,
  analyzedVoteRepo: AnalyzedVoteRepository
) => {
  const rawVote = await rawVoteRepo.getRawVote(part, sort);
  if (!rawVote) {
    console.log(`No vote found for ${part}-${sort}`);
    return;
  }
  console.log("Appending new vote to list");
  await appendNewVoteToList(rawVote, analyzedVoteRepo);

  console.log("saving summary");
  await saveVoteSummary(rawVote, analyzedVoteRepo);

  console.log("saving party summaries");
  await savePartySummary("democratic", rawVote, analyzedVoteRepo);
  await savePartySummary("republican", rawVote, analyzedVoteRepo);

  console.log("saving state summaries");
  const states = rawVote.positions.map((p) => p.state);
  const uniqueStates = [...new Set(states)];
  for (const state of uniqueStates) {
    await saveStateSummary(state, rawVote, analyzedVoteRepo);
  }
};
