import { StateVote } from "../../types/analyzed-data-schemas";
import { VoteWithPosition } from "../../types/propublica-schemas";
import { AnalyzedVoteRepository } from "../ports/analyzed-vote-repository";

export const saveStateSummary = async (
  state: string,
  rawVote: VoteWithPosition,
  repository: AnalyzedVoteRepository
) => {
  const vote = rawVote;
  const { congress, chamber, session, roll_call } = vote;
  const key = `${congress}-${chamber}-${session}-${roll_call}`;

  const statePositions = vote.positions.filter((p) => p.state === state);

  const { yes, no, not_voting, present } = statePositions.reduce(
    (
      acc: {
        yes: { name: string; party: string }[];
        no: { name: string; party: string }[];
        not_voting: { name: string; party: string }[];
        present: { name: string; party: string }[];
      },
      position
    ) => {
      let positionVote = position.vote_position.toLowerCase() as
        | "yes"
        | "no"
        | "not_voting"
        | "not voting"
        | "present";
      if (positionVote === "not voting") {
        positionVote = "not_voting";
      }

      if (!acc[positionVote]) {
        console.log(`unexpected positionVote for state ${state}`, positionVote);
      } else {
        acc[positionVote].push({ name: position.name, party: position.party });
      }
      return acc;
    },
    { yes: [], no: [], not_voting: [], present: [] }
  );

  const percentValue = (value: number) => {
    return Math.round(value * 10000) / 100;
  };

  const summary: StateVote = {
    state,
    totalYes: yes.length,
    totalNo: no.length,
    totalNotVoting: not_voting.length,
    totalPresent: present.length,
    percentYes: percentValue(yes.length / statePositions.length),
    percentNo: percentValue(no.length / statePositions.length),
    position: yes.length > no.length ? "yes" : "no",
    yesRepublicanVoters: yes.filter((v) => v.party === "R").map((v) => v.name),
    yesDemocraticVoters: yes.filter((v) => v.party === "D").map((v) => v.name),
    yesIndependentVoters: yes.filter((v) => v.party === "I").map((v) => v.name),
    noRepublicanVoters: no.filter((v) => v.party === "R").map((v) => v.name),
    noDemocraticVoters: no.filter((v) => v.party === "D").map((v) => v.name),
    noIndependentVoters: no.filter((v) => v.party === "I").map((v) => v.name),
    presentVoters: present.map((v) => v.name),
    notVoting: not_voting.map((v) => v.name),
  };

  await repository.saveVoteAnalysis({
    key,
    sort: `state-${state}`,
    analysis: summary,
  });
};
