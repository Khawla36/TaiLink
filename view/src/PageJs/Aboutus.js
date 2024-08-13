import React, { Component } from "react";
import "../PageCss/Aboutus.css";

export default class Aboutus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aboutus: null,
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/pages/1', { 
            method: 'POST',
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

        let contentArray = [];
        try {
            contentArray = Array.isArray(contentAbout) ? contentAbout : JSON.parse(contentAbout);
        } catch (error) {
            console.error('Error parsing content:', error);
        }

        return (
            <div className="about-containerr">
                <div className="about-rectangle">
                    <h1 className="TaiLink-About">{aboutus.title}</h1>
                    <div className="sen1">
                        {contentArray.map((item, index) => (
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
