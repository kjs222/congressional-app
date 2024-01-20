import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { VoteOverview } from './types/vote.types';
import Link from '@mui/material/Link';
import EventIcon from '@mui/icons-material/Event';

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
          <EventIcon/>{item.date}
        </Typography>
        <Typography variant="body2">
          {item.description}
        </Typography>
        
        <Button onClick={handleSeeDetails} variant="contained" color="secondary">See Analysis</Button>
      </CardContent>
    </Card>
  );
};