import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Base style for all nav links
  const navLinkStyle = {
    backgroundColor: 'white',
    color: '#8b0000',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    transform: 'translateY(0)',
    margin: '0 8px', // Add spacing between items
  };

  // Hover style for all nav links
  const navLinkHoverStyle = {
    backgroundColor: '#f0f0f0',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "#8b0000",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        padding: "15px 0", // Add more vertical padding
      }}
    >
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            backgroundColor: 'white',
            border: 'none',
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto" style={{ gap: '15px' }}> {/* Added gap between items */}
            <li className="nav-item">
              <Link 
                className={`nav-link ${getActiveClass("/")}`}
                to="/"
                style={navLinkStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, {...navLinkStyle, ...navLinkHoverStyle});
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, navLinkStyle);
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${getActiveClass("/events")}`}
                to="/events"
                style={navLinkStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, {...navLinkStyle, ...navLinkHoverStyle});
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, navLinkStyle);
                }}
              >
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${getActiveClass("/calendar")}`}
                to="/calendar"
                style={navLinkStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, {...navLinkStyle, ...navLinkHoverStyle});
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, navLinkStyle);
                }}
              >
                Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${getActiveClass("/contact")}`}
                to="/contact"
                style={navLinkStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, {...navLinkStyle, ...navLinkHoverStyle});
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, navLinkStyle);
                }}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${getActiveClass("/events/create")}`}
                to="/events/create"
                style={navLinkStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, {...navLinkStyle, ...navLinkHoverStyle});
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, navLinkStyle);
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
