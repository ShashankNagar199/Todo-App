import React from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../Context/UserContext";
import { useContext } from "react";
const Navbar = () => {
  const authCtx = useContext(UserContext);
  const isloggedIn = authCtx.isLoggedIn;
  console.log(isloggedIn);
  const userID = authCtx.token;
  const RenderMenu = () => {
    if (isloggedIn) {
      return (
        <>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/">
              
            </NavLink>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/addnote">
             
              <span style={{ fontWeight: "bold" }}>&nbsp;Add a new task</span>{" "}
              <span className="sr-only">(current)</span>
            </NavLink>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/shownotes">
              
              <span style={{ fontWeight: "bold" }}>&nbsp;ShowTasks</span>{" "}
              <span className="sr-only">(current)</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/logout">
             
              <span style={{ fontWeight: "bold" }}>&nbsp;Logout</span>
            </NavLink>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/">
              
            </NavLink>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/addnote">
             
              <span style={{ fontWeight: "bold" }}>&nbsp;Home</span>{" "}
              <span className="sr-only">(current)</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/login">
              
              <span style={{ fontWeight: "bold" }}>&nbsp;Login</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/signup">
             
              <span style={{ fontWeight: "bold" }}>&nbsp;Signup</span>
            </NavLink>
          </li>
        </>
      );
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
         Todo List App 
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <RenderMenu />
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
