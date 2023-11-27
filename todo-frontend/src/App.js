import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
//import "./components/About.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ShowNotes from "./components/AllTasks";
import Logout from "./components/Logout";


import UpdateTask from "./components/UpdateTask";


import GetTask from "./components/GetTask";
import AddTask from "./components/AddTask";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/shownotes" element={<AllTasks />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      
        <Route path="/editnote/:id" element={<UpdateTask />} />
       
        <Route path="/opennote/:id" element={<GetTask/>} />
        <Route path="/addnote" element={<AddTask/>} />
        
      </Routes>
    </>
  );
};

export default App;
