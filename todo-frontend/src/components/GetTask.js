import React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const GetTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    task: "",
    description: "",
  });
  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    const res = await fetch("http://localhost:8080/api/note/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (data.message === "unauthenticated") {
      console.log("status");
      navigate("/home");
    } else {
      setTask(data);
    }
  };

  return (
    <>
      <center>
        <div class="backcolor">
         
          <div class="row backgrnd" style={{ width: 500 }}>
            <div class="col-md-10" style={{ width: 400 }}>
              <div class="main">
               
                  <h4>
                    Your Task{" "}
                    <i
                      class="fa-solid fa-soft-serve"
                      style={{ color: "black" }}
                    ></i>
                  </h4>

                  <form
                    method="POST"
                    className="register-form"
                    id="register-form"
                  >
                   
                      <label
                        class="label col-md-2 control-label"
                        style={{ color: "grey" }}
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
                        />
                      
                    </div>

                    <div class="row">
                      <label
                        class="label col-md-2 control-label"
                        style={{ color: "grey" }}
                      >
                        text
                      </label>
                      <div class="col-md-10">
                        <textarea
                          class="form-control"
                          name="description"
                          id="description"
                          style={{ color: "black" }}
                          rows="4"
                          width="30"
                          placeholder="Enter content"
                          value={note.description}
                        />
                      </div>
                      <Link
                        class="btn btn-success"
                        style={{
                          color: "black",
                          width: 300,
                          marginLeft: "5%",
                        }}
                        to="/shownotes"
                      >
                        Home{" "}
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        
      </center>
    </>
  );
};
export default GetTask;
