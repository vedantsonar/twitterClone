// import React from 'react'

export const handleLike = async (tweetId) => {
  // console.log(`Like, tweetId: ${tweetId}`);

  try {
    // TODO: Create new model for likedState and handle according to use
    const response = await fetch(
      `http://localhost:5000/api/v1/likes/tweet-like/${tweetId}`,
      {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Network response was not ok");
    }

    // const json = await response.json();

    await response.json();

    await fetch(
      `http://localhost:5000/api/v1/likes/change-liked-state/${tweetId}`,
      {
        method: "PATCH",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );

    // console.log(json);
  } catch (error) {
    console.error("Error while like a tweet:", error);
  }
};

export const fetchComments = async (tweetId) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/comments/fetch-all-comment/${tweetId}`,
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

  // const json = await response.json();

  const json = await response.json();
  return json;
};

export const addComments = async (tweetId, commentText) => {
  try {
    
    const response = await fetch(
      `http://localhost:5000/api/v1/comments/${tweetId}`,
      {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({
          content: commentText,
        }),
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Network response was not ok");
    }

    const json = await response.json(); 
    return json
  } catch (error) {
    console.error("Error in posting comment:", error);
  }
};

// TODO: LikeComment, DeleteComment, UpdateComment

export const handleRetweet = (tweetId) => {
  console.log(`Retweet, tweetId: ${tweetId}`);
};

const LIkeComments = () => {
  return null;
};

export default LIkeComments;
