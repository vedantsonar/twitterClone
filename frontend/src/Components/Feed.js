import React, { useState, useEffect } from "react";
import "../CSS Files/feed.css";
import commentIcon from "../image/comment-image.png";
import retweetIcon from "../image/retweet-image.png";
import { useNavigate } from "react-router-dom";
import {
  handleLike,
  fetchComments,
  addComments,
  handleRetweet,
} from "./LIkeComments.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

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

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [selectedTweetId, setSelectedTweetId] = useState(null);
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState("");
  let navigate = useNavigate();

  const getTweets = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/tweets/usersFeed`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      setTweets(json);
      // console.log(json)
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getTweets();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const handleLikeClick = (tweetId) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet._id === tweetId ? { ...tweet, liked: !tweet.liked } : tweet
      )
    );
    handleLike(tweetId);
  };

  const handleCommentsClick = async (tweetId) => {
    if (tweetId === selectedTweetId) {
      // If the same tweet is clicked again, hide the comments
      setSelectedTweetId(null);
      setComments([]);
    } else {
      setSelectedTweetId(tweetId);
      const fetchedComments = await fetchComments(tweetId);
      setComments(fetchedComments);
    }
  };

  const handlePostComment = async (tweetId) => {
    await addComments(tweetId, inputValue);
    const fetchedComments = await fetchComments(tweetId);
    setComments(fetchedComments);
    setInputValue("");
  };

  return (
    <div className="margin-top position-absolute start-27">
      {tweets.length === 0 ? (
        <div className="padding-inline pos bg-primary-subtle rounded">
          <p className="d-flex align-items-center py-3 ps-4">Nothing To Show</p>
        </div>
      ) : (
        tweets
          .slice()
          .reverse()
          .map((tweet) => (
            <div key={tweet._id} className="card height margin-left1 pos">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={tweet.Owner.avatar}
                    alt="User"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h5 className="card-title mb-0">{tweet.Owner.fullname}</h5>
                    <p className="card-text">
                      <small className="text-muted">
                        @{tweet.Owner.username}
                      </small>
                    </p>
                  </div>
                </div>
                <p className="card-text">{tweet.content}</p>
                {tweet.image && (
                  <img
                    src={tweet.image}
                    alt="Tweet"
                    className="img-fluid rounded"
                  />
                )}

                <div className="d-flex mt-3 justify-content-between">
                  <div className="d-flex">
                    <FontAwesomeIcon
                      className="me-4 custom"
                      icon={faHeart}
                      size="xl"
                      style={{
                        color: tweet.liked ? "#ff2121" : "white",
                        filter: "drop-shadow(1px 1px 2px black)",
                      }}
                      onClick={() => {
                        handleLikeClick(tweet._id);
                      }}
                    />
                    {/* TODO: Fetch all likes */}
                    {/* #ff2121 */}
                    <img
                      className="me-4"
                      style={{ width: "25px" }} // filter: "drop-shadow(1px 1px 2px gray)"
                      src={commentIcon}
                      alt="comment-icon"
                      onClick={() => {
                        handleCommentsClick(tweet._id);
                      }}
                    />
                    <img
                      style={{ width: "25px" }} // filter: "drop-shadow(1px 1px 2px gray)"
                      src={retweetIcon}
                      alt="retweet-icon"
                      onClick={() => {
                        handleRetweet(tweet._id);
                      }}
                    />
                  </div>
                  <div>
                    <p className="card-text d-flex justify-content-end">
                      <small className="text-muted">
                        {formatDate(tweet.createdAt)}
                      </small>
                    </p>
                  </div>
                </div>

                <>
                  {selectedTweetId === tweet._id && (
                    <div className="mt-3 border rounded pt-3 ps-3">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <input
                          type="text"
                          className="rounded ps-3"
                          placeholder="write a comment"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary me-5"
                          onClick={() => handlePostComment(tweet._id)}
                        >
                          Post
                        </button>
                      </div>
                      <h6>Comments : </h6>
                      {comments.length > 0 ? (
                        comments
                          .slice()
                          .reverse()
                          .map((comment) => (
                            <div key={comment._id} className="d-flex">
                              <img
                                src={comment.owner.avatar}
                                alt="User"
                                className="rounded-circle me-3 mt-2"
                                style={{ width: "25px", height: "25px" }}
                              />
                              <div key={comment._id} className="mb-3">
                                <p
                                  className="mb-0"
                                  style={{ fontWeight: "600" }}
                                >
                                  {comment.owner.username}
                                </p>
                                <p className="mb-0">{comment.content}</p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="ps-3">No comments yet.</p>
                      )}
                    </div>
                  )}
                </>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default Feed;
