import VoteDetail from "../VoteDetail/VoteDetail";
import { useLocation } from 'react-router-dom';

const Vote = () => {
  const { state } = useLocation();


  return (
    <VoteDetail item={state} />
  );
};

export default Vote;