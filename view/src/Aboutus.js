import React, { Component } from "react";
import "./Aboutus.css";

export default class Aboutus extends Component {
    constructor(props) {
        super(props);
        this.state = {
        aboutus: null,
        };
    }

    componentDidMount() {
        const pageName = "AboutUs";
        fetch(`http://localhost:3001/${pageName}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          }) 
            .then(response => response.json())
            .then(page => {
                this.setState({ aboutus: page });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    render() {
        const { aboutus } = this.state;
        if (!aboutus) return <div>PAGE NOT FOUND</div>;
        const contentAbout = aboutus.content;

        return (
            <div className="about-containerr">
                <div className="about-rectangle">
                    <h1 className="TaiLink-About">{aboutus.title}</h1>
                    <div className="sen1">
                        {contentAbout.map((item, index) => (
                            <p key={index}>
                                {item.p}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
