import  { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './General/Header';
import Aboutus from './Aboutus';
import Footer from './General/Footer.js';
import Contactus from "./Contactus";
import Login from "./Login.js";
import Signin from "./Signup.js";
import Homepage from "./Homepage.js";
import Service from "./Service.js";


function App() {
  return (
    <div className="App">
    {
       <BrowserRouter>
         <Header></Header>

         <Routes>
           <Route index element={<Homepage />} />
           <Route path="/Service" element={<Service />}/>
           <Route path="/Aboutus" element={<Aboutus />} />
           <Route path="/Contactus" element={<Contactus />} />
           <Route path="/Login" element={<Login />} />
           <Route path="/Signup" element={<Signin/>} />
           <Route path="/Login" element={<Login/>} />
        </Routes>

           <Footer></Footer>
        </BrowserRouter>
    }
   </div>

  );

}

export default App;
