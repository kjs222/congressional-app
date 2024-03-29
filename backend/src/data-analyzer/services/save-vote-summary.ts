import { VoteWithPosition } from "../../types/propublica-schemas";
import { VoteSummaryWithId } from "../../types/analyzed-data-schemas";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";

export const saveVoteSummary = async (
  rawVote: VoteWithPosition,
  repository: AnalyzedVoteRepository
) => {
  const vote = rawVote;
  const { congress, chamber, session, roll_call } = vote;
  const key = `${congress}-${chamber}-${session}-${roll_call}`;

  const totalVotes = vote.total.yes + vote.total.no + vote.total.present;

  const percentValue = (value: number) => {
    return Math.round(value * 10000) / 100;
  };

  const summary: VoteSummaryWithId = {
    id: key,
    result: vote.result,
    percentYes: percentValue(vote.total.yes / totalVotes),
    percentNo: percentValue(vote.total.no / totalVotes),
    totalYes: vote.total.yes,
    totalNo: vote.total.no,
    totalNotVoting: vote.total.not_voting || 0,
    totalPresent: vote.total.present || 0,
    democraticPosition: vote.democratic?.majority_position || "unknown",
    republicanPosition: vote.republican?.majority_position || "unknown",
  };

  await repository.saveVoteAnalysis({
    key,
    sort: "summary",
    analysis: summary,
  });
};
