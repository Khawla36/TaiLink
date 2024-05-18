import React, { Component } from "react";
import "./Header.css";
import MenuJson from '../MenuJson';

export default class Header extends Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li><h1 className="logo">{MenuJson[8].text}</h1></li>
            <li><div className="AboutUs"><a href={MenuJson[9].url}>{MenuJson[9].text}</a></div></li>
          </ul>

          <ul>
            {MenuJson.filter(menuItem => menuItem.menuId === 1).map(headerMenu => (
              <li>
                <a className={headerMenu.style} href={headerMenu.url}>{headerMenu.text}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="orange-navbar">
          <div className="navcontainer">
            {MenuJson.filter(menuItem => menuItem.menuId === 2).map(headerMenu => (
              <li>
                <a className={headerMenu.style} href={headerMenu.url}>{headerMenu.text}</a>
              </li>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
