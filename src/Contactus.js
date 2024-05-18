import React, { Component } from "react";
import "./Contactus.css";
import FormJson from './formid';
import PagesJson from './PagesJson';


export default class Contactus extends Component {
    render() {
        const idform = FormJson.find(item => item.formId === 1);
        const contantform = idform.content;
        const page1=PagesJson.find(item => item.PageName === "Contact US");


        return(
            
            <div className="contact-containerr">
                <div className="rectangle">
                    <h1><a href="#" className="contact1">{page1.PageName}</a></h1>
                    <p className="foryou">{page1.content}</p>

                    {contantform.map((item) =>(
                       <>
                    <input type={item.type} className={item.className} placeholder={item.placeholder} required />
                    </>
                     ))}
                < input type="submit" className="sendbutton" value="Send"/>
           </div>
            </div>
      );
    }     
}  
