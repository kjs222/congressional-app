import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';



interface VoteCardProps {
  item: {
    chamber: string;
    congress: string;
    rollCall: string;
    session: string;
    description: string;
    question: string;
    result: string;
  };
}

export const VoteCard: React.FC<VoteCardProps> = ({ item }) => {
  const header = `${item.question}:  ${item.result}`;
  return (
    // <div className="card">
    //   <h3>{item.rollCall}</h3>
    //   <p>{item.description}</p>
    // </div>
    <Card variant="outlined">
      <CardHeader title={header} />
      <CardContent>
        <Typography variant="body2">
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
};