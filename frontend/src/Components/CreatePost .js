import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS Files/createPost.css";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);

    try {
      const response = await fetch(`http://localhost:5000/api/v1/tweets/`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
        body: formData,
      });

      const json = await response.json();


      if (json.success) {
        toast.success("Post created successfully!");
        setContent("");
        setImage(null);
      } else {
        toast.error("Failed to create post. Please try again.");
      }
      

    } catch (error) {
      toast.error("There was a problem while creating the post.");
      console.log("There was a problem while creating a post", error);
    }
  };

  const onChange = (e) => {
    if (e.target.type === "file") {
      setImage(e.target.files[0]);
    } else {
      setContent(e.target.value);
    }
  };

  return (
    <div className="position-2 position-absolute ms-3">
      <p className="text-center h3">Create A Post</p>

      <form onSubmit={handleSubmit}>
        <div className="m-5">
          <textarea
            type="text"
            placeholder="Write Something.."
            className="form-control"
            id="content"
            name="content"
            required
            rows="5"
            onChange={onChange}
          ></textarea>

          <input
            type="file"
            className="mt-3"
            id="image"
            name="image"
            onChange={onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary ms-5">
          Create
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default CreatePost;
