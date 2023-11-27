import React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const UpdateTask= () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({
    task: "",
    description: "",
  });

  let name, value;
  const changeState = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setNote({ ...note, [name]: value });
  };

  const submitData= async (e) => {
    e.preventDefault();
    const { task, description } = note;
    const res = await fetch("http://localhost:8080/api/notes/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        task,
        description,
      }),
    });
    const data = await res.json();
    console.log(data);

    Swal.fire({
      icon: "success",
      title: "Success",
      type: "success",
      text: "Updation of Note has been done !",
    }).then(() => {
      navigate("/shownotes");
    });
  };

  useEffect(() => {
    getNote();
  }, []);

  const getNote = async () => {
    const res = await fetch("http://localhost:8080/tasks/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (data.message === "unauthenticated") {
      console.log("status");
      navigate("/shownotes");
    } else {
      setNote(data);
    }
  };

  return (
    <>
      <center>
        <div class="backcolor">
          <h1>Update your task</h1>
          <br />
          <br />

          <div class="row backgrnd" style={{ width: 400 }}>
            <div class="col-md-4" style={{ width: 400 }}>
              <div class="main">
                <div class="service1">
                 
                  <h4>
                    Add Note{" "}
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
                    <div class="row">
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
                          onChange={changeState}
                        />
                      </div>
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
                          onChange={changeState}
                        />
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-10">
                        <input
                          type="submit"
                          name="submit"
                          id="submit"
                          className="form-submit btn btn-primary btn-sm"
                          value="Edit Note"
                          onClick={submitData}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </center>
    </>
  );
};
export default UpdateTask;
