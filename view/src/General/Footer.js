import React, { Component } from "react";
import "./Footer.css";
import Contactus from "../Contactus";

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      footerdata: null,
    };
  }

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  componentDidMount() {
    this.fetchFooterMenu();
  }

  fetchFooterMenu = () => {
    fetch(`http://localhost:3001/menupagesquary/3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ footerdata: data });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  render() {
    const { footerdata } = this.state;
    if (!footerdata) return <div>FOOTER MENU DATA..</div>;

    return (
      <footer>
        <ul className="aboutcontact">


          {footerdata.filter(menuItem => menuItem.itemId === 10).map(footerMenu => (
          <li>
            <a className={footerMenu.itemstyle} href="./Aboutus"> {footerMenu.itemtext}{" "} </a>
          </li>
          ))}

         {footerdata.filter(menuItem => menuItem.itemId === 11).map(footerMenu => (
          <li>
            <button className={footerMenu.itemstyle} onClick={this.openModal}> {footerMenu.itemtext} </button>
          </li>
         ))}
        </ul>

        {footerdata.filter(menuItem => menuItem.itemId === 12).map(footerMenu => (
        <p>&copy; {footerMenu.itemtext}</p>
        ))}
        
        {this.state.isOpen && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-button" onClick={this.closeModal}>
                &times;
              </button>
              <Contactus />
            </div>
          </div>
        )}
      </footer>
    );
  }
}
