import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';


const Navigation = () => {
  return (
    <AppBar color='info' position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          <HomeIcon />
        </Button>
        <Button color="inherit" component={Link} to="/house">
          <Typography variant="h6">House</Typography>
        </Button>
        <Button color="inherit" component={Link} to="/senate">
          <Typography variant="h6">Senate</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
