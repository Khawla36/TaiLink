import React, { Component } from 'react';
import './googlemap.css';

/* global google */

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTime: '',
            currentTimestamp: "",
            petLocations: [],
            playing: false,
            currentPointIndex: 0,
            currentTimeIndex: 0,
            locationTimer: null,
            hourTimer: null,
            currentPhoto: null,
            mapLoaded: false,
            view: 'main',
            showtrack: false,
            petLocation: null,
            petName: 'Bella',
            locationName: '',
            markers: [],
            polylines: [],
            timePoints: [],
        };
        this.map = null;
        this.panorama = null;
    }

    componentDidMount() {
        this.loadFontAwesome();
        this.loadScript();
    }

    componentWillUnmount() {
        const script = document.getElementById('googleMaps');
        if (script) {
            document.head.removeChild(script);
        }
        this.stopHistory();
    }

    loadFontAwesome = () => {
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    loadScript = () => {
        const existingScript = document.getElementById('googleMaps');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places,directions&callback=initMap`;
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
        if (typeof google !== 'undefined' && google.maps) {
            this.fetchData();
        } else {
            console.error("Google Maps JavaScript API not loaded.");
        }
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
                    icon: {
                        url: '/media/pawloc1.gif',
                        scaledSize: new google.maps.Size(200, 150), // שינוי גודל האייקון לפי הצורך
                    },
                });

                this.setState({ petLocation: { lat, lng }, locationName, markers: [marker], mapLoaded: true });
                console.log(`petLocation: ${lat}, ${lng}`);
            })
            .catch((error) => console.error('Error fetching location:', error));
    };

    handleTimeChange = (event) => {
        const selectedTime = event.target.value;
        this.clearMarkersAndPolylines(); // Clear existing markers and polylines
        this.setState({ selectedTime });
    };

    formatDate = (date) => {
        const pad = (n) => (n < 10 ? '0' + n : n);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    calculateTime = (selectedTime) => {
        const now = new Date();
        let startTime;
        let timePoints = [];

        const hours = parseInt(selectedTime);
        if (!isNaN(hours)) {
            startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
            for (let i = 0; i <= hours; i++) {
                const time = new Date(startTime.getTime() + i * 60 * 60 * 1000);
                timePoints.push(this.formatDate(time));
            }
        } else {
            switch (selectedTime) {
                case 'day':
                    startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    for (let i = 0; i <= 24; i++) {
                        const time = new Date(startTime.getTime() + i * 60 * 60 * 1000);
                        timePoints.push(this.formatDate(time));
                    }
                    break;
                case 'week':
                    startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    for (let i = 0; i <= 7 * 24; i++) {
                        const time = new Date(startTime.getTime() + i * 60 * 60 * 1000);
                        timePoints.push(this.formatDate(time));
                    }
                    break;
            }
        }
        return timePoints;
    };

    showHistory = () => {
        const { selectedTime, playing } = this.state;
        if (!selectedTime) {
            alert('Please select a time period.');
            return;
        }
    
        if (playing) {
            this.stopHistory(); // Stop any ongoing calculation if running
        }
    
        this.clearMarkersAndPolylines(); // Clear existing markers and polylines
    
        const timePoints = this.calculateTime(selectedTime);
    
        this.setState({
            timePoints,
            currentTimeIndex: 0,
            currentTimestamp: timePoints[0],
            playing: true,
            petLocations: [],
            currentPointIndex: 0,
            currentPhoto: null,
            showtrack: true
        }, () => {
            this.fetchLocationHistory();
            this.startLocationTimer();
            this.startHourTimer();
        });
    };

    fetchLocationHistory = () => {
        const { timePoints, currentTimeIndex } = this.state;
        const currentTime = new Date(timePoints[currentTimeIndex]);
        const nextTime = currentTimeIndex < timePoints.length - 1 ? new Date(timePoints[currentTimeIndex + 1]) : new Date();

        fetch(`http://localhost:3001/locationhistory?pet_id=1&time=${encodeURIComponent(currentTime.toISOString())}`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then((data) => {
                const filteredData = data.filter(point => {
                    const pointTime = new Date(point.timestamp);
                    return pointTime >= currentTime && pointTime < nextTime;
                });
                this.setState({
                    petLocations: filteredData,
                    currentPointIndex: 0,
                    currentPhoto: null,
                    showtrack: true
                }, () => {
                    this.initPanorama();
                    this.playNextPoint();
                });
            })
            .catch((error) => {
                console.error('Error fetching location history:', error);
                console.error('Fetch response: ', error.message);
            });
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

    startLocationTimer = () => {
        const locationTimer = setInterval(this.playNextPoint, 1000); // Decrease wait time to speed up route display
        this.setState({ locationTimer });
    };

    startHourTimer = () => {
        const hourTimer = setInterval(() => {
            const { currentTimeIndex, timePoints } = this.state;
            if (currentTimeIndex < timePoints.length - 1) {
                this.setState({
                    currentTimeIndex: currentTimeIndex + 1,
                    currentTimestamp: timePoints[currentTimeIndex + 1],
                    currentPointIndex: 0
                }, this.fetchLocationHistory);
            } else {
                this.stopHistory();
            }
        }, 60000);

        this.setState({ hourTimer });
    };

    stopHistory = () => {
        if (this.state.locationTimer) {
            clearInterval(this.state.locationTimer);
        }
        if (this.state.hourTimer) {
            clearInterval(this.state.hourTimer);
        }
        this.setState({ playing: false, locationTimer: null, hourTimer: null });
    };

    playNextPoint = () => {
        const { currentPointIndex, petLocations, playing, currentTimeIndex, timePoints } = this.state;

        if (!playing) return;

        if (currentPointIndex >= petLocations.length) {
            if (currentTimeIndex < timePoints.length - 1) {
                this.setState({
                    currentTimeIndex: currentTimeIndex + 1,
                    currentPointIndex: 0
                }, () => {
                    this.fetchLocationHistory();
                });
            } else {
                this.stopHistory();
            }
            return;
        }

        const point = petLocations[currentPointIndex];
        const previousPoint = currentPointIndex > 0 ? petLocations[currentPointIndex - 1] : null;

        if (point && point.latitude && point.longitude) {
            this.addMarkerAndLine(point, previousPoint);
    
            this.setState({
                currentPointIndex: currentPointIndex + 1,
                currentTimestamp: this.formatDate(new Date(point.timestamp))
            });
    
            this.updatePanorama(point);
        }
    };

    addMarkerAndLine = (point, previousPoint) => {
        if (!point || !point.latitude || !point.longitude) {
            console.error("Invalid point data:", point);
            return;
        }

        const marker = new window.google.maps.Marker({
            position: { lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) },
            map: this.map,
            title: `Pet Location at ${this.formatDate(new Date(point.timestamp))}`,
            icon: {
                url: './media/pawloc1.gif', // URL של האייקון
                scaledSize: new google.maps.Size(200, 150), // שינוי גודל האייקון, כאן הגדרתי גודל גדול יותר
            },
        });

        this.setState((prevState) => ({
            markers: [...prevState.markers, marker]
        }));

        if (previousPoint) {
            const lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
                strokeColor: '#FFA500', // כאן אפשר לשנות את צבע החצים
            };

            const line = new window.google.maps.Polyline({
                path: [
                    { lat: parseFloat(previousPoint.latitude), lng: parseFloat(previousPoint.longitude) },
                    { lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) },
                ],
                geodesic: true,
                strokeColor: '#FFA500', // כאן אפשר לשנות את צבע הקווים
                strokeOpacity: 1.0,
                strokeWeight: 2,
                icons: [{
                    icon: lineSymbol,
                    offset: '50%', // מיקום החץ באמצע הקו
                }],
            });
            line.setMap(this.map);
            this.setState((prevState) => ({
                polylines: [...prevState.polylines, line]
            }));
        }

        this.updateMap(point);
        this.updatePanorama(point);

        const service = new window.google.maps.places.PlacesService(this.map);
        const request = {
            location: new window.google.maps.LatLng(point.latitude, point.longitude),
            radius: '50'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                const place = results[0];
                const photoUrl = place.photos && place.photos.length > 0
                    ? place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })
                    : '';

                const localTime = new Date(point.timestamp);
                this.setState({
                    currentPhoto: {
                        name: place.name,
                        lat: point.latitude,
                        lng: point.longitude,
                        photoUrl: photoUrl,
                        timestamp: localTime.toISOString()
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

    updateMap = (point) => {
        if (this.map) {
            this.map.panTo({ lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) });
        }
    };

    updatePanorama = (point) => {
        if (this.panorama) {
            this.panorama.setPosition({ lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) });
        }
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

    togglePlayPause = () => {
        this.setState((prevState) => ({
            playing: !prevState.playing
        }), () => {
            if (this.state.playing) {
                this.startLocationTimer();
                this.startHourTimer();
            } else {
                this.stopHistory();
            }
        });
    };

    handleForward = () => {
        const { currentPointIndex, petLocations } = this.state;
        if (currentPointIndex < petLocations.length - 1) {
            this.setState({ currentPointIndex: currentPointIndex + 1 }, this.playNextPoint);
        }
    };

    handleBackward = () => {
        const { currentPointIndex, markers, polylines } = this.state;
        if (currentPointIndex > 1) {
            // מחיקת הנקודות והקווים המיותרים
            markers.slice(currentPointIndex).forEach(marker => marker.setMap(null));
            polylines.slice(currentPointIndex).forEach(polyline => polyline.setMap(null));

            this.setState((prevState) => ({
                currentPointIndex: currentPointIndex - 2,
                markers: prevState.markers.slice(0, currentPointIndex - 1),
                polylines: prevState.polylines.slice(0, currentPointIndex - 1)
            }), this.playNextPoint);
        }
    };

    renderSidebar = () => {
        const { view, selectedTime, currentTimestamp, petName } = this.state;

        if (view === 'track') {
            return (
                <div className="sidebar">
                    <button onClick={() => this.setView('details')} className="back-button">&larr;</button>
                    <select onChange={this.handleTimeChange} value={selectedTime}>
                        <option value="">Select Time Period</option>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{`Last ${i + 1} hours`}</option>
                        ))}
                        <option value="day">Last Day</option>
                        <option value="week">Last Week</option>
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
                    <button className="petName" onClick={() => this.setView('details')}>{petName}</button>
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
        const { currentPhoto, mapLoaded, showtrack, view, playing } = this.state;
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
                                    <p>Timestamp: {this.formatDate(new Date(currentPhoto.timestamp))}</p>
                                </div>
                            )}
                            {mapLoaded && showtrack && (
                                <div className="audio-player-overlay">
                                    <button className="control-button" onClick={this.handleBackward}>
                                        <i className="fas fa-backward"></i>
                                    </button>
                                    <button className="PlayPause" onClick={this.togglePlayPause}>
                                        {playing ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                                    </button>
                                    <button className="control-button" onClick={this.handleForward}>
                                        <i className="fas fa-forward"></i>
                                    </button>
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
