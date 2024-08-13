import React, { Component } from "react";
import "../PageCss/Login.css";

export default class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.activeTab || "Sign up",
      formData: {},
      left: [],
      right: [],
      loginFormData: {},
      loginText: [],
      loginImages: {},
      signupImages: {},
      pageDataSignup: null,
      pageDataLogin: null
    };
  }

  componentDidMount() {
    this.fetchPageData("Signup");
    this.fetchPageData("Login");
    this.fetchSignupPage(3);
    this.fetchSignupPage(2);
  }

  fetchSignupPage = (formId) => {
    fetch(`http://localhost:3001/forms/${formId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          if (formId === 3) {
            this.setState({
              formData: this.buildInitialFormData(data),
              buttonsData: data.buttons || [],
              left: data.filter(field => field.side === 'left') || [],
              right: data.filter(field => field.side === 'right') || []
            });
          } else if (formId === 2) {
            this.setState({
              loginFormData: this.buildInitialFormData(data),
              loginButtonsData: data.buttons || [],
              loginText: data || []
            });
          } else {
            console.error("Unexpected data", data);
          }
        }
      })
      .catch((error) => console.error("Error fetching signup data:", error));
  }

  fetchPageData = (pageType) => {
    const pageId = pageType === "Signup" ? 3 : 4;
    fetch(`http://localhost:3001/pages/${pageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(page => {
        if (pageType === "Signup") {
          this.setState({
            pageDataSignup: page,
            signupImages: { img1: page.Img1, img2: page.Img2 }
          });
        } else {
          this.setState({
            pageDataLogin: page,
            loginImages: { img1: page.Img1, img2: page.Img2 }
          });
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  buildInitialFormData = (data) => {
    const initialFormData = {};
    data.forEach((field) => {
      const key = field.placeholder.replace(/ /g, "").toLowerCase();
      initialFormData[key] = field.value;
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
        [name]: value
      },
      loginFormData: {
        ...prevState.loginFormData,
        [name]: value
      }
    }));
  };

  render() {
    const {
      activeTab,
      formData,
      left,
      right,
      loginFormData,
      loginText,
      loginImages,
      signupImages
    } = this.state;

    return (
      <div className={`modal ${this.props.show ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="close" onClick={this.props.onClose}>&times;</div>
          <div className="formboxx">
            <div className="button-boxx">
              <button
                className={`toggle-btn1 ${activeTab === "Log in" ? "active" : ""}`}
                onClick={() => this.setActiveTab("Log in")}
              >
                Log In
              </button>
              <button
                className={`toggle-btn1 ${activeTab === "Sign up" ? "active" : ""}`}
                onClick={() => this.setActiveTab("Sign up")}
              >
                Sign Up
              </button>
            </div>
            <div className="social-icons">
              <img
                src={activeTab === "Sign up" ? signupImages.img1 : loginImages.img1}
                alt="social icon 1"
              />
              <img
                src={activeTab === "Sign up" ? signupImages.img2 : loginImages.img2}
                alt="social icon 2"
              />
            </div>

            {activeTab === "Sign up" && (
              <form className="input-group">
                <div className="input-left">
                  {left.map((item, index) => (
                    <input
                      key={index}
                      type={item.type}
                      className="input-field"
                      placeholder={item.placeholder}
                      name={item.placeholder.replace(/ /g, "").toLowerCase()}
                      value={formData[item.placeholder.replace(/ /g, "").toLowerCase()] || ""}
                      onChange={this.handleChange}
                      required
                    />
                  ))}
                </div>
                <div className="input-right">
                  {right.map((item, index) => (
                    <input
                      key={index}
                      type={item.type}
                      className="input-field"
                      placeholder={item.placeholder}
                      name={item.placeholder.replace(/ /g, "").toLowerCase()}
                      value={formData[item.placeholder.replace(/ /g, "").toLowerCase()] || ""}
                      onChange={this.handleChange}
                      required
                    />
                  ))}
                </div>
                <button type="submit" className="submit-btnn">Sign up</button>
              </form>
            )}

            {activeTab === "Log in" && (
              <form className="input-group_login">
                {loginText.map((item, index) => (
                  <input
                    key={index}
                    type={item.type}
                    className="input-field1_login"
                    placeholder={item.placeholder}
                    name={item.placeholder.replace(/ /g, "").toLowerCase()}
                    value={loginFormData[item.placeholder.replace(/ /g, "").toLowerCase()] || ""}
                    onChange={this.handleChange}
                    required
                  />
                ))}
                  <button
                  type="button"
                  className="forget"
                  onClick={this.handleForgetPassword} // Define this function to handle the action
                >
                  Forget/Change your password?
                </button>

                <button type="submit" className="submit-btnn">Log in</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}
