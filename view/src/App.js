import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './General/Header';
import Aboutus from './Aboutus';
import Footer from './General/Footer';
import Contactus from "./Contactus";
import Login from "./Login";
import Homepage from "./Homepage";
import Service from "./Service";
import Map from "./googlemap";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/Service" element={<Service />} />
          <Route path="/Aboutus" element={<Aboutus />} />
          <Route path="/Contactus" element={<Contactus />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Map" element={<Map />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
