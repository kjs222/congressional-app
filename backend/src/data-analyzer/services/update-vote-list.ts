import { VoteResult } from "../../types/propublica-schemas";
import { VoteOverview } from "../../types/analyzed-data-schemas";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";

export const appendNewVoteToList = async (
  rawVote: VoteResult,
  repository: AnalyzedVoteRepository
) => {
  const vote = rawVote.votes.vote;
  const { congress, chamber, roll_call, session } = vote;

  const voteList: VoteOverview[] = await repository.getVoteList(
    congress,
    chamber
  );

  const voteOverview: VoteOverview = {
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

  voteList.push(voteOverview);

  const sortedByDateDesc = voteList.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return bDate.getTime() - aDate.getTime();
  });

  await repository.saveVoteList(congress, chamber, sortedByDateDesc);

  return sortedByDateDesc;
};
