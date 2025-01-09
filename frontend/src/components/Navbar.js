import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const navLinkStyle = {
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    transform: 'translateY(0)',
  };

  const navLinkHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "#8b0000",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
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
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${getActiveClass("/")}`}
                to="/"
                style={navLinkStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, navLinkHoverStyle);
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
                  Object.assign(e.currentTarget.style, navLinkHoverStyle);
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
                  Object.assign(e.currentTarget.style, navLinkHoverStyle);
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
                  Object.assign(e.currentTarget.style, navLinkHoverStyle);
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, navLinkStyle);
                }}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <Link 
                className={`nav-link ${getActiveClass("/events/create")}`}
                to="/events/create"
                style={{
                  ...navLinkStyle,
                  backgroundColor: 'white',
                  color: '#8b0000',
                  fontWeight: '500',
                }}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...navLinkStyle,
                    ...navLinkHoverStyle,
                    backgroundColor: '#f0f0f0',
                    color: '#8b0000',
                    fontWeight: '500',
                  });
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...navLinkStyle,
                    backgroundColor: 'white',
                    color: '#8b0000',
                    fontWeight: '500',
                  });
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
