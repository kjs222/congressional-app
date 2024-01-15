import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";
import { RawDataRepository } from "../ports/raw-data-repository";
import { savePartySummary } from "./save-party-summary";
import { saveStateSummary } from "./save-state-summary";
import { saveVoteSummary } from "./save-vote-summary";
import { appendNewVoteToList } from "./update-vote-list";
import logger from "../../logger";

export const run = async (
  part: string,
  sort: string,
  rawVoteRepo: RawDataRepository,
  analyzedVoteRepo: AnalyzedVoteRepository
) => {
  const rawVote = await rawVoteRepo.getRawVote(part, sort);
  if (!rawVote) {
    logger.info(`No vote found for ${part}-${sort}`);
    return;
  }
  logger.info("Appending new vote to list");
  await appendNewVoteToList(rawVote, analyzedVoteRepo);

  logger.info("saving summary");
  await saveVoteSummary(rawVote, analyzedVoteRepo);

  logger.info("saving party summaries");
  await savePartySummary("democratic", rawVote, analyzedVoteRepo);
  await savePartySummary("republican", rawVote, analyzedVoteRepo);

  logger.info("saving state summaries");
  const states = rawVote.positions.map((p) => p.state);
  const uniqueStates = [...new Set(states)];
  for (const state of uniqueStates) {
    await saveStateSummary(state, rawVote, analyzedVoteRepo);
  }
};
