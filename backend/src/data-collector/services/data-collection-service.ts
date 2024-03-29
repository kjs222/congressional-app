import { Chamber, LastVoteReceived } from "../../types";
import { RecentVote, VoteResult } from "../../types/propublica-schemas";
import { AnalyzerMessageSender } from "../ports/analyzer-message-sender";
import { RawDataRepository } from "../ports/raw-data-repository";
import { VoteFetcher } from "../ports/vote-fetcher";
import logger from "../../logger";

export const collectAndSaveData = async (
  repo: RawDataRepository,
  fetcher: VoteFetcher,
  analyzerMessageSender: AnalyzerMessageSender
) => {
  const batchId = new Date().getTime().toString();
  logger.info(`Starting batch ${batchId}`);
  logger.info("Collecting house votes");
  const houseVotes = await collectAndSaveDataForChamber(
    batchId,
    "house",
    repo,
    fetcher,
    analyzerMessageSender
  );
  logger.info(`Processed ${houseVotes} house votes`);
  logger.info("Collecting senate votes");
  const senateVotes = await collectAndSaveDataForChamber(
    batchId,
    "senate",
    repo,
    fetcher,
    analyzerMessageSender
  );
  logger.info(`Processed ${senateVotes} senate votes`);
};

const collectAndSaveDataForChamber = async (
  batchId: string,
  chamber: Chamber,
  repo: RawDataRepository,
  fetcher: VoteFetcher,
  analyzerMessageSender: AnalyzerMessageSender
): Promise<number | null> => {
  const lastVoteReceived = await repo.getLastVoteReceived(chamber);
  const recentVoteData = await getRecentVoteData(
    chamber,
    lastVoteReceived,
    fetcher
  );
  logger.info(`Found ${recentVoteData.length} new votes for ${chamber}`);
  if (recentVoteData.length === 0) return null;
  const { roll_call, date } = recentVoteData[0];
  const votes = await batchGetVotes(recentVoteData, fetcher);
  const rawVoteInputs = votes.map((vote) => {
    return {
      batchId,
      chamber: chamber,
      rollCall: vote.votes.vote.roll_call,
      rawVote: vote.votes.vote,
    };
  });
  logger.info(`Saving ${rawVoteInputs.length} votes for ${chamber}`);
  await repo.saveRawVotes(rawVoteInputs);
  logger.info(`Saving last vote received for ${chamber}`);
  await repo.saveLastVoteReceived(batchId, chamber, roll_call, date);

  for (const input of rawVoteInputs) {
    logger.info(
      `Sending message for ${input.batchId} ${input.chamber}-${input.rollCall}`
    );
    await analyzerMessageSender.send({
      part: input.batchId,
      sort: `${input.chamber}-${input.rollCall}`,
    });
  }
  return votes.length;
};

const getRecentVoteData = async (
  chamber: Chamber,
  lastVoteReceived: LastVoteReceived | null,
  fetcher: VoteFetcher
): Promise<RecentVote[]> => {
  let numReceived = 0;
  let foundLastVote = false;
  const newVotes: RecentVote[] = [];
  while (!foundLastVote) {
    const recentVotes = await fetcher.getRecentVotes(
      chamber,
      numReceived || undefined
    );
    numReceived = numReceived + recentVotes.votes.length;
    recentVotes.votes.forEach((vote: RecentVote) => {
      const isLastVote =
        lastVoteReceived &&
        Number(vote.roll_call) === Number(lastVoteReceived.rollCall);

      if (isLastVote) {
        foundLastVote = true;
      }

      if (!foundLastVote) {
        newVotes.push(vote);
      }

      const stopCondition =
        (!lastVoteReceived && newVotes.length === 60) || foundLastVote;

      if (stopCondition) {
        foundLastVote = true;
      }
    });
  }
  return newVotes;
};

const batchGetVotes = async (
  recentVotes: RecentVote[],
  fetcher: VoteFetcher
): Promise<VoteResult[]> => {
  const batchSize = 10;
  const votes: VoteResult[] = [];
  for (let i = 0; i < recentVotes.length; i += batchSize) {
    const batch = recentVotes.slice(i, i + batchSize);
    const batchVotes = await Promise.all(
      batch.map((vote) =>
        fetcher.getVote(
          vote.congress,
          vote.chamber,
          vote.session,
          vote.roll_call
        )
      )
    );
    votes.push(...batchVotes);
  }
  return votes;
};
