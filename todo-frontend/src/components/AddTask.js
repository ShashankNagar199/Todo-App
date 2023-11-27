import React from "react";
import { useState } from "react";
import UserContext from "../Context/UserContext";
import { useEffect } from "react";
import { useContext } from "react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const authCtx = useContext(UserContext);
  const navigate = useNavigate();
  const userID = authCtx.token;

  useEffect(() => {
    console.log(authCtx.token);

    if (userID === null) {
      navigate("/login");
    }
  }, []);

  // const [note1, setNote1] = useState([]);
  const [note, setNote] = useState({
    task: "",
    description: "",
    date: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setNote({ ...note, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();
    const { task, description, date } = note;
    const res = await fetch("http://localhost:8080/api/notes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        task,
        description,
        date,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.status === 422 || !data) {
      console.log("Note creation failed");
    } else {
      Swal.fire({
        icon: "success",
        text: "your todo task Added",
      }).then(() => {
        navigate("/shownotes");
      });
      console.log("Note creation Successfull");
    }
  };

  return (
    <>
      <div class="backcolor">
        <h1>Todo List App</h1>
        <br /> <br />
        <hr />
        <div class="container isolateback">
          <div class="row backgrnd">
            <div class="col-md-4">
              <div class="main">
                <div class="service1">
                 
                  <h4>
                    Add Task{" "}
                    <i
                      class="fa-solid fa-soft-serve"
                      style={{ color: "grey" }}
                    ></i>
                  </h4>

                  <form
                    method="POST"
                    className="register-form"
                    id="register-form"
                  >
                    <div class="row">
                      <label
                        class="label col-md-2 control-label"
                        style={{ color: "black" }}
                      >
                        Title
                      </label>
                      <div class="col-md-10">
                        <input
                          type="text"
                          class="form-control"
                          name="task"
                          id="task"
                          style={{ color: "black" }}
                          placeholder="Please enter Title"
                          value={note.task}
                          onChange={handleInputs}
                        />
                      </div>
                    </div>

                    <div class="row">
                      <label
                        class="label col-md-2 control-label"
                        style={{ color: "grey" }}
                      >
                        Content
                      </label>
                      <div class="col-md-10">
                        <textarea
                          class="form-control"
                          name="description"
                          id="description"
                          style={{ color: "black" }}
                          rows="3"
                          width="30"
                          placeholder="Enter content"
                          value={note.description}
                          onChange={handleInputs}
                        />
                      </div>
                    </div>
                    <div class="row">
                      <label
                        class="label col-md-2 control-label"
                        style={{ color: "grey" }}
                      >
                        Date
                      </label>
                      <div class="col-md-10">
                        <input
                          type="text"
                          class="form-control"
                          name="date"
                          id="date"
                          style={{ color: "black" }}
                          placeholder=" Enter date"
                          value={note.date}
                          onChange={handleInputs}
                        />
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-10">
                        <input
                          type="submit"
                          name="submit"
                          id="submit"
                          className="form-submit btn btn-success btn-sm"
                          value="Add your task"
                          onClick={postData}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTask;
