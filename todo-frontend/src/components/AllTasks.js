import React, { useEffect } from "react";
import { useState } from "react";
import UserContext from "../Context/UserContext";
import { useContext } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ShowAllTasks = () => {
  const authCtx = useContext(UserContext);
  const navigate = useNavigate();
  const userID = authCtx.token;

  useEffect(() => {
    console.log(authCtx.token);

    if (userID === null) {
      navigate("/login");
    }
  }, []);

  const [date, setDate] = useState();

  const [task, setTask] = useState([]);

  useEffect(() => {
    showAllTasks();
  }, [task]);

  const showAllTasks= async () => {
    const res = await fetch("http://localhost:8080/api/tasks/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    setNote1(data);
  };

  useEffect(() => {
    showAllNotesDateMatch();
  }, []);

  const checkDate= async () => {
    const res = await fetch("http://localhost:8080/api/tasks/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    setTask(data);
    ValidateData();
  };

  const ValidateData = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

   
    today = yyyy + "-" + mm + "-" + dd;
    const taskDate= new Date(today);
    setDate(taskDate);
  };

  const funcDelete = async (e) => {
    const note_id = e.target.value;

    const res = await fetch("http://localhost:8080/api/delete/" + note_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    await res.json();
  };

  const funcDone = (event) => {
    let id = event.target.value;
    fetch("http://localhost:8080/api/done/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    Swal.fire({
      title: "Done",
      text: "Task Complete Successfully",
      icon: "success",
    });
  };

  const funcUndo = (event) => {
    let id = event.target.value;
    fetch("http://localhost:8080/api/undo/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    Swal.fire({
      title: "Undo",
      text: "Task Undo Successfully",
      icon: "success",
    });
  };

  return (
    <>
      <h2 style={{ color: "white", textAlign: "center" }}>All Tasks</h2>
      <br />
      <br />
      <br />

      <div class="row">
        {note1 ? (
          note1.map((notess) => (
            <div>
              {!notess.status && (
                <div class="col-md-3">
                  <div class="container isolateback">
                    <div class="row backgrnd">
                      <div class="col-md-4">
                        <div class="main " style={{ width: 300, height: 400 }}>
                          <div
                            class="service"
                            style={{ width: 300, height: 400 }}
                          >
                           

                            <h4 style={{ color: "black" }}>{notess.task}</h4>
                            <div class="notesDetails">
                              <p>
                                <textarea
                                  readonly
                                  value={notess.description}
                                  rows="3"
                                  width="30"
                                  class="txtarea"
                                  contenteditable="false"
                                ></textarea>
                                {date < new Date(notess.date) ? (
                                  <h4 style={{ color: "black" }}>
                                    {notess.date}
                                  </h4>
                                ) : (
                                  <h4 style={{ color: "red" }}>Expired</h4>
                                )}
                              </p>
                            </div>
                            <p>
                              <button
                                class="btn btn-danger btn-sm"
                                type="submit"
                                id="delbutt"
                                onClick={funcDelete}
                                value={notess.id}
                              >
                                Delete Task
                              </button>
                              &nbsp;&nbsp;
                              <Link
                                class="btn btn-warning"
                                id="linkbtn"
                                style={{ color: "black", width: 60 }}
                                to={`/editnote/${notess.id}`}
                              >
                                Update Task{" "}
                              </Link>
                              <button
                                style={{ marginLeft: "5%" }}
                                type="button"
                                class="btn btn-primary"
                                value={notess.id}
                                onClick={funcDone}
                              >
                                Task Done
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <br /> <br /> <br /> <br /> <br /> <br />
                  <hr />
                </div>
              )}
            </div>
          ))
        ) : (
          
        )}
       
      </div>
      <b>
        <hr></hr>
      </b>
      <hr></hr>

      <div class="container">
        <h2 class="title">
          <span class="title-word title-word-1">All Completed Task </span>
        </h2>
      </div>

      <div class="row">
        {note1 ? (
          note1.map((result) => (
            <div>
              {result.status && (
                <div class="col-md-3">
                  <div class="container isolateback">
                    <div class="row backgrnd">
                      <div class="col-md-4">
                        <div class="main " style={{ width: 300, height: 400 }}>
                          <div
                            class="service"
                            style={{ width: 300, height: 300 }}
                          >
                            

                            <h4 style={{ color: "black" }}>{result.task}</h4>
                            <div class="notesDetails">
                              <p>
                                <textarea
                                  readonly
                                  value={result.description}
                                  rows="4"
                                  width="30"
                                  class="txtarea"
                                  contenteditable="false"
                                ></textarea>
                              </p>
                            </div>
                            <p>
                              <Link
                                class="btn btn-outline-info"
                                style={{
                                  color: "black",
                                  width: 100,
                                  marginLeft: "5%",
                                }}
                                to={`/opennote/${result.id}`}
                              >
                                View your task{" "}
                              </Link>

                              <Link
                                class="btn btn-outline-success"
                                style={{
                                  color: "black",
                                  width: 100,
                                  marginLeft: "5%",
                                }}
                                to={`/editnote/${result.id}`}
                              >
                                Update your task{" "}
                              </Link>

                              <button
                                style={{ marginLeft: "5%" }}
                                type="button"
                                class="btn btn-outline-danger"
                                value={result.id}
                                onClick={DeleteHandler}
                              >
                                Delete Task
                              </button>

                              <button
                                style={{ marginLeft: "5%" }}
                                type="button"
                                class="btn btn-secondary"
                                value={result.id}
                                onClick={undoHandler}
                              >
                                Undo your task
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <br />
                  <hr />
                </div>
              )}
            </div>
          ))
        ) : (
          
              <h2 style={{ color: "white", textAlign: "center" }}>
                 No tasks
              </h2>
           
        )}
      </div>
    </>
  );
};
export default ShowAllTasks;
