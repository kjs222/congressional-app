import React, { useState, useEffect } from 'react';
import { VoteCard } from '../../VoteCard';

const HouseList: React.FC = () => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(baseURL + '/votes?chamber=house');
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
      {votes.map((item: any) => (
        <VoteCard key={item.rollCall} item={item} />
      ))}
    </div>
  );

};

export default HouseList;

