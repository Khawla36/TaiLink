import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './General/Header';
import Aboutus from "./PageJs/Aboutus";
import Footer from './General/Footer';
import Contactus from "./PageJs/Contactus";
import Homepage from "./PageJs/Homepage";
import Service from "./PageJs/Service";
import Map from "./PageJs/googlemap";

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
          <Route path="/Map" element={<Map />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
