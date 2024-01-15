import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material'
import Typography from '@mui/material/Typography';


const Home = () => {
  return (
    <div>
      <Typography variant="h4">Recent Congressional Votes</Typography>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button style={{ marginRight: '8px' }} component={Link} to="/house" variant="contained" color="primary">House</Button>
        <Button component={Link} to="/senate" variant="contained" color="primary">Senate</Button>
      </Box>
    </div>
  );
};

export default Home;