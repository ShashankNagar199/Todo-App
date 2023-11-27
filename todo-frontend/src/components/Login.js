import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import UserContext from "../Context/UserContext";
import "./login.css";
const Login = () => {
  const navigate = useNavigate();
  const authCtx = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (
      res.status === 400 ||
      !data ||
      res.status === 404 ||
      res.message === "incorrect password"
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! ",
        footer: "Email or password is invalid ",
      });
    } else {
      authCtx.login(data.email);
      Swal.fire({
        icon: "success",
        title: "Success",
        type: "success",
        text: "Login Successfull ! ",
      }).then(() => {
        navigate("/addnote");
      });
    }
  };

  return (
    <div className="login">
    <span className="loginTitle">Login</span>
    <form method="POST" className="loginForm">
      <label>Email</label>
      <input className="loginInput" type="email" placeholder="Enter your email..." name="email" id="email" value = {email} onChange={(e) => setEmail(e.target.value)}/><br></br>
      <label>Password</label>
      <input className="loginInput" type="password" placeholder="Enter your password..." name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br></br>
      <button className="loginButton" onClick={loginHandler}>Login</button><br></br>
    </form>
      <button className="loginRegisterButton">Register</button>
  </div>
  );
};
export default Login;
