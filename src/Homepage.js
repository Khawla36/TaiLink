import React, { Component } from "react";
import "./Homepage.css";
import PagesJson from "./PagesJson";

export default class Homepage extends Component {
    render() {
        const homeData = PagesJson.find(item => item.pageId === 5);
        const contentHome = homeData.content;
        return (
            <div className="containersq">
                <div>
            <img src="HomePage3.png" className="image1" alt="Your Image"/>
                </div>
                <div className="sentence1">
                     {contentHome.map((item) => (
                    <p>
                        {item.t1}
                    </p>
                        ))}
                </div>
                <div className="sentence2">
                {contentHome.map((item) => (
                    <p>
                        {item.t2}
                    </p>
                        ))}
                </div>
                <button className="findmypet" href="./Service.js">find my pet</button>
                <div className="squares-container">
                <div className="square">Rescue</div>
                <div className="square">Shelters</div>
                <div className="square">Find a pet</div>
                <div className="square">Help us</div>
            </div>
         
            </div>
        );
    }
}
