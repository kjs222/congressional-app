import React, { useState, useEffect } from 'react';
import { VoteCard } from '../../VoteCard';
import { CircularProgress, Typography } from '@mui/material';


const HouseList: React.FC = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(baseURL + '/votes?chamber=senate');
        const data = await response.json();
        setVotes(data.data); 
      } catch (error) {
        console.error('Error fetching data:', error);  
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (loading) {
    return <CircularProgress />; 
  }

  if (error) {
    return <Typography variant="body2" color="error">{error}</Typography>; 
  }

  return (
    <div>
      <Typography variant="h4">Recent Senate Votes</Typography>

      {votes.map((item: any) => (
        <VoteCard key={item.rollCall} item={item} />
      ))}
    </div>
  );

};

export default HouseList;

