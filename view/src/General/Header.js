// Header.js
import React, { Component } from "react";
import "./Header.css";
import LoginModal from "../Login";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header1data: null,
      showHelpAnimalModal: false,
      isOpen: false,
    };
  }

  componentDidMount() {
    this.fetchHeader1Menu();
  }

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  fetchHeader1Menu = () => {
    fetch(`http://localhost:3001/menupagesquary/1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ header1data: data });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  fetchHeader2Menu = () => {
    fetch(`http://localhost:3001/menupagesquary/2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ header2data: data });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  toggleHelpAnimalModal = () => {
    this.setState({ showHelpAnimalModal: !this.state.showHelpAnimalModal });
  }

  render() {
    const { header1data, header2data, showHelpAnimalModal, isOpen } = this.state;
    if (!header1data) return <div>HEADER1 MENU DATA..</div>;

    return (
      <div>
        <nav>
          <ul>
            <li><h1 className="logo"><a href="/Homepage">{header1data.text}</a></h1></li>
          </ul>
          <ul>
            {header1data.filter(menuItem => menuItem.menuId === 1).map(headerMenu => (
              <li key={headerMenu.itemId}>
                <a className={headerMenu.itemstyle} href={headerMenu.itemurl}>{headerMenu.itemtext}</a>
              </li>
            ))}
            <li>
              <a className="LogIn" onClick={this.openModal}>Sign in/up</a>
            </li>
          </ul>
        </nav>

        {isOpen && (
          <div className="modal">
            <div className="modal-content">
              <LoginModal onClose={this.closeModal} show={isOpen} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
