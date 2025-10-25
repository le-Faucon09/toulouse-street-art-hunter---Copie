import type { Artwork } from "../data/mockArtworks";
import { mockArtworks } from "../data/mockArtworks";
import ArtworkCard from "./ArtworkCard";

type Props = {
  userLatitude: number;
  userLongitude: number;
};

function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ArtworkList({ userLatitude, userLongitude }: Props) {
    const artworksWithDistance = mockArtworks.map((artwork: Artwork) => {
    const distance = getDistanceInKm(
      userLatitude,
      userLongitude,
      artwork.latitude,
      artwork.longitude,
    );
    
    return {...artwork,  distance };
  });

  const nearbyArtworks = artworksWithDistance
  .filter((art) => art.distance <=30)
  .sort((a, b) => a.distance - b.distance);

  return (
    <div className="artwork-list">
      {nearbyArtworks.length === 0 && <p>Aucune oeuvre à proximité.</p>}
      {nearbyArtworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
