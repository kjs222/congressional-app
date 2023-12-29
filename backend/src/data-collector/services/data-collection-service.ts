import { Chamber, LastVoteReceived } from "../../types";
import { RecentVote, VoteResult } from "../../types/propublica-schemas";
import { RawDataRepository } from "../ports/raw-data-repository";
import { VoteFetcher } from "../ports/vote-fetcher";

export const collectAndSaveData = async (
  repo: RawDataRepository,
  fetcher: VoteFetcher
) => {
  const batchId = new Date().getTime().toString();
  console.log(`Starting batch ${batchId}`);
  console.log("Collecting house votes");
  const houseVotes = await collectAndSaveDataForChamber(
    batchId,
    "house",
    repo,
    fetcher
  );
  console.log(`Processed ${houseVotes} house votes`);
  console.log("Collecting senate votes");
  const senateVotes = await collectAndSaveDataForChamber(
    batchId,
    "senate",
    repo,
    fetcher
  );
  console.log(`Processed ${senateVotes} senate votes`);
};

const collectAndSaveDataForChamber = async (
  batchId: string,
  chamber: Chamber,
  repo: RawDataRepository,
  fetcher: VoteFetcher
): Promise<number | null> => {
  const lastVoteReceived = await repo.getLastVoteReceived(chamber);
  const recentVoteData = await getRecentVoteData(
    chamber,
    lastVoteReceived,
    fetcher
  );
  console.log(`Found ${recentVoteData.length} new votes for ${chamber}`);
  if (recentVoteData.length === 0) return null;
  const { roll_call, date } = recentVoteData[recentVoteData.length - 1];
  const votes = await batchGetVotes(recentVoteData, fetcher);
  const rawVoteInputs = votes.map((vote) => {
    return {
      batchId,
      chamber: chamber,
      rollCall: vote.votes.vote.roll_call,
      rawVote: vote.votes.vote,
    };
  });
  console.log(`Saving ${rawVoteInputs.length} votes for ${chamber}`);
  await repo.saveRawVotes(rawVoteInputs);
  console.log(`Saving last vote received for ${chamber}`);
  await repo.saveLastVoteReceived(batchId, chamber, roll_call, date);
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
        lastVoteReceived && vote.roll_call === lastVoteReceived.rollCall;

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
