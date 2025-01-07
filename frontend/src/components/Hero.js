import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div
      className="hero text-center py-5"
      style={{
        backgroundImage: "url('/images/dance-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Makes the image cover the viewport
        color: "white",
        height: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 className="display-4" style={{ fontWeight: "bold" }}>
        Welcome to Salsa Events!
      </h1>
      <p className="lead">
        Discover the rhythm and passion of salsa events near you.
      </p>
      <Link
        to="/events"
        className="btn btn-primary btn-lg"
        style={{
          backgroundColor: "#8b0000", // Darker red
          borderColor: "#8b0000",
          color: "white",
        }}
      >
        Browse Events
      </Link>
    </div>
  );
}

export default Hero;
