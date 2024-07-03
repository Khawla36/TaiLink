import React, { Component } from 'react';
import './googlemap.css';

class Map extends Component {
    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        const lat = parseFloat(searchParams.get('lat'));
        const lng = parseFloat(searchParams.get('lng'));

        const initMap = () => {
            if (window.google && window.google.maps) {
                const mapLocation = { lat, lng };
                const map = new window.google.maps.Map(document.getElementById('map'), {
                    zoom: 12,
                    center: mapLocation
                });

                new window.google.maps.Marker({
                    position: mapLocation,
                    map: map,
                    title: 'Pet Location'
                });
            } else {
                console.error("Google Maps API failed to load.");
            }
        };

        const loadScript = () => {
            const existingScript = document.getElementById('googleMaps');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAyCujJ188OdhtBjKLmV2CheQgDnqEa-9o&callback=initMap';
                script.id = 'googleMaps';
                script.async = true;
                script.defer = true;
                script.onload = initMap;
                document.head.appendChild(script);
            } else {
                initMap();
            }
        };

        loadScript();
    }

    componentWillUnmount() {
        const script = document.getElementById('googleMaps');
        if (script) {
            document.head.removeChild(script);
        }
    }

    render() {
        return (
            <div className="app-container">
                <div className="content-container-2">
                    <div className="sidebar">
                        <img src="../media/dog-location.png" alt="Dog Location" className="photo" />
                        <div className="dog-info">
                            <p className="info-text">Name: Bella</p>
                            <p className="info-text">Location: Tel Aviv</p>
                            <p className="info-text">Longitude: 32.074572</p>
                            <p className="info-text">Latitude: 34.797105</p>

                        </div>
                    </div>
                    <div id="map"></div>
                </div>
            </div>
        );
    }
}

export default Map;
