import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS Files/signup.css";

const Signup = () => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [files, setFiles] = useState({
    avatar: null,
    coverImage: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullname', credentials.fullname);
    formData.append('username', credentials.username);
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    formData.append('avatar', files.avatar);
    formData.append('coverImage', files.coverImage);

    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/register`, {
        method: "POST",
        body: formData, 
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem('token', json.authtoken);
        navigate('/'); 
      } else {
        alert(json.message);
      }

    } catch (error) {
      console.log("There was a problem while registering the user", error);
    }
  };

  const onChange = (e) => {
    if (e.target.type === 'file') {
      setFiles({
        ...files,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create New Account</h2>
      <form className="position-signup" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullname" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="fullname"
            name="fullname"
            aria-describedby="emailHelp"
            required
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            User Name
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            aria-describedby="emailHelp"
            required
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            required
            onChange={onChange}
          />
        </div>
        <div className="d-flex justify-content-between column-gap-5">
          <div className="mb-3">
            <label htmlFor="avatar" className="form-label">
              Avatar
            </label>
            <input
              type="file"
              className="form-control"
              id="avatar"
              name="avatar"
              aria-describedby="emailHelp"
              required
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="coverImage" className="form-label">
              Cover Image
            </label>
            <input
              type="file"
              className="form-control"
              id="coverImage"
              name="coverImage"
              aria-describedby="emailHelp"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            required
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
