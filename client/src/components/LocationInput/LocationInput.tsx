// src/components/LocationInput.tsx

import { useState } from "react";

// Type pour les props : on envoie la position au parent
type Props = {
  onPositionFound: (latitude: number, longitude: number) => void;
};

export default function LocationInput({ onPositionFound }: Props) {
  const [city, setCity] = useState(""); // État pour le champ texte

  // Fonction appelée quand on clique sur "Me localiser"
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée");
      return;
    }

    // Demande la position à l'utilisateur
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Envoie les coordonnées au parent
        onPositionFound(position.coords.latitude, position.coords.longitude);
      },
      () => {
        alert("Impossible de récupérer votre position.");
      },
    );
  };

  // Fonction appelée si on entre "Toulouse"
  const handleManualSubmit = () => {
    if (city.trim().toLowerCase() === "toulouse") {
      // Centre-ville de Toulouse (approximatif)
      onPositionFound(43.6045, 1.4442);
    } else {
      alert("Seule la ville de Toulouse est supportée pour l’instant.");
    }
  };

  return (
    <div className="location-input">
      <button type="button" onClick={handleGeolocation}>
        📍 Me géolocaliser
      </button>

      <div className="manual-entry">
        <input
          type="text"
          placeholder="Entrer une ville (ex : Toulouse)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="button" onClick={handleManualSubmit}>
          Valider
        </button>
      </div>
    </div>
  );
}
