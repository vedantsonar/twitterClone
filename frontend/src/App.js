import React from "react";
import "./CSS Files/App.css";
import Navbar from "./Components/Navbar.js";
import Login from "./Components/Login.js";
import Signup from "./Components/Signup.js";
import App2 from "./Components/App2.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/*" element={<App2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

// TODO: toast (delete successfully) - profile
// TODO: toast (edit successfully) - profile
// TODO: toast (updated successfull) - profile



