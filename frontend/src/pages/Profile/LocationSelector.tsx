import React, { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationSelector = () => {
  const mapRef = useRef<HTMLDivElement>(null); // Reference to the map container
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null); // Leaflet map instance
  const [markerInstance, setMarkerInstance] = useState<L.Marker | null>(null); // Marker instance
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return;

      // Initialize Leaflet map
      const map = L.map(mapRef.current).setView([0, 0], 2);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      setMapInstance(map); // Save map instance for further use
      return map;
    };

    const map = initializeMap();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLiveLocation({ lat: latitude, lng: longitude });

          // Center the map to user's location
          map.setView([latitude, longitude], 13);

          // Add a draggable marker for the live location
          const liveLocationIcon = L.icon({
            iconUrl: "https://static.thenounproject.com/png/3354655-200.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          const marker = L.marker([latitude, longitude], {
            icon: liveLocationIcon,
            draggable: true, // Make the marker draggable
          })
            .addTo(map)
            .bindPopup("You are here!")
            .openPopup();

          setMarkerInstance(marker);

          // Update location state on marker drag
          marker.on("dragend", () => {
            const { lat, lng } = marker.getLatLng();
            setLiveLocation({ lat, lng });
            console.log("New location:", { lat, lng });
          });
        },
        (error) => console.error("Error getting geolocation: ", error)
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    // Cleanup function to remove the map on component unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="h-[50vh] w-full rounded-lg shadow-md border border-gray-200"
        style={{
          background: "linear-gradient(135deg, #e0e7ff, #eef2ff)",
        }}
      />

      {/* Live Location Info */}
      {liveLocation && (
        <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Current Location
          </h3>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Latitude:</span>{" "}
            {liveLocation.lat.toFixed(5)}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Longitude:</span>{" "}
            {liveLocation.lng.toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
