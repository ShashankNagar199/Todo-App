import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../App.css";
import "./register.css";
const Register = () => {
  const navigate = useNavigate();

 
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  let name, value;
  const changeState = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  
  const submitData = async (e) => {
    e.preventDefault();
    const { name, email, password } = user;

    

    const res = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await res.json();
    console.log(data);

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Success",
        type: "success",
        text: "You have registered successfully",
      }).then(() => {
        navigate("/login");
      });
    } else {
      Swal.fire({
        title: "error",
        text: JSON.stringify(error),
      });
      
    }
  };

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm">
        <label>Username</label>
        <input  name="name" value={user.name} onChange={changeState} className="registerInput" type="text" placeholder="Enter your username..."/>
       <label>Email</label>
        <input name="email" value={user.email} onChange={changeState} className="registerInput" type="email" placeholder="Enter your email..." />
        <label>Password</label>
        <input name="password" value={user.password} onChange={changeState} className="registerInput" type="password" placeholder="Enter your password..." />
        
       
        <button className="registerButton" onClick={submitData}>Register</button>
      </form>
        <button className="registerLoginButton">Login</button>
    </div>
  );
};
export default Register;
