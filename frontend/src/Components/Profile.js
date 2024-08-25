import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS Files/profile.css";
import likeIcon from "../image/like-image.png";
import commentIcon from "../image/comment-image.png";
import retweetIcon from "../image/retweet-image.png";
import threeDots from "../image/three-dots.png";

const formatDate = (dateString) => {
  dateString = String(dateString);
  const tweetDate = new Date(dateString);

  const now = new Date();
  const diffInMilliseconds = now - tweetDate;
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = tweetDate.toLocaleDateString(undefined, options);
    const [month, day, year] = formattedDate.split(" ");
    return `${day} ${month} ${year}`;
  }
};

const Profile = () => {
  let navigate = useNavigate();
  const [info, setInfo] = useState({
    username: "",
    fullname: "",
    avatar: "",
    coverImage: "",
    followerCount: "",
    followingCount: "",
  });
  const [tweets, setTweets] = useState([]);

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const getProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/users/getUser`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      setInfo(json);
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };

  const getUserTweet = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/tweets/userTweet`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      const json = await response.json();
      if (Array.isArray(json)) {
        setTweets(json);
      } else {
        setTweets([]);
      }
    } catch (error) {
      console.error("Failed to fetch tweets", error);
    }
  };

  const handleSubmit = async (id) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);

    const response = await fetch(
      `http://localhost:5000/api/v1/tweets/updateTweet/${id}`,
      {
        method: "PATCH",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
        body: formData,
      }
    );
    const json = await response.json();
    if (json.success) {
      // TODO: toast successfull - updated
      alert("Success");
      getUserTweet();
    } else {
      // TODO: toast failed - updated
      alert("failed");
    }
  };

  const editTweet = (tweet) => {
    setSelectedId(tweet._id);
    setContent(tweet.content);
    setImage(tweet.image);
    setShowModal(true);
  };

  const deleteTweet = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/tweets/deleteTweet/${id}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      const json = await response.json();
      if (json.success) {
        getUserTweet();
        // TODO: toast (deletes successfully)
      }
    } catch (error) {
      console.error("Error while deleting tweet", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getProfile();
      getUserTweet();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onChange = (e) => {
    if (e.target.type === "file") {
      setImage(e.target.files[0]);
    } else {
      setContent(e.target.value);
    }
  };

  return (
    <div className="position-3 position-absolute">
      <div className="card bg-primary-subtle mb-3">
        <img
          src={info.coverImage || "default-cover-image.png"}
          alt="Cover-Image"
          className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }}
        />
        <div className="card-body">
          <div className="d-flex align-items-center mb-1">
            <img
              src={info.avatar}
              alt="Profile"
              className="rounded-circle me-3"
              style={{
                backgroundColor: "gray",
                width: "105px",
                // height: "95px",
                border: "4px solid white",
                marginTop: "-35px",
              }}
            />
            <div className="ms-5" style={{ marginTop: "-15px" }}>
              <h2 className="card-title mb-0">{info.fullname}</h2>
              <p className="card-text">
                <small className="text-muted">@{info.username}</small>
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-sm-evenly ms-5">
            <p
              className="card-text h6 bg-body-secondary rounded p-2"
              style={{ height: "40px" }}
            >
              Followers : {info.followerCount}
            </p>
            <p
              className="card-text h6 bg-body-secondary rounded p-2"
              style={{ height: "40px" }}
            >
              Following : {info.followingCount}
            </p>
          </div>
        </div>
      </div>
      <hr />
      <h3 className="mb-3">Tweets Posted by you</h3>

      {/* MODAL STARTS FROM HERE */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="editTweetLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editTweetLabel">
                  Edit Your Tweet
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="m-4">
                  <textarea
                    type="text"
                    placeholder="Write Something.."
                    className="form-control"
                    id="econtent"
                    name="econtent"
                    value={content}
                    required
                    rows="5"
                    onChange={onChange}
                  ></textarea>

                  <input
                    type="file"
                    className="mt-3"
                    id="eimage"
                    name="eimage"
                    // value={image}
                    required
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleSubmit(selectedId);
                    setShowModal(false);
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {Array.isArray(tweets) && tweets.length > 0 ? (
        tweets.map((tweet) => (
          <div key={tweet._id} className="card height margin-left width">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <img
                    src={info.avatar || "default-avatar.png"}
                    alt="User"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h5 className="card-title mb-0">{info.fullname}</h5>
                    <p className="card-text">
                      <small className="text-muted">@{info.username}</small>
                    </p>
                  </div>
                </div>
                <div className="nav-item dropdown">
                  <a
                    className="nav-link"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={threeDots}
                      alt="dots"
                      style={{ height: "25px" }}
                    />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <p
                        className="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => editTweet(tweet)}
                      >
                        Edit
                      </p>
                    </li>
                    <li>
                      <p
                        className="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteTweet(tweet._id)}
                      >
                        Delete
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="card-text">{tweet.content}</p>
              {tweet.image && (
                <img
                  src={tweet.image}
                  alt="Tweet"
                  className="img-fluid rounded"
                  style={{ height: "18rem", width: "100%" }}
                />
              )}

              <div className="d-flex mt-3 justify-content-between">
                <div>
                  <img
                    className="me-4"
                    style={{ width: "25px" }}
                    src={likeIcon}
                    alt="like-icon"
                  />
                  <img
                    className="me-4"
                    style={{ width: "25px" }}
                    src={commentIcon}
                    alt="comment-icon"
                  />
                  <img
                    style={{ width: "25px" }}
                    src={retweetIcon}
                    alt="retweet-icon"
                  />
                </div>
                <div>
                  <p className="card-text d-flex justify-content-end">
                    <small className="text-muted">
                      {tweet.updatedAt
                        ? formatDate(tweet.updatedAt)
                        : "Unknown date"}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="padding-inline bg-primary-subtle rounded ps-4">
          <p className="d-flex align-items-center py-3">Nothing To Show</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
