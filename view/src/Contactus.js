import React, { Component } from "react";
import "./Contactus.css";

export default class Contactus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactuspage: null,
            pageData: null
        };
    }

    componentDidMount() {
        this.fetchPageData();
        this.fetchContactuspage();
    }

    fetchContactuspage = () => {
        fetch(`http://localhost:3001/forms/1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ contactuspage: data });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    fetchPageData = () => {
        fetch(`http://localhost:3001/pages/2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(page => {
            this.setState({ pageData: page });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    render() {
        const { contactuspage, pageData } = this.state;
        if (!contactuspage) return <div>CONTACTUS PAGE DATA..</div>;
        if (!pageData) return <div>PAGE NOT FOUND</div>;

        return (
            <div className="modal-content">
                {/* <button className="close-button" onClick={this.props.onClose}>×</button> */}
                <h1><a href="#" className="contact1">{pageData.PageName}</a></h1>
                <p className="foryou">{pageData.content}</p>
                {contactuspage.map((item, index) => (
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
        );
    }
}
