import { VoteResult } from "../../types/propublica-schemas";
import { VoteSummary } from "../../types/analyzed-data-schemas";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";

export const saveVoteSummary = async (
  rawVote: VoteResult,
  repository: AnalyzedVoteRepository
) => {
  const vote = rawVote.votes.vote;
  const { congress, chamber, session, roll_call } = vote;
  const key = `${congress}-${chamber}-${session}-${roll_call}}`;

  const totalVotes = vote.total.yes + vote.total.no + vote.total.present;

  const percentValue = (value: number) => {
    return Math.round(value * 10000) / 100;
  };

  const summary: VoteSummary = {
    result: vote.result,
    percentYes: percentValue(vote.total.yes / totalVotes),
    percentNo: percentValue(vote.total.no / totalVotes),
    totalYes: vote.total.yes,
    totalNo: vote.total.no,
    totalNotVoting: vote.total.not_voting || 0,
    totalPresent: vote.total.present || 0,
    democraticPosition: vote.democratic?.majority_position || "unknown",
    republicanPosition: vote.democratic?.majority_position || "unknown",
  };

  await repository.saveVoteAnalysis({
    key,
    sort: "summary",
    analysis: summary,
  });
};
