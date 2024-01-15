import { useEffect, useState } from "react";
import { VoteOverview, VoteSummary } from "../../types/vote.types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

const VoteDetail: React.FC<{ item: VoteOverview}> = (item) => {
  const id = item.item.id;

  const [summary, setSummary] = useState({} as VoteSummary);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(baseURL + '/vote/' + id);
        const data = await response.json();
        const received = data.data as VoteSummary
        setSummary(received); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]); 

  
  const header = `${item.item.question}:  ${item.item.result}`
  return (

    <Card variant="outlined">
      <CardHeader title={header} />
      <CardContent>
        <Typography variant="body1">
          {item.item.description}
        </Typography>

        <Typography variant="body2">
          Yes: {summary.totalYes} ({summary.percentYes}%)
        </Typography>

        <Typography variant="body2">
          No: {summary.totalNo} ({summary.percentNo}%)  
        </Typography>

        <Typography variant="body2">
          Democratic position: {summary.democraticPosition}
        </Typography>

        <Typography variant="body2">
          Republican position: {summary.republicanPosition}
        </Typography>
      </CardContent>
    </Card>
  )
  };

  export default VoteDetail;