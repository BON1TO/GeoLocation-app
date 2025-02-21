import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './location.css';

const LocationSaver = () => {
  const [location, setLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showMap, setShowMap] = useState(false); // Toggle map visibility

  const API_KEY = '5b3ce3597851110001cf6248c7798f360ba043ef8e89ddf2cdb03e5a'; // OpenRouteService API Key

  // Load saved locations from local storage
  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    setSavedLocations(storedLocations);
  }, []);

  // Get current location using geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => alert('Error fetching location')
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Save the current location to local storage
  const saveLocation = () => {
    if (location) {
      const newLocations = [...savedLocations, location];
      setSavedLocations(newLocations);
      localStorage.setItem('locations', JSON.stringify(newLocations));
      alert('Location saved!');
    } else {
      alert('Get location first!');
    }
  };

  // Custom Location Picker on Map
  const LocationPicker = ({ setPoint, pointNumber }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPoint({ latitude: lat, longitude: lng });
        alert(`Location ${pointNumber} selected: ${lat}, ${lng}`);
      },
    });
    return null;
  };

  // Calculate distance using OpenRouteService API
  const calculateDistance = async () => {
    if (!location1 || !location2) {
      alert('Please select two locations');
      return;
    }

    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car/json`,
        {
          coordinates: [
            [location1.longitude, location1.latitude],
            [location2.longitude, location2.latitude],
          ],
        },
        {
          headers: {
            Authorization: API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const distanceInMeters = response.data.routes[0].summary.distance;
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);
      setDistance(`${distanceInKm} km`);
    } catch (error) {
      console.error('Error fetching distance:', error);
      alert('Failed to get distance');
    }
  };

  return (
    <div className="location-saver">
      <h1>Enter Your Location Or Destination</h1>
      <button onClick={getLocation}>Get Current Location</button>
      <button onClick={saveLocation}>Save Location</button>

      {location && (
        <p>
          Current Location: Lat {location.latitude}, Lng {location.longitude}
        </p>
      )}

      <h2>Saved Locations:</h2>
      <ul>
        {savedLocations.map((loc, index) => (
          <li key={index}>
            Lat {loc.latitude}, Lng {loc.longitude}
          </li>
        ))}
      </ul>

      <h3>Select Locations to Calculate Distance:</h3>
      <select onChange={(e) => setLocation1(savedLocations[e.target.value])}>
        <option value="">Select Location 1</option>
        {savedLocations.map((loc, index) => (
          <option key={index} value={index}>
            Lat {loc.latitude}, Lng {loc.longitude}
          </option>
        ))}
      </select>

      <select onChange={(e) => setLocation2(savedLocations[e.target.value])}>
        <option value="">Select Location 2</option>
        {savedLocations.map((loc, index) => (
          <option key={index} value={index}>
            Lat {loc.latitude}, Lng {loc.longitude}
          </option>
        ))}
      </select>

      <button onClick={calculateDistance}>Calculate Distance</button>

      {distance && <h3>Distance: {distance}</h3>}

      {/* NEW: Map Toggle */}
      <button onClick={() => setShowMap(!showMap)}>
        {showMap ? 'Hide Map' : 'Open Map to Pick Custom Points'}
      </button>

      {showMap && (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px', width: '100%', marginTop: '10px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {location1 && (
            <Marker position={[location1.latitude, location1.longitude]}>
              <Popup>Location 1</Popup>
            </Marker>
          )}

          {location2 && (
            <Marker position={[location2.latitude, location2.longitude]}>
              <Popup>Location 2</Popup>
            </Marker>
          )}

          <LocationPicker setPoint={setLocation1} pointNumber={1} />
          <LocationPicker setPoint={setLocation2} pointNumber={2} />
        </MapContainer>
      )}
    </div>
  );
};

export default LocationSaver;
