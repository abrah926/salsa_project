import React from "react";

function Hero() {
  return (
    <header className="bg-light py-5" id="hero">
      <div className="container text-center">
        <h1 className="display-4 text-primary">Welcome to Salsa Events!</h1>
        <p className="lead text-secondary">
          Discover the rhythm and passion of salsa events near you.
        </p>
        <a href="#events" className="btn btn-primary btn-lg">
          Browse Events
        </a>
      </div>
    </header>
  );
}

export default Hero;
