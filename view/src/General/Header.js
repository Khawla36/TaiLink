import React, { Component } from "react";
import "./Header.css";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
        header1data: null,
        header2data: null,

    };  
}
componentDidMount() {
    this.fetchHeader1Menu();
    this.fetchHeader2Menu();

}

fetchHeader1Menu=()=>{
        fetch(`http://localhost:3001/menupagesquary/1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }) 
        .then(response => response.json())
        .then(data => {
            this.setState({ header1data : data });
        })
        .catch(error => console.error('Error fetching data:', error));
        
    }

    fetchHeader2Menu=()=>{
      fetch(`http://localhost:3001/menupagesquary/2`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
      }) 
      .then(response => response.json())
      .then(data => {
          this.setState({ header2data : data });
      })
      .catch(error => console.error('Error fetching data:', error));
      
  }
  render() {
    const { header1data } = this.state;
    if (!header1data) return <div>HEADER1 MENU DATA..</div>;

    const { header2data } = this.state;
    if (!header2data) return <div>HEADER2 MENU DATA..</div>; 

    return (
      <div>
        <nav>
          <ul>
            <li><h1 className="logo" ><a herf="/Homepage" >{header1data.text}</a></h1></li>
          </ul>
           <ul>
            {header1data.filter(menuItem => menuItem.menuId === 1).map(headerMenu => (
              <li>
                <a className={headerMenu.itemstyle} href={headerMenu.itemurl}>{headerMenu.itemtext}</a>
              </li>
            ))}
          </ul>
                  </nav>


      <div className="orange-navbar">
          <div className="navcontainer">
            {header2data.filter(menuItem => menuItem.menuId === 2).map(headerMenu => (
              <li>
                <a className={headerMenu.itemstyle} href={headerMenu.itemurl}>{headerMenu.itemtext}</a>
              </li>
            ))} 
          </div> 
       </div> 
      </div>
    );
  }
}
