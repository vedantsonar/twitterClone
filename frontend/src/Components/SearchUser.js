import React, { useState } from "react";
import "../CSS Files/search.css";

function SearchUser() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [followState, setFollowState] = useState(null);

  const getUser = async (username) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/users/getUser/${username}`,
      {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );

    const json = await response.json();
    if (json && json._id) {
      setUser(json);
      setFollowState(json.isFollowed);
    } else {
      setUser(null);
      setFollowState(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    getUser(searchTerm);
  };

  const toggleFollow = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/follower/toggle-following/${id}`,
        {
          method: "POST",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      await response.json();

      setFollowState((prevState) => !prevState);
    } catch (error) {
      console.error("Error while toggling follow", error);
    }
  };

  return (
    <div className="position-1 position-absolute">
      <form className="d-flex mb-4 mt-3" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          id="search-username"
          type="search"
          placeholder="Search with username"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-outline-success bg-simple" type="submit">
          Search
        </button>
      </form>

      {submitted && (
        <>
          {user ? (
            <div
              key={user._id}
              className="d-flex align-items-center mb-3 bg-primary-subtle rounded px-3 py-1"
              style={{ width: "100%" }}
            >
              <img
                src={user.avatar}
                alt="User"
                className="rounded-circle me-3"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h5 className="card-title mb-0">{user.fullname}</h5>
                  <p className="card-text">
                    <small className="text-muted">@{user.username}</small>
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => toggleFollow(user._id)}
                  >
                    {followState ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="padding-inline bg-primary-subtle rounded">
              <p className="d-flex align-items-center py-3">User not found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchUser;
