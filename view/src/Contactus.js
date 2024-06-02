import React, { Component } from "react";
import "./Contactus.css";

export default class Contactus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactuspage: null,
        };
    }
   
    componentDidMount() {
        const pageName = "Contact Us";
        fetch(`http://localhost:3001/${pageName}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          }) 
            .then(response => response.json())
            .then(page => {
                this.setState({ contactuspage: page });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    modalClose=()=>{

    }
    render() {
        
        const { contactuspage } = this.state;
        if (!contactuspage) return <div>PAGE NOT FOUND</div>;
        const contentContact = contactuspage.content;
        const textContact = contactuspage.text;
      
        return (
            <div className="model-backdrop">
                <div className="contact-containerr">
                    <div className="rectangle">
                       
                        <h1><a href="#" className="contact1">{contactuspage.PageName}</a></h1>
                        <p className="foryou">{contentContact}</p>

                        {textContact.map((item, index) => (
                            <input
                                key={index}
                                type={item.type}
                                className={item.className}
                                placeholder={item.placeholder}
                                required
                            />
                        ))}
                      

                        <input type="submit" className="sendbutton" value="Send" />
                    </div>
                </div>
            </div>
        );
    }
}
