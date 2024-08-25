import React, { useEffect } from "react";
import Leftbar from "./Leftbar.js";
import SearchUser from "./SearchUser.js";
import Feed from "./Feed.js";
import CreatePost from "./CreatePost .js";
import Profile from "./Profile.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../CSS Files/App.css";

const Redirect = ({ to }) => {
  let navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, [navigate, to]);

  return null; 
};

const App2 = () => {

  const isAuthenticate = localStorage.getItem('token')

  return (
    <div className="container d-flex position-relative">
      <Leftbar />

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/search" element={<SearchUser />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route
          path="*"
          element={ isAuthenticate? <h2 className="temp">Page is not available</h2> : <Redirect to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App2;
