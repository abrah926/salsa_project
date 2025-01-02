import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/contact"
          element={
            <div className="container mt-5">
              <h1>Contact Us</h1>
              <p>If you have any questions, feel free to reach out!</p>
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="container mt-5">
              <h1>About Us</h1>
              <p>Learn more about Salsa Events and our mission to bring joy through dance!</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
