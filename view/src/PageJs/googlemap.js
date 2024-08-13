import React, { Component } from 'react';
import '../PageCss/googlemap.css';

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
            lastPetLocation: null,
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
            const apiKey = process.env.REACT_APP_API_KEY;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions&callback=initMap`;
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
                        scaledSize: new google.maps.Size(120, 90),
                    },
                });

                this.setState({ petLocation: { lat, lng }, lastPetLocation: { lat, lng }, locationName, markers: [marker], mapLoaded: true }, () => {
                    this.fetchLocationName(lat, lng);
                });
                console.log(`petLocation: ${lat}, ${lng}`);
            })
            .catch((error) => console.error('Error fetching location:', error));
    };

    fetchLocationName = (lat, lng) => {
        console.log(`Fetching location name for coordinates: ${lat}, ${lng}`);
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(lat, lng);

        geocoder.geocode({ 'location': latLng }, (results, status) => {
            if (status === 'OK' && results[0]) {
                console.log('Geocode success:', results[0].formatted_address);
                this.setState({ locationName: results[0].formatted_address });
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    };

    handleTimeChange = (event) => {
        const selectedTime = event.target.value;
        this.clearMarkersAndPolylines();
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
        const { selectedTime } = this.state;
        if (!selectedTime) {
            alert('Please select a time period.');
            return;
        }

        this.clearMarkersAndPolylines();

        const timePoints = this.calculateTime(selectedTime);

        this.setState({
            timePoints,
            currentTimeIndex: 0,
            currentTimestamp: timePoints[0],
            playing: true
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
        const locationTimer = setInterval(this.playNextPoint, 3000);
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
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(30, 30),
            },
        });
    
        this.setState((prevState) => ({
            markers: [...prevState.markers, marker]
        }));
    
        if (previousPoint) {
            const lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
                strokeColor: '#FFA500',
            };
    
            const line = new window.google.maps.Polyline({
                path: [
                    { lat: parseFloat(previousPoint.latitude), lng: parseFloat(previousPoint.longitude) },
                    { lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) },
                ],
                geodesic: true,
                strokeColor: '#FFA500',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                icons: [{
                    icon: lineSymbol,
                    offset: '50%',
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
    
        if (service && service.nearbySearch) {
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
        } else {
            console.error('PlacesService is not available.');
        }
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

    setViewAndClear = (view) => {
        this.setState((prevState) => ({
            view, 
            selectedTime: '',
            petLocations: [],
            currentTimestamp: "",
            playing: false,
            currentPointIndex: 0,
            currentTimeIndex: 0,
            currentPhoto: null,
            showtrack: false,
            lastPetLocation: prevState.petLocation
        }), () => {
            this.stopHistory();
            this.clearMarkersAndPolylines();
            if (view === 'details' && this.state.lastPetLocation) {
                this.displayLastPetLocation();
            } else if (view === 'main') {
                this.fetchData();
            }
        });
    };

    clearMarkersAndPolylines = () => {
        this.state.markers.forEach(marker => marker.setMap(null));
        this.state.polylines.forEach(polyline => polyline.setMap(null));
        this.setState({ markers: [], polylines: [] });
    };

    displayLastPetLocation = () => {
        const { lastPetLocation } = this.state;
        if (lastPetLocation) {
            const marker = new window.google.maps.Marker({
                position: lastPetLocation,
                map: this.map,
                title: 'Pet Location',
                icon: {
                    url: '/media/pawloc1.gif',
                    scaledSize: new google.maps.Size(150, 120),
                },
            });

            this.setState({ markers: [marker], petLocation: lastPetLocation, mapLoaded: true });
            this.map.setCenter(lastPetLocation);
        }
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

    showHistory = () => {
        const { selectedTime, playing } = this.state;
        if (!selectedTime) {
            alert('Please select a time period.');
            return;
        }
    
        if (playing) {
            this.stopHistory();
        }
    
        this.clearMarkersAndPolylines();
    
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
        const { currentPointIndex, petLocations, markers } = this.state;
        
        if (currentPointIndex < petLocations.length - 1) {
            const newIndex = currentPointIndex + 1;
            const currentPoint = petLocations[newIndex];
            const lastMarker = markers[markers.length - 1]; 

            if (currentPoint && lastMarker) {
                const previousLatLng = lastMarker.getPosition();
                const currentLatLng = { lat: parseFloat(currentPoint.latitude), lng: parseFloat(currentPoint.longitude) };

                const marker = new window.google.maps.Marker({
                    position: currentLatLng,
                    map: this.map,
                    title: `Pet Location at ${this.formatDate(new Date(currentPoint.timestamp))}`,
                    icon: {
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new google.maps.Size(30, 30),
                    },
                });

                const line = new window.google.maps.Polyline({
                    path: [previousLatLng, currentLatLng],
                    geodesic: true,
                    strokeColor: '#FFA500',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    icons: [{
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 3,
                            strokeColor: '#FFA500',
                        },
                        offset: '50%',
                    }],
                });
                line.setMap(this.map);

                this.setState((prevState) => ({
                    currentPointIndex: newIndex,
                    markers: [...prevState.markers, marker],
                    polylines: [...prevState.polylines, line],
                }), () => {
                    this.updateMap(currentPoint);
                    this.updatePanorama(currentPoint);
                    
                    this.pauseAutoPlay(3000); 
                });
            }
        }
    };

    pauseAutoPlay = (delay) => {
        this.stopHistory();  
        setTimeout(() => {
            this.startLocationTimer();  
            this.startHourTimer();  
        }, delay);
    };
    
    handleBackward = () => {
        const { currentPointIndex, markers, polylines, petLocations } = this.state;
        if (currentPointIndex > 1) {
            const lastMarker = markers[markers.length - 1];
            const lastPolyline = polylines[polylines.length - 1];
    
            if (lastMarker) {
                lastMarker.setMap(null);
            }
            if (lastPolyline) {
                lastPolyline.setMap(null);
            }
    
            const point = petLocations[currentPointIndex - 2];
    
            this.setState((prevState) => ({
                currentPointIndex: currentPointIndex - 1,
                markers: prevState.markers.slice(0, -1),
                polylines: prevState.polylines.slice(0, -1),
                currentTimestamp: this.formatDate(new Date(point.timestamp))
            }), () => {
                this.updateMap(point);
                this.updatePanorama(point);
            });
        }
    };

    renderSidebar = () => {
        const { view, selectedTime, currentTimestamp, petName, locationName, petLocation } = this.state;

        if (view === 'track') {
            return (
                <div className="sidebar">
                    <button onClick={() => this.setViewAndClear('details')} className="back-button">&larr;</button>
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
                    {locationName && (
                        <>
                            <div className="locationName">
                                <p>{locationName}</p>
                            </div>
                        </>
                    )}
                    {petLocation && (
                        <>
                            <div className="latandlng">
                                <p>Latitude: {petLocation.lat}</p>
                                <p>Longitude: {petLocation.lng}</p>
                            </div>
                            <div className="location-separator"></div> {/* קו מפריד */}
                        </>
                    )}
                    <button className="add-microchip-button" onClick={() => alert('Add Microchip clicked')}>Add Microchip</button>
                </div>
            );
        }

        if (view === 'details') {
            return (
                <div className="sidebar">
                    <button onClick={() => this.setView('main')} className="back-button">&larr;</button>
                    <button className="show1" onClick={this.openDirections}>Pet Location</button>
                    <button className="show2" onClick={() => this.setViewAndClear('track')}>Pet Track</button>
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
