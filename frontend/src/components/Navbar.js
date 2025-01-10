import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navbarToggler = useRef(null);

  const getActiveClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const closeNavbar = () => {
    if (window.innerWidth < 992) {
      navbarToggler.current.click();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <button
          ref={navbarToggler}
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
          <ul className="navbar-nav ml-auto"> {/* Align items to the right */}
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass("/")}`}
                to="/"
                onClick={closeNavbar}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass("/events")}`}
                to="/events"
                onClick={closeNavbar}
              >
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass("/calendar")}`}
                to="/calendar"
                onClick={closeNavbar}
              >
                Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass("/contact")}`}
                to="/contact"
                onClick={closeNavbar}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass("/events/create")}`}
                to="/events/create"
                onClick={closeNavbar}
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
