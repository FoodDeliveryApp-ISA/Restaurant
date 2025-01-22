import React, { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationSelector: React.FC<{
  restaurantLocation?: string;
  onLocationChange?: (location: { lat: number; lng: number }) => void;
}> = ({ restaurantLocation, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [markerInstance, setMarkerInstance] = useState<L.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return;

      // Initialize Leaflet map
      const map = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      setMapInstance(map);
      return map;
    };

    const map = initializeMap();

    // Prioritize restaurant location, then fallback to live location
    if (restaurantLocation) {
      const [lat, lng] = restaurantLocation.split(",").map(Number);
      setCurrentLocation({ lat, lng });
      map.setView([lat, lng], 13);

      const marker = L.marker([lat, lng], { draggable: true })
        .addTo(map)
        .bindPopup("Restaurant Location")
        .openPopup();

      setMarkerInstance(marker);
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setCurrentLocation({ lat, lng });
        onLocationChange?.({ lat, lng });
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          map.setView([latitude, longitude], 13);

          const marker = L.marker([latitude, longitude], { draggable: true })
            .addTo(map)
            .bindPopup("You are here!")
            .openPopup();

          setMarkerInstance(marker);
          marker.on("dragend", () => {
            const { lat, lng } = marker.getLatLng();
            setCurrentLocation({ lat, lng });
            onLocationChange?.({ lat, lng });
          });
        },
        (error) => console.error("Error getting geolocation:", error)
      );
    }

    return () => {
      map.remove();
    };
  }, [restaurantLocation, onLocationChange]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        ref={mapRef}
        className="h-[50vh] w-full rounded-lg shadow-md border border-gray-200"
        style={{ background: "linear-gradient(135deg, #e0e7ff, #eef2ff)" }}
      />
      {currentLocation && (
        <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Location</h3>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Latitude:</span> {currentLocation.lat.toFixed(5)}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Longitude:</span> {currentLocation.lng.toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

