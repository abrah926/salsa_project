import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "#8b0000", // Darker red background color
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Add shadow for a floating effect
      }}
    >
      <div className="container">
        <Link className="navbar-brand text-white d-flex align-items-center" to="/">
          <i className="fas fa-music me-2"></i> Salsa Events
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${getActiveClass("/")}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${getActiveClass("/events")}`}
                to="/events"
              >
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${getActiveClass("/calendar")}`}
                to="/calendar"
              >
                Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${getActiveClass("/contact")}`}
                to="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
