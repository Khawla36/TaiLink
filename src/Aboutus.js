import React, { Component } from "react";
import "./Aboutus.css";
import PagesJson from "./PagesJson";

export default class Aboutus extends Component {
    render() {
        const aboutData = PagesJson.find(item => item.pageId === 1);
        const contentAbout = aboutData.content;

        return (
            <div className="about-containerr">
              <div className="about-rectangle">
                <h1 className="TaiLink-About">{aboutData.title}</h1>
                <div className="sen1">
                  {contentAbout.map((item) => (
                    <>
                    <p>
                        {item.p}
                    </p>
                    </>
                  ))}
                </div>
              </div>
            </div>
          );
        };
    }

