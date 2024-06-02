import React, { Component } from "react";
import "./Service.css";

export default class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
        servicepage: null,
        };
    }

    componentDidMount() {
        const pageName = "Service1";
        fetch(`http://localhost:3001/${pageName}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          })  
            .then(response => response.json())
            .then(page => {
                this.setState({ servicepage: page });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    render() {
        const { servicepage } = this.state;
        if (!servicepage) return <div>PAGE NOT FOUND</div>;
        const contentService = servicepage.content;
       
   
        return (
            <div className="container">
                <div className="image-section"></div>     
                <div className="paw"></div>
                <div className="content-section">
                    <p className="Hello">{contentService[0]}</p>
                    <p className="Miss">{contentService[1]}</p>
                    <button type="submit" className="location">Pet's Location</button>
                    
                </div>
            </div>
        );
    }
}
