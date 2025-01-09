import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Move styles outside component to prevent recreating objects on each render
const heroContainerStyle = {
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1,
};

const contentStyle = {
  zIndex: 2,
};

const buttonStyle = {
  backgroundColor: "#e63946",
  borderColor: "#e63946",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  textTransform: "uppercase",
  fontWeight: "bold",
  letterSpacing: "1px",
};

function Hero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/images/dance-bg.webp';
    img.loading = 'lazy';
    img.onload = () => setIsImageLoaded(true);
  }, []);

  return (
    <div
      className="hero text-center py-5 position-relative"
      style={{
        ...heroContainerStyle,
        backgroundImage: isImageLoaded ? "url('/images/dance-bg.webp')" : 'none',
        backgroundColor: '#1a1a1a', // Fallback color while image loads
      }}
    >
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <h1 className="display-4 text-white fw-bold">
          Welcome to Salsa Events!
        </h1>
        <p className="lead text-white">
          Discover the rhythm and passion of salsa events near you.
        </p>
        <Link
          to="/events"
          className="btn btn-lg"
          style={buttonStyle}
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}

export default Hero;
