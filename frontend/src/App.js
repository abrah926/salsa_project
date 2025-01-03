import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Calendar from "./pages/Calendar";

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
        <Route path="/calendar" element={<Calendar />} /> {/* Calendar Route */}
      </Routes>
    </Router>
  );
}

export default App;
