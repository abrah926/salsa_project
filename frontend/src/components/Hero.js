import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="hero text-center py-5 bg-light">
      <div className="container">
        <h1 className="display-4">Welcome to Salsa Events!</h1>
        <p className="lead">
          Discover the rhythm and passion of salsa events near you.
        </p>
        <Link to="/events" className="btn btn-primary btn-lg">
          Browse Events
        </Link>
      </div>
    </div>
  );
}

export default Hero;
