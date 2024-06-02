import  { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './General/Header';
import Aboutus from './Aboutus';
import Footer from './General/Footer.js';
import Contactus from "./Contactus";
import Login from "./Login.js";
import Signup from "./Signup.js";
import Homepage from "./Homepage.js";
import Service from "./Service.js";
import React, { useState, useEffect } from "react";


function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/text")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return (
    <div className="App">
    {
       <BrowserRouter>
         <Header></Header>
         <h1>{message}</h1>

         <Routes>
           <Route index element={<Homepage />} />
           <Route path="/Homepage" element={<Homepage />} />
           <Route path="/Service" element={<Service />}/>
           <Route path="/Aboutus" element={<Aboutus />} />
           <Route path="/Contactus" element={<Contactus />} />
           <Route path="/Login" element={<Login />} />
           <Route path="/Signup" element={<Signup/>} />
           <Route path="/Login" element={<Login/>} />
        </Routes>

           <Footer></Footer>
        </BrowserRouter>
    }
   </div>

  );

}

export default App;
