import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css"; // Ensure correct import

const App = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState(null);
  const [formData, setFormData] = useState({ image: null, text: "" });
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Initial map center

  const LocationMarker = () => {
    useMapEvents({
      click: (e) => setNewLocation(e.latlng),
    });
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newLocation && formData.text && formData.image) {
      const newEntry = {
        position: newLocation,
        text: formData.text,
        image: URL.createObjectURL(formData.image),
      };
      setLocations([...locations, newEntry]);
      setNewLocation(null);
      setFormData({ image: null, text: "" });
    }
  };

  // Function to handle location search
  const handleSearch = () => {
    const searchQuery = document.getElementById("locationSearch").value;
    if (searchQuery) {
      const geocoder = L.Control.Geocoder(); // Initialize geocoder correctly
      geocoder.geocode(searchQuery, (results) => {
        if (results.length > 0) {
          const latlng = results[0].center;
          setMapCenter([latlng.lat, latlng.lng]); // Set map center to searched location
        }
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Garbage Prone Areas</h1>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        whenCreated={(map) => {
          // Add geocoder control for search functionality
          L.Control.geocoder().addTo(map); // Correct usage of geocoder
        }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker />
        {locations.map((loc, idx) => (
          <Marker key={idx} position={loc.position}>
            <Popup>
              <p>{loc.text}</p>
              <img src={loc.image} alt="Uploaded" style={{ width: "100px", height: "auto" }} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <input 
        type="text" 
        id="locationSearch" 
        placeholder="Search for a location..."
        style={{ marginTop: "20px", padding: "8px", width: "200px" }}
      />
      <button onClick={handleSearch} style={{ marginTop: "10px", padding: "8px 12px" }}>
        Search
      </button>

      {newLocation && (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
        >
          <h3>Add a Garbage Prone Area</h3>
          <textarea
            placeholder="Enter description"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            required
            style={{ marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "5px 10px" }}>Submit</button>
        </form>
      )}
      <img 
        src="/pic.jpeg" 
        alt="Example" 
        style={{ 
          position: "absolute", 
          top: "20px", 
          right: "20px", 
          width: "60px", 
          height: "auto" 
        }} 
      />
    </div>
  );
};

export default App;
