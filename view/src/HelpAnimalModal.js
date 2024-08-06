import React, { Component } from "react";
import "./HelpAnimalModal.css";
import ChatComponent from "./chat";

class HelpAnimalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      microchipId: "",
      showChat: false,
      showTooltip: false,
    };
  }

  handleChange = (event) => {
    this.setState({ microchipId: event.target.value });
  };

  handleSubmit = () => {
    this.setState({ showChat: true });
  };

  handleEndChat = () => {
    this.setState({ showChat: false });
    this.props.onClose();
  };

  handleMouseOver = () => {
    this.setState({ showTooltip: true });
  };

  handleMouseOut = () => {
    this.setState({ showTooltip: false });
  };

  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="custom-modal">
        <div className="custom-modal-content">
          <span className="custom-modal-close" onClick={this.props.onClose}>&times;</span>
          {this.state.showChat ? (
            <ChatComponent onEndChat={this.handleEndChat} />
          ) : (
            <>
              <div className="fullname">
                <h2>You found a lost pet</h2>
                <div className="microchip-info-container">
                  <p>Please write your full name:</p>
                </div>

                <input
                  type="text"
                  value={this.state.microchipId}
                  onChange={this.handleChange}
                  className="custom-modal-input"
                />
              </div>

              <div className="microchip-info-container">
                <p>Please write the ID of the microchip:</p>
                <div 
                  className="microchip-info"
                  onMouseOver={this.handleMouseOver}
                  onMouseOut={this.handleMouseOut}
                > &#9432;
                  {this.state.showTooltip && (
                    <img 
                      src="media/microchip.png" 
                      alt="Microchip ID Location"
                      className="tooltip-image"
                    />
                  )}
                </div>
              </div>
              <input
                type="text"
                value={this.state.microchipId}
                onChange={this.handleChange}
                className="custom-modal-input"
              />
              <button onClick={this.handleSubmit} className="custom-modal-button">Open a chat with owner</button>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default HelpAnimalModal;
