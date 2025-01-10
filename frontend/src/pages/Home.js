import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import danceBackground from '../images/dance-bg.webp'; // Import the image dynamically

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="home-container"
      style={{
        background: `url(${danceBackground}) no-repeat center center fixed`,
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
