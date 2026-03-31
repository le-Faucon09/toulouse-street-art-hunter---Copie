import type { Artwork } from "../../../src/data/MockArtworks";
import "./ArtworkCard.css";

type Props = {
  artwork: Artwork;
};

export default function ArtworkCard({ artwork }: Props) {
  return (
    <div className="artwork-card">
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        className="artwork-image"
      />
      <div className="artwork-info">
        <h3>{artwork.title}</h3>
        <p>
          <strong>{artwork.artist}</strong> · {artwork.address}
        </p>
        <p>
          ⭐ {artwork.rating.toFixed(1)} ({artwork.votes} avis)
        </p>
        <a
          href={`https://www.google.com/maps?q=${artwork.latitude},${artwork.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link"
        >
          Voir sur Google Maps
        </a>
      </div>
    </div>
  );
}
