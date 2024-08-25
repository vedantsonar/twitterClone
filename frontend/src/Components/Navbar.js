import React from "react";
import { Link } from "react-router-dom";
import xImage from "../image/x-image.png";
import { useNavigate } from "react-router-dom";
import profileIcon from "../image/profile-icon.png";

function Navbar() {

  let navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar fixed-top" style={{ backgroundColor: "#e3f2fd" }}>
      <div className="container">
        <a className="navbar-brand" href="/">
          <img className="x-image" src={xImage} alt="x-image" />
        </a>

        {localStorage.getItem("token") ? (
          <div className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="/"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img className="x-image" src={profileIcon} alt="profileimage" />
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/my-profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/settings">
                  Setting
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button onClick={logout} className="dropdown-item" to="/logout">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="nav-item">
            <Link className="btn btn-primary mx-3" to="/login" role="button">
              Login
            </Link>
            <Link className="btn btn-primary" to="/signup" role="button">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

// <Router>
//       <Navbar />
//       <div className="container d-flex position-relative">
//         <Leftbar />

//         <Routes>
//           <Route path="/feed" element={<Feed />} />
//           <Route path="/search" element={<SearchUser />} />
//           <Route path="/create-post" element={<CreatePost  />} />
//           <Route path="/my-profile" element={<Profile  />} />
//           <Route path="/login" element={<Login  />} />
//           <Route path="/signup" element={<Signup  />} />
//         </Routes>

//       </div>
//     </Router>
