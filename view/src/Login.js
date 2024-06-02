import React, { Component } from "react";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "Sign up",
      formData: {},
      buttonsdata: [],
      leftside: [],
      rightside: [],
      loginFormData: {},
      loginButtonsdata: [],
      loginText: [],
      loginImages: {},
      signupImages: {},
    };
  }

  componentDidMount() {
    fetch("http://localhost:3001/Signup",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    

      .then((response) => response.json())
      .then((data) => {
        this.setState({
          formData: this.buildInitialFormData(data.text),
          buttonsdata: data.buttons,
          leftside: data.text[0].leftside,
          rightside: data.text[1].rightside,
          signupImages: { img1: data.Img1, img2: data.Img2 },
        });
      })
      .catch((error) => console.error("Error fetching signup data:", error));

    fetch("http://localhost:3001/LogIn")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          loginFormData: this.buildInitialFormData(data.text),
          loginButtonsdata: data.buttons,
          loginText: data.text,
          loginImages: { img1: data.Img1, img2: data.Img2 },
        });
      })
      .catch((error) => console.error("Error fetching login data:", error));
  }

  buildInitialFormData = (text) => {
    const initialFormData = {};
    text.forEach((field) => {
      if (field.placeholder) {
        initialFormData[field.placeholder.replace(/ /g, "").toLowerCase()] =
          field.value;
      } else if (field.leftside || field.rightside) {
        field.leftside?.forEach((subField) => {
          initialFormData[
            subField.placeholder.replace(/ /g, "").toLowerCase()
          ] = subField.value;
        });
        field.rightside?.forEach((subField) => {
          initialFormData[
            subField.placeholder.replace(/ /g, "").toLowerCase()
          ] = subField.value;
        });
      }
    });
    return initialFormData;
  };

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  render() {
    const {
      activeTab,
      formData,
      buttonsdata,
      leftside,
      rightside,
      loginFormData,
      loginButtonsdata,
      loginText,
      loginImages,
      signupImages,
    } = this.state;

    return (
      <div className="content-container">
        <div className="formboxx">
          <div className="button-boxx">
            {buttonsdata.map((value, index) => (
              <button
                key={index}
                type="button"
                className={`toggle-btn1 ${
                  activeTab === value.text ? "active" : ""
                }`}
                onClick={() => this.setActiveTab(value.text)}
              >
                {value.text}
              </button>
            ))}
          </div>

          <div className="social-icons">
            <img
              src={
                activeTab === "Sign up" ? signupImages.img1 : loginImages.img1
              }
              alt="social icon 1"
            />
            <img
              src={
                activeTab === "Sign up" ? signupImages.img2 : loginImages.img2
              }
              alt="social icon 2"
            />
          </div>

          {activeTab === "Sign up" && (
            <form className="input-group">
              <div className="input-left">
                {leftside.map((item, index) => (
                  <input
                    key={index}
                    type={item.type}
                    className="input-field"
                    placeholder={item.placeholder}
                    name={item.placeholder.replace(/ /g, "").toLowerCase()}
                    value={
                      formData[
                        item.placeholder.replace(/ /g, "").toLowerCase()
                      ] || ""
                    }
                    onChange={this.handleChange}
                    required
                  />
                ))}
              </div>
              <div className="input-right">
                {rightside.map((item, index) => (
                  <input
                    key={index}
                    type={item.type}
                    className="input-field"
                    placeholder={item.placeholder}
                    name={item.placeholder.replace(/ /g, "").toLowerCase()}
                    value={
                      formData[
                        item.placeholder.replace(/ /g, "").toLowerCase()
                      ] || ""
                    }
                    onChange={this.handleChange}
                    required
                  />
                ))}
              </div>
              <button type="submit" className="submit-btnn">
                Sign up
              </button>
            </form>
          )}

          {activeTab === "Log in" && (
            <form className="input-group">
              {loginText.map((item, index) => (
                <input
                  key={index}
                  type={item.type}
                  className="input-field1"
                  placeholder={item.placeholder}
                  name={item.placeholder.replace(/ /g, "").toLowerCase()}
                  value={
                    loginFormData[
                      item.placeholder.replace(/ /g, "").toLowerCase()
                    ] || ""
                  }
                  onChange={this.handleChange}
                  required
                />
              ))}
              <a href="#" className="forget">
                Forget/Change your password?
              </a>
              <button type="submit" className="submit-btnn">
                Log in
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}