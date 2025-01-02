import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <h1>Salsa Events</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
