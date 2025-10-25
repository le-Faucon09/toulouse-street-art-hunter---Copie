import L from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ArtworkList from "../components/ArtworkList";
import ChangeMapView from "../pages/ChangeMapView";
import "../pages/MapComponent.css";

// Icône personnalisée
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function MapComponent() {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNearbyArtworks, setShowNearbyArtworks] = useState(false);
  const [artworks, setArtworks] = useState< 
  { id: number; name: string; lat: number; lon: number }[]
   >([]);
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setError(null);
          setLoading(false);
        },
        () => {
          setError("Impossible d'obtenir votre position.");
          setLoading(false);
        },
      );
    } else {
      setError("La géolocalisation n'est pas supportée.");
    }
  };

  const handleShowNearby = () => {
    if (currentPosition) {
      setShowNearbyArtworks(true);
    } else {
      setError("Géolocalisez-vous d'abord.");
    }
  };

  return (
    <div className="map-layout">
      <h1 className="map-title">Les œuvres à proximité</h1>

      <div className="map-content">
        <div className="map-section">
          <MapContainer
            center={currentPosition || [43.604, 1.444]} // Toulouse
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "350px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {currentPosition && (
              <>
                <ChangeMapView position={currentPosition} />
                <Marker position={currentPosition} icon={defaultIcon}>
                  <Popup>Vous êtes ici 📍</Popup>
                </Marker>
              </>
            )}

            {/* 👇 Ici les marqueurs d'œuvres */}
            {artworks.map((art) => (
              <Marker key={art.id} position={[art.lat, art.lon]} icon={defaultIcon}>
                <Popup>
                  <strong>{art.name}</strong>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="map-buttons">
            <button
              type="button"
              onClick={handleGeolocation}
              className="geo-btn"
            >
              📍 Me géolocaliser
            </button>
            <button
              type="button"
              onClick={handleShowNearby}
              className="nearby-btn"
            >
              🎯 Œuvres à proximité
            </button>
          </div>

          {loading && <p>Recherche de votre position...</p>}
          {error && <p className="error-message">{error}</p>}
        </div>

        {showNearbyArtworks && currentPosition && (
          <div className="artwork-card-list">
            <ArtworkList
              userLatitude={currentPosition[0]}
              userLongitude={currentPosition[1]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
