import { PartyVoteWithId } from "../../types/analyzed-data-schemas";
import { VoteWithPosition } from "../../types/propublica-schemas";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";

export const savePartySummary = async (
  party: "democratic" | "republican",
  rawVote: VoteWithPosition,
  repository: AnalyzedVoteRepository
) => {
  const { congress, chamber, session, roll_call } = rawVote;
  const key = `${congress}-${chamber}-${session}-${roll_call}`;

  const partyVotes = rawVote[party]!;

  const totalVotes = partyVotes.yes + partyVotes.no + partyVotes.present;
  const majorityPosition = partyVotes.majority_position.toLowerCase() as
    | "yes"
    | "no"
    | "not_voting"
    | "present";
  const voteWithParty = partyVotes[majorityPosition];

  const partyPositions = rawVote.positions.filter(
    (p) => p.party.toLowerCase() === party[0].toLowerCase()
  );

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
      let positionVote = position.vote_position.toLowerCase() as
        | "yes"
        | "no"
        | "not_voting"
        | "present"
        | "not voting";
      if (positionVote === "not voting") {
        positionVote = "not_voting";
      }

      if (!acc[positionVote]) {
        console.log(`unexpected positionVote for party summary`, positionVote);
      } else {
        acc[positionVote].push(position.name);
      }
      return acc;
    },
    { yes: [], no: [], not_voting: [], present: [] }
  );

  const percentValue = (value: number) => {
    return Math.round(value * 10000) / 100;
  };

  const summary: PartyVoteWithId = {
    id: `${key}-${party}`,
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
