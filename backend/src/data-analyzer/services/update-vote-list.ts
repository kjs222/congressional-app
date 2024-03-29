import { VoteWithPosition } from "../../types/propublica-schemas";
import { VoteOverviewWithId } from "../../types/analyzed-data-schemas";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";

export const appendNewVoteToList = async (
  rawVote: VoteWithPosition,
  repository: AnalyzedVoteRepository
) => {
  const vote = rawVote;
  const { congress, chamber, roll_call, session } = vote;

  const voteList: VoteOverviewWithId[] = await repository.getVoteList(
    congress,
    chamber
  );

  const voteOverview: VoteOverviewWithId = {
    id: `${congress}-${chamber}-${session}-${roll_call}`,
    congress,
    chamber,
    rollCall: roll_call,
    session,
    date: vote.date,
    question: vote.question,
    description: vote.description,
    result: vote.result,
    url: vote.url,
    billTitle: vote.bill?.title,
    billNumber: vote.bill?.number,
    billLatestAction: vote.bill?.latest_action,
  };

  // find index of vote with same id
  const voteIndex = voteList.findIndex((v) => v.id === voteOverview.id);
  // if found, replace it
  if (voteIndex >= 0) {
    voteList[voteIndex] = voteOverview;
  } else {
    // if not found, append it
    voteList.push(voteOverview);
  }

  const sortedByDateDesc = voteList.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return bDate.getTime() - aDate.getTime();
  });

  await repository.saveVoteList(congress, chamber, sortedByDateDesc);

  return sortedByDateDesc;
};
