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
        backgroundColor: "#8b0000",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Add shadow for floating effect
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
              <Link className={`nav-link text-white ${getActiveClass("/")}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-white ${getActiveClass("/events")}`} to="/events">
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-white ${getActiveClass("/calendar")}`} to="/calendar">
                Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-white ${getActiveClass("/contact")}`} to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <Link 
                className={`nav-link ${getActiveClass("/events/create")}`}
                to="/events/create"
                style={{
                  backgroundColor: 'white',
                  color: '#8b0000',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                + Create Event
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
