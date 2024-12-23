import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button, Input } from 'antd';
import 'leaflet/dist/leaflet.css';
import 'antd/dist/reset.css'; // Import Ant Design CSS for the UI components

const LeafletMapComponent: React.FC = () => {
  const [chosenLocation, setChosenLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState<number>(15);
  
  // Handle the map click event to set a new location
  const HandleMapClick = () => {
    const map = useMapEvents({
      click(e) {
        setChosenLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return null;
  };

  // Custom icon for the marker
  const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const handleZoomIn = () => {
    setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    setZoom(zoom - 1);
  };

  const saveLocation = () => {
    if (chosenLocation) {
      // Optionally, save the location to localStorage or send it to a server
      console.log('Saved Location:', chosenLocation);
      alert(`Location saved: ${chosenLocation.lat}, ${chosenLocation.lng}`);
    } else {
      alert('Please click on the map to select a location.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Set Your Location</h1>

      <div className="w-full md:w-2/3 lg:w-1/2 h-96 bg-white shadow-lg rounded-lg mb-4">
        <MapContainer center={{ lat: 40.730610, lng: -73.935242 }} zoom={zoom} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <HandleMapClick />
          
          {/* Display the marker if a location is chosen */}
          {chosenLocation && (
            <Marker position={chosenLocation} icon={icon}>
              <Popup>
                <b>Chosen Location</b><br />
                Lat: {chosenLocation.lat}, Lng: {chosenLocation.lng}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="flex space-x-4 mb-4">
        <Button type="primary" onClick={handleZoomIn} className="bg-blue-500 hover:bg-blue-600 text-white">
          Zoom In
        </Button>
        <Button type="default" onClick={handleZoomOut} className="bg-gray-500 hover:bg-gray-600 text-white">
          Zoom Out
        </Button>
      </div>

      <div className="mb-4">
        <Input
          value={chosenLocation ? `${chosenLocation.lat}, ${chosenLocation.lng}` : 'No location set'}
          disabled
          className="w-full md:w-1/2"
        />
      </div>

      <Button type="primary" onClick={saveLocation} className="bg-green-500 hover:bg-green-600 text-white">
        Set Location
      </Button>
    </div>
  );
};

export default LeafletMapComponent;
