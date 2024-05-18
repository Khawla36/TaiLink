import React, { Component } from "react";
import "./Login.css" ;
import FormJson from "./formid";
import PagesJson from "./PagesJson";

export default class Login extends Component {
    render() {
        const signData = FormJson.find(item => item.formId === 3);
    
        const pagesdata = PagesJson.find(item => item.pageId === 4);
        const buttonsdata = pagesdata.buttons;
        const submitButtonData = buttonsdata.find(button => button.type === "text");

        return (
            <div className="content-container">
                <div className="formboxx">
            <div className="button-boxx">
             <div id="btn"></div>
                <button type="button" className="toggle-btn">Log in</button>
                <button type="button" className="toggle-btn">Sign up</button> 
                    </div>

                    <div className="social-icons">
                        <img src={pagesdata.Img2} alt="fac" />
                        <img src={pagesdata.Img1} alt="fac" />
                    </div>
        
                <form className="input-groupp">
                    <input type="text" className="input-field1" placeholder="Email" required/>
                    <input type="password" className="input-field1" placeholder="Password" required/>
                    <a href="#" className="forget">Forget/Change your password?</a>
                <button type="submit" className="submit-btnn">Log in</button>
                </form>
              </div>
            </div>
        );
    }
}
