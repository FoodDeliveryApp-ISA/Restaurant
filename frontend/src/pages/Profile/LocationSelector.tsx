import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Import marker icons
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Configure Leaflet's default icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const LocationSelector: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  // Fetch the user's current position on component mount
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setPosition([coords.latitude, coords.longitude]),
      () => alert("Unable to fetch location, please select manually.")
    );
  }, []);

  // Component to handle click events on the map
  const LocationMarker = () => {
    useMapEvents({
      click: (e) => {
        setSelectedLocation([e.latlng.lat, e.latlng.lng]);
      },
    });

    return selectedLocation ? (
      <Marker position={selectedLocation}>
        <Popup>
          Selected Location: <br />
          Latitude: {selectedLocation[0]}, Longitude: {selectedLocation[1]}
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={position || [51.505, -0.09]} // Default to London if position is null
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && (
          <Marker position={position}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default LocationSelector;
