import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div
      className="hero text-center py-5 position-relative"
      style={{
        backgroundImage: "url('/images/dance-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Makes the image cover the viewport
        height: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
          zIndex: 1,
        }}
      ></div>
      {/* Content */}
      <div style={{ zIndex: 2 }}>
        <h1 className="display-4 text-white" style={{ fontWeight: "bold" }}>
          Welcome to Salsa Events!
        </h1>
        <p className="lead text-white">
          Discover the rhythm and passion of salsa events near you.
        </p>
        <Link
          to="/events"
          className="btn btn-lg"
          style={{
            backgroundColor: "#e63946", // Brighter red
            borderColor: "#e63946",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            textTransform: "uppercase",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}

export default Hero;
