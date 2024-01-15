import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      {/* Use Link instead of <a> */}
      <Link to="/house">House</Link>
    </div>
  );
};

export default Home;