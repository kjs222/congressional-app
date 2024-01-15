import { useEffect, useState } from "react";
import { VoteOverview, VoteSummary } from "../../types/vote.types";


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
    <div>
      <h1>Vote Detail</h1>
      <h3>{header}</h3>
      <p>{item.item.description}</p>
      <p>Yes: {summary.totalYes} ({summary.percentYes}%)</p>
      <p>No: {summary.totalNo} ({summary.percentNo}%)</p>
      <p>Democratic position: {summary.democraticPosition}</p>
      <p>Republican position: {summary.republicanPosition}</p>

    </div>
  )
  };

  export default VoteDetail;