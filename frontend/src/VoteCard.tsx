import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { VoteOverview } from './types/vote.types';


export const VoteCard: React.FC<{ item: VoteOverview}> = ({ item }) => {
  const navigate = useNavigate();

  const handleSeeDetails = () => {
    navigate(`/vote/${item.id}`, { state: item });
  };

  const header = `${item.question}:  ${item.result}`;
  
  return (
    <Card variant="outlined">
      <CardHeader title={header} />
      <CardContent>
        <Typography variant="body2">
          {item.description}
        </Typography>
        <button onClick={handleSeeDetails}>
          See Details
        </button>
      </CardContent>
    </Card>
  );
};