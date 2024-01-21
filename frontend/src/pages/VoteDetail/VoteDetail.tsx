import { useEffect, useState } from "react";
import { VoteOverview, VoteSummary } from "../../types/vote.types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PartyDetail } from "../../PartyDetail";

const VoteDetail: React.FC<{ item: VoteOverview}> = (item) => {
  const id = item.item.id;

  const [summary, setSummary] = useState({} as VoteSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); 

  
  const header = `${item.item.question}:  ${item.item.result}`

  if (loading) {
    return <CircularProgress />; 
  }

  if (error) {
    return <Typography variant="body2" color="error">{error}</Typography>; 
  }

  return (

    <Card variant="outlined">
      <CardHeader title={header} />
      <CardContent>
        <Typography variant="body1">
          {item.item.description}
        </Typography>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Summary</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>Democratic</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PartyDetail id={id} party="democratic" />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>Republican</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PartyDetail id={id} party="republican" />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  )
  };

  export default VoteDetail;