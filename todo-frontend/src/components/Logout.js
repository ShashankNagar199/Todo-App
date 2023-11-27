import React, { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../Context/UserContext";

const Logout = () => {
  const authCtx = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      Swal.fire({
        icon: "success",
        title: "LoggedOut",
        type: "success",
        text: "You have been logged out.. ",
      });
      window.localStorage.clear();
      authCtx.logout();
      navigate("/login");
    });
  });
  return (
    <>
      <h2>return </h2>
    </>
  );
};

export default Logout;
