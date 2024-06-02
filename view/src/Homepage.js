
import React, { Component } from "react";
import "./Homepage.css";

export default class Homepage extends Component {
  constructor(props) {
      super(props);
      this.state = {
      currentIndex: 0,
        homepage: null,
    };
  }

  componentDidMount() {
    const pageName = "Homepage";
    fetch(`http://localhost:3001/${pageName}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }) 
    .then(response => response.json())
    .then(data => {
    this.setState({homepage:data})   

    })
    .catch(error => console.error('Error fetching data:', error))
  }

   goToPrevious = () => {
    const {currentIndex, homepage} = this.state;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? homepage.gallery.length - 1 : currentIndex - 1;
    this.setState({currentIndex: newIndex});
  };

   goToNext = () => {
    const {currentIndex, homepage} = this.state;
    const isLastSlide = currentIndex === homepage.gallery.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    this.setState({currentIndex: newIndex})
  };

  render() {
    const {currentIndex, homepage} = this.state;
    if(!homepage) return;
    const homeGallery = homepage.gallery;
    const arrowLeftDisplay = currentIndex === 0 ? "none" : "block";
    const arrowRightDisplay = currentIndex === homeGallery.length - 1 ? "none" : "block";
   console.log(homeGallery)
    
 
    return (
      <div className="gallery">
        <button onClick={this.goToPrevious} className="arrow left-arrow" style={{display: arrowLeftDisplay}}> 
          ❮
        </button>
  
        <div className="slider">
          <div className="slider-inner" style={{transform: `translateX(-${currentIndex * 100}%)`}}>
            {homeGallery.map((image,index) => (
              <div className="slide" key={index}>
                <div className="image"></div>
                <a href="./Service">
                 <button className="gallery-button">Find my pet</button>
             </a>           
           </div>
            ))}
          </div>
        </div>
  
  
  
  
        <button onClick={this.goToNext} className="arrow right-arrow" style={{display: arrowRightDisplay}}>
          ❯
        </button>
        <div class="squares-container">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
    </div>
      </div>
    )
  }
}