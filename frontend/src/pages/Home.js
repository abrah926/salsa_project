import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="home-container"
      style={{
        background: "url('/images/dance-bg.webp') no-repeat center center fixed", // Direct URL for the background image
        backgroundSize: 'cover', // Ensure the background image covers the entire container
      }}
    >
      <div className="content-wrapper">
        <h1 className="title">Welcome to Salsa Events!</h1>
        <p className="subtitle">Discover the rhythm and passion of salsa events near you.</p>
        <button 
          className="browse-button"
          onClick={() => navigate('/events')}
        >
          BROWSE EVENTS
        </button>
      </div>
    </div>
  );
};

export default Home;
