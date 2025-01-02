import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Salsa Events!</h1>
      <p className="lead text-muted">
        Discover the rhythm and passion of salsa events near you.
      </p>
      <Link to="/events" className="btn btn-primary btn-lg">
        Browse Events
      </Link>
    </div>
  );
};

export default Home;
