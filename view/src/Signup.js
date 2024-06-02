import React, { Component } from "react";
import "./Signup.css";


export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        signupage: null,
        };
    }

    componentDidMount() {
        const pageName = "Signup";
        fetch(`http://localhost:3001/${pageName}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          }) 
            .then(response => response.json())
            .then(page => {
            this.setState({ signupage: page });    

            })
            .catch(error => console.error('Error fetching data:', error));
    }

    render() {
        const { signupage } = this.state;
        if (!signupage) return <div>PAGE NOT FOUND</div>;

        const textSignup = signupage.text;
        const leftsideContent = textSignup[0].leftside;
        const rightsideContent = textSignup[1].rightside;
        const buttonsdata = signupage.buttons;
       
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
                        <img src={signupage.Img2} alt="fac" />
                        <img src={signupage.Img1} alt="fac" />
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