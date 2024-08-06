import React, { Component } from 'react';
import './googlemap.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTime: '',
            petLocations: [],
            playing: false,
            currentPointIndex: 0,
            intervalId: null,
            currentPhoto: null,
            mapLoaded: false,
            currentTimestamp: null,
            view: 'main',
            showtrack: false,
            petLocation: null,
            petName: 'Bella',
            locationName: '',
            markers: [],
            polylines: [],
        };
        this.map = null;
        this.panorama = null;
    }

    componentDidMount() {
        this.loadScript();
        console.log(this.getCurrentTime());
    }

    componentWillUnmount() {
        const script = document.getElementById('googleMaps');
        if (script) {
            document.head.removeChild(script);
        }
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
    }

    loadScript = () => {
        const existingScript = document.getElementById('googleMaps');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB5t8KXIpcdx0n3I7FtsVtCJ86YoDngaYw&libraries=places,directions&callback=initMap";
            script.id = 'googleMaps';
            script.async = true;
            script.defer = true;
            window.initMap = this.initMap;
            document.head.appendChild(script);
        } else {
            this.initMap();
        }
    };

    initMap = () => {
        this.fetchData();
    };

    fetchData = () => {
        fetch('http://localhost:3001/trackipetmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pet_id: 1 }),
        })
            .then((response) => response.json())
            .then((data) => {
                const { lat, lng, locationName } = data;
                this.map = new window.google.maps.Map(document.getElementById('map'), {
                    zoom: 20,
                    center: { lat, lng },
                });

                const marker = new window.google.maps.Marker({
                    position: { lat, lng },
                    map: this.map,
                    title: 'Pet Location',
                });

                this.setState({ petLocation: { lat, lng }, locationName, markers: [marker], mapLoaded: true });
            })
            .catch((error) => console.error('Error fetching location:', error));
    };

    getCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timezoneOffset = -now.getTimezoneOffset() / 60;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
    };

    calculateTime = (selectedTime) => {
        const now = new Date(this.getCurrentTime().replace(' GMT', '').replace(/-/g, '/'));
        
        if (selectedTime.includes('last ')) {
            const hours = parseInt(selectedTime.split(' ')[1]);
            now.setHours(now.getHours() - hours);
        } else if (selectedTime === 'last day') {
            now.setDate(now.getDate() - 1);
        } else if (selectedTime === 'last week') {
            now.setDate(now.getDate() - 7);
        }

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timezoneOffset = -now.getTimezoneOffset() / 60;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
    };

    handleTimeChange = (event) => {
        const selectedTime = event.target.value;
        const currentTimestamp = this.calculateTime(selectedTime);
        console.log('Calculated time:', currentTimestamp); 
        this.setState({currentTimestamp: currentTimestamp,selectedTime: selectedTime });

        console.log("after set state",this.setState.selectedTime);
        console.log("after set state",this.setState.currentTimestamp);

    };

    showHistory = () => {
        const { selectedTime } = this.state;
        if (!selectedTime) {
            alert('Please select a time period.');
            return;
        }

        console.log(`Fetching location history for time: ${selectedTime}`);
        fetch(`http://localhost:3001/locationhistory?pet_id=1&time=${selectedTime}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(`Fetched location history: ${JSON.stringify(data)}`);
                this.setState({ petLocations: data, currentPointIndex: 0, currentPhoto: null, showtrack: true }, this.playHistory);
                this.initPanorama();
            })
            .catch((error) => console.error('Error fetching location history:', error));
    };

    initPanorama = () => {
        const { petLocation } = this.state;
        if (!petLocation) {
            console.error('Pet location not available.');
            return;
        }

        this.panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('pano'),
            {
                position: petLocation,
                pov: {
                    heading: 34,
                    pitch: 10,
                },
            }
        );
        this.map.setStreetView(this.panorama);
    };

    playHistory = () => {
        if (!this.state.playing) {
            const intervalId = setInterval(() => {
                const { currentPointIndex, petLocations } = this.state;
                if (currentPointIndex >= petLocations.length) {
                    clearInterval(this.state.intervalId);
                    this.setState({ playing: false });
                    return;
                }

                const point = petLocations[currentPointIndex];
                const previousPoint = currentPointIndex > 0 ? petLocations[currentPointIndex - 1] : null;
                this.addMarkerAndLine(point, previousPoint);

                this.setState({ currentPointIndex: currentPointIndex + 1, currentTimestamp: point.timestamp });
            }, 1000);

            this.setState({ intervalId, playing: true });
        }
    };

    stopHistory = () => {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
            this.setState({ playing: false, intervalId: null });
        }
    };

    addMarkerAndLine = (point, previousPoint) => {
        const marker = new window.google.maps.Marker({
            position: { lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) },
            map: this.map,
            title: `Pet Location at ${point.timestamp}`,
        });

        this.setState((prevState) => ({
            markers: [...prevState.markers, marker]
        }));

        if (previousPoint) {
            const line = new window.google.maps.Polyline({
                path: [
                    { lat: parseFloat(previousPoint.latitude), lng: parseFloat(previousPoint.longitude) },
                    { lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) },
                ],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            line.setMap(this.map);
            this.setState((prevState) => ({
                polylines: [...prevState.polylines, line]
            }));
        }

        const service = new window.google.maps.places.PlacesService(this.map);
        const request = {
            location: new window.google.maps.LatLng(point.latitude, point.longitude),
            radius: '50'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                
                const place = results[0];
                console.log('Nearby search results:', results);
                const photoUrl = place.photos && place.photos.length > 0
                    ? place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })
                    : '';

                if (photoUrl) {
                    console.log('Photo URL:', photoUrl);
                } else {
                    console.log('No photo available for this location.');
                }

                this.setState({
                    currentPhoto: {
                        name: place.name,
                        lat: point.latitude,
                        lng: point.longitude,
                        photoUrl: photoUrl
                    }
                });

                if (window.google.maps.StreetViewService) {
                    const streetViewService = new window.google.maps.StreetViewService();
                    const STREETVIEW_MAX_DISTANCE = 50;

                    streetViewService.getPanorama({
                        location: new window.google.maps.LatLng(point.latitude, point.longitude),
                        radius: STREETVIEW_MAX_DISTANCE
                    }, this.processStreetViewData);
                } else {
                    console.error('StreetViewService is not available.');
                }
            } else {
                console.error('Nearby search failed or no photos available:', status);
            }
        });
    };

    processStreetViewData = (data, status) => {
        if (status === window.google.maps.StreetViewStatus.OK) {
            this.panorama.setPosition(data.location.latLng);
            this.panorama.setPov({
                heading: 34,
                pitch: 10,
            });
        } else {
            console.error('Street View data not found for this location.');
        }
    };

    setView = (view) => {
        this.setState({ view }, () => {
            if (view === 'main') {
                this.stopHistory();
                this.clearMarkersAndPolylines();
                this.fetchData();
            }
        });
    };

    clearMarkersAndPolylines = () => {
        this.state.markers.forEach(marker => marker.setMap(null));
        this.state.polylines.forEach(polyline => polyline.setMap(null));
        this.setState({ markers: [], polylines: [] });
    };

    openDirections = () => {
        const { petLocation } = this.state;
        if (petLocation) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const origin = `${position.coords.latitude},${position.coords.longitude}`;
                    const destination = `${petLocation.lat},${petLocation.lng}`;
                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
                    window.open(directionsUrl, '_blank');
                });
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        } else {
            alert('Pet location not available.');
        }
    };

    renderSidebar = () => {
        const { view, selectedTime, currentTimestamp, petName } = this.state;
        console.log("this is the time",currentTimestamp)

        if (view === 'track') {
            return (
                <div className="sidebar">
                    <button onClick={() => this.setView('details')} className="back-button">&larr;</button>
                    <select onChange={this.handleTimeChange} value={selectedTime}>
                        <option value="">Select Time Period</option>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i + 1} value={`last ${i + 1} hours`}>{`Last ${i + 1} hours`}</option>
                        ))}
                        <option value="last day">Last Day</option>
                        <option value="last week">Last Week</option>
                    </select>
                    <button className='show2' onClick={this.showHistory}>Show History</button>
                    {currentTimestamp && (
                        <div className="timestamp-container">
                            <h4>{currentTimestamp}</h4>
                        </div>
                    )}
                </div>
            );
        }

        if (view === 'main') {
            return (
                <div className="sidebar">
                    <button className="petName" onClick={() => this.setView('details')}> {petName} </button>
                    <button className="add-microchip-button" onClick={() => alert('Add Microchip clicked')}>Add Microchip</button>
                </div>
            );
        }

        if (view === 'details') {
            return (
                <div className="sidebar">
                    <button onClick={() => this.setView('main')} className="back-button">&larr;</button>
                    <button className="show1" onClick={this.openDirections}>Pet Location</button>
                    <button className="show2" onClick={() => this.setView('track')}>Pet Track</button>
                </div>
            );
        }

        return null;
    };

    render() {
        const { currentPhoto, mapLoaded, showtrack, view } = this.state;
        console.log("Current Photo:", currentPhoto);
        console.log("Map Loaded:", mapLoaded);

        return (
            <div className="app-container">
                <div className="content-container-2">
                    {this.renderSidebar()}
                    <div id="map" className="map-container"></div>
                    {view === 'track' && (
                        <>
                            <div id="pano" className="map-streetview-container"></div>
                            {currentPhoto && currentPhoto.photoUrl && (
                                <div className="map-photo-container">
                                    <img src={currentPhoto.photoUrl} alt={currentPhoto.name} className="small-photo" />
                                    <h3>{currentPhoto.name}</h3>
                                    <p>Latitude: {currentPhoto.lat}</p>
                                    <p>Longitude: {currentPhoto.lng}</p>
                                </div>
                            )}
                            {mapLoaded && showtrack && (
                                <div className="audio-player-overlay">
                                    <AudioPlayer
                                        src="URL_OF_YOUR_AUDIO_FILE"
                                        onPlay={this.playHistory}
                                        onPause={this.stopHistory}
                                        showJumpControls={false}
                                        customAdditionalControls={[]}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default Map;
