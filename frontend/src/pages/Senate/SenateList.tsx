import React, { useState, useEffect } from 'react';
import { VoteCard } from '../../VoteCard';
import { Typography } from '@mui/material';

const HouseList: React.FC = () => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(baseURL + '/votes?chamber=senate');
        const data = await response.json();
        setVotes(data.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

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

