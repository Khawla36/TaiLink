import React, { Component } from "react";
import "../PageCss/chat.css";

class ChatComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessage: "",
    };
  }

  handleMessageChange = (event) => {
    this.setState({ newMessage: event.target.value });
  };

  handleSendMessage = () => {
    if (this.state.newMessage.trim() !== "") {
      const newMessage = {
        text: this.state.newMessage,
        time: new Date().toLocaleTimeString(),
      };
      this.setState(
        (prevState) => ({
          messages: [...prevState.messages, newMessage],
          newMessage: "",
        }),
        () => {
          this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
      );
    }
  };

  render() {
    return (
      <div className="custom-chat-container">
        <div className="custom-messages">
          {this.state.messages.map((message, index) => (
            <div key={index} className="custom-message">
              <div className="custom-message-text">{message.text}</div>
              <div className="custom-message-time">{message.time}</div>
            </div>
          ))}
          <div ref={(el) => { this.messagesEnd = el; }} />
        </div>
        <input
          type="text"
          className="custom-input"
          value={this.state.newMessage}
          onChange={this.handleMessageChange}
          placeholder="Type your message"
        />
        <div className="custom-buttons-container">
          <button onClick={this.handleSendMessage} className="custom-button">
            Send
          </button>
          <button onClick={this.props.onEndChat} className="custom-end-button">
            End Chat
          </button>
        </div>
      </div>
    );
  }
}

export default ChatComponent;
