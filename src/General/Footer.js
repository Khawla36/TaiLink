import { Component } from "react";
import "./Footer.css";

export default class Footer extends Component{
    render(){
     return(
        <footer>   


        <ul className="aboutcontact">
            <li><a className="us" href="#">About Us </a></li>
            <li><a className="us" href="./Contactus">Contact Us</a></li>
        </ul>

        <p>&copy; 2024 TaiLink. All right reserved</p>

    </footer>

        );
    }
}