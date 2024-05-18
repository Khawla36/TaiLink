import React, { Component } from "react";
import "./Service.css";
import PagesJson from "./PagesJson";

export default class Service extends Component {
    render() {
        const ServiceData = PagesJson.find(item => item.pageId === 6);
        const contentService = ServiceData.content;
        return (
            <div className="content-image">
                <p className="Hello">{contentService[0]}</p>
                <p className="Miss">{contentService[1]}</p>

                <input type="text" className="Micro-num" placeholder=" Microchip’s number" required/> 
                <button type="submit" className="location">Pet's Location</button> 
            </div>


        );
    }
}