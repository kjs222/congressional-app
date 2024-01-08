import { PartyVote } from "../../types/analyzed-data-schemas";
import { VoteResult } from "../../types/propublica-schemas";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";

export const savePartySummary = async (
  party: "democratic" | "republican",
  rawVote: VoteResult,
  repository: AnalyzedVoteRepository
) => {
  const vote = rawVote.votes.vote;
  const { congress, chamber, session, roll_call } = vote;
  const key = `${congress}-${chamber}-${session}-${roll_call}}`;

  const partyVotes = vote[party]!;

  const totalVotes = partyVotes.yes + partyVotes.no + partyVotes.present;
  const majorityPosition = partyVotes.majority_position.toLowerCase() as
    | "yes"
    | "no"
    | "not_voting"
    | "present";
  const voteWithParty = partyVotes[majorityPosition];
  const partyPositions = vote.positions.filter((p) => p.party === party);

  const { yes, no, not_voting, present } = partyPositions.reduce(
    (
      acc: {
        yes: string[];
        no: string[];
        not_voting: string[];
        present: string[];
      },
      position
    ) => {
      const positionVote = position.vote_position.toLowerCase() as
        | "yes"
        | "no"
        | "not_voting"
        | "present";
      acc[positionVote].push(position.name);
      return acc;
    },
    { yes: [], no: [], not_voting: [], present: [] }
  );

  const percentValue = (value: number) => {
    return Math.round(value * 10000) / 100;
  };

  const summary: PartyVote = {
    party,
    totalYes: partyVotes.yes,
    totalNo: partyVotes.no,
    totalNotVoting: partyVotes.not_voting || 0,
    totalPresent: partyVotes.present || 0,
    percentYes: percentValue(partyVotes.yes / totalVotes),
    percentNo: percentValue(partyVotes.no / totalVotes),
    position: partyVotes.majority_position || "unknown",
    percentVoteWithParty: voteWithParty
      ? percentValue(voteWithParty / totalVotes)
      : null,
    yesVoters: yes,
    noVoters: no,
    notVoting: not_voting,
    presentVoters: present,
  };

  await repository.saveVoteAnalysis({
    key,
    sort: `party-${party}`,
    analysis: summary,
  });
};
