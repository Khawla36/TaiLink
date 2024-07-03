import React, { Component } from "react";
import "./Homepage.css";
import Service from "./Service";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      homepage: null,
      imageBack: [],
      showModal: false,
      modalContent: null,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3001/pages/5", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.Img3)
      const gallery = [];
      if (data.Img1) gallery.push(data.Img1);
      if (data.Img2) gallery.push(data.Img2);
      if (data.Img3) gallery.push(data.Img3);
      console.log(gallery);
      this.setState({ imageBack: gallery, homepage: data });
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  goToPrevious = () => {
    this.setState(prevState => ({
      currentIndex: (prevState.currentIndex - 1 + prevState.imageBack.length) % prevState.imageBack.length
    }));
  };

  goToNext = () => {
    this.setState(prevState => ({
      currentIndex: (prevState.currentIndex + 1) % prevState.imageBack.length,
    }));
  };

  openModal = (content) => {
    this.setState({ showModal: true, modalContent: content });
  };

  closeModal = () => {
    this.setState({ showModal: false, modalContent: null });
  };

  handleEmptyClick = () => {
  };

  handleExternalLink = (url) => {
    window.location.href = url;
  }

  render() {
    const { currentIndex, homepage, imageBack, showModal, modalContent } = this.state;
    if (!homepage) return null;

    const arrowLeftDisplay = currentIndex === 0 ? "none" : "block";
    const arrowRightDisplay = currentIndex === imageBack.length - 1 ? "none" : "block";

    return (
      <div className="gallery">
        <button onClick={this.goToPrevious} className="arrow left-arrow" style={{ display: arrowLeftDisplay }}>
          ❮
        </button>

        <div className="slider">
          <div className="slider-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {imageBack.map((image, index) => (
              <div className="slide" key={index}>
                <div className="image" style={{ backgroundImage: `url(${image})` }}></div>
                {index === 0 && (
                  <button className="gallery-button1" onClick={() => this.openModal(<Service />)}>Find my pet</button>
                )}
                {index === 1 && (
                  <button className="gallery-button2" onClick={this.handleEmptyClick}>
                    Post my pet
                  </button>
                )}
                {index === 2 && (
                  <button className="gallery-button3" onClick={() => this.handleExternalLink('https://trackipet.com/')}>Buy a microchip</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button onClick={this.goToNext} className="arrow right-arrow" style={{ display: arrowRightDisplay }}>
          ❯
        </button>

        <div className="squares-container">
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={this.closeModal}>&times;</span>
              {modalContent}
            </div>
          </div>
        )}
      </div>
    );
  }
}
