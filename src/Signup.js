import React, { Component } from "react";
import "./Signup.css";
import FormJson from "./formid";
import PagesJson from "./PagesJson";

export default class Signup extends Component {
    render() {
        const signData = FormJson.find(item => item.formId === 3);
        const leftsideContent = signData.content.find(section => section.leftside).leftside;
        const rightsideContent = signData.content.find(section => section.rightside).rightside;
        const pagesdata = PagesJson.find(item => item.pageId === 4);
        const buttonsdata = pagesdata.buttons;
        const submitButtonData = buttonsdata.find(button => button.type === "text");

        return (
            <div className="content-container">
                <div className="formbox">
                    <div className="button-box">
                        <div id="btn"></div>
                        {buttonsdata.map((value, index) => (
                            <button
                                key={index}
                                type={value.type}
                                className={value.className}
                            >
                                {value.text}
                            </button>
                        ))}
                    </div>

                    <div className="social-icons">
                        <img src={pagesdata.Img2} alt="fac" />
                        <img src={pagesdata.Img1} alt="fac" />
                    </div>

                    <form className="input-group">
                        <div className="input-left">
                            {leftsideContent.map((item, index) => (
                                <input
                                    key={index}
                                    type={item.type}
                                    className={item.className}
                                    placeholder={item.placeholder}
                                    required
                                />
                            ))}
                        </div>

                        <div className="input-right">
                            {rightsideContent.map((item, index) => (
                                <input
                                    key={index}
                                    type={item.type}
                                    className={item.className}
                                    placeholder={item.placeholder}
                                    required
                                />
                            ))}
                        </div>
                    </form>
                    
                    <button type="submit" className="submit-btn">Sign up</button>

                </div>
            </div>
        );
    }
}
