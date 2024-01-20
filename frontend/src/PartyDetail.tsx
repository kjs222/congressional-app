import React, { useState, useEffect } from 'react';
import { PartyVote } from './types/vote.types';
import { Typography, CircularProgress, Button } from '@mui/material';

export const PartyDetail: React.FC<{ id: string, party: string}> = ({ id, party }) => {

  const [partyDetail, setPartyDetail] = useState<PartyVote | null>(null);
  const [yesVotersOpen, setYesVotersOpen] = useState(false);
  const [noVotersOpen, setNoVotersOpen] = useState(false);
  const [presentVotersOpen, setPresentVotersOpen] = useState(false);
  const [notVotingVotersOpen, setNotVotingVotersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(baseURL + '/vote/' + id + '?' + new URLSearchParams({ party }));
        const data = await response.json();
        const received = data.data as PartyVote;
        setPartyDetail(received);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, party]);

  if (loading) {
    return <CircularProgress />; 
  }

  if (error) {
    return <Typography variant="body2" color="error">{error}</Typography>; 
  }

  if (!partyDetail) {
    return null; 
  }

  return (
    <div>
      <Typography variant="body2">
        Yes: {partyDetail.totalYes} ({partyDetail.percentYes}%)
      </Typography>

      {partyDetail.yesVoters.length > 0 && 
        <Button color='primary' onClick={() => setYesVotersOpen(!yesVotersOpen)}>
          {yesVotersOpen ? 'Hide' : 'Show'}
        </Button>
      }

      {yesVotersOpen && (
        <>
          {partyDetail.yesVoters.map((item: string, index: number) => (
            <Typography key={index} variant="body2">
              {item}
            </Typography>
          ))}
        </>
      )}

      <Typography variant="body2">
        No: {partyDetail.totalNo} ({partyDetail.percentNo}%)
      </Typography>

      {partyDetail.noVoters.length > 0 && 
        <Button color='primary' onClick={() => setNoVotersOpen(!noVotersOpen)}>
          {noVotersOpen ? 'Hide' : 'Show'}
        </Button>
      }

      {noVotersOpen && (
        <>
          {partyDetail.noVoters.map((item: string, index: number) => (
            <Typography key={index} variant="body2">
              {item}
            </Typography>
          ))}
        </>
      )}

      <Typography variant="body2">
        Not Voting: {partyDetail.totalNotVoting}
      </Typography>

      {partyDetail.totalNotVoting > 0 && 
        <Button color='primary' onClick={() => setNotVotingVotersOpen(!notVotingVotersOpen)}>
          {notVotingVotersOpen ? 'Hide' : 'Show'}
        </Button>
      }

      {notVotingVotersOpen && (
        <>
          {partyDetail.notVoting.map((item: string, index: number) => (
            <Typography key={index} variant="body2">
              {item}
            </Typography>
          ))}
        </>
      )}

      <Typography variant="body2">
        Present: {partyDetail.totalPresent}
      </Typography>

      {partyDetail.totalPresent > 0 && 
        <Button color='primary' onClick={() => setPresentVotersOpen(!presentVotersOpen)}>
          {presentVotersOpen ? 'Hide' : 'Show'}
        </Button>
      }

      {presentVotersOpen && (
        <>
          {partyDetail.presentVoters.map((item: string, index: number) => (
            <Typography key={index} variant="body2">
              {item}
            </Typography>
          ))}
        </>
      )}

      <Typography variant="body2">
        Percent Voting With Party: {partyDetail.percentVoteWithParty}%
      </Typography>

    </div>
  );
};
