import { useEffect, useState } from "react";
import "./Gallerie.css";

type photoData = {
  photo: string,
  date: string,
  user: string
}



export default function Gallerie() {
  const [photos, setPhotos] = useState<photoData[]>([]);

  const loadGallery = () => {
    const savedPhotos= localStorage.getItem("galleryPhotos");
    setPhotos(savedPhotos ? JSON.parse(savedPhotos) : []);
  };

  const deletePhoto = (index: number) => {
  const updatedPhotos = photos.filter((_, i) => i !== index);
  localStorage.setItem("galleryPhotos", JSON.stringify(updatedPhotos));
  setPhotos(updatedPhotos);
  window.dispatchEvent(new Event("galleryUpdate"));
}

  useEffect(() => {
    loadGallery();
    
      window.addEventListener("galleryUpdate", loadGallery);
      window.addEventListener("storage", loadGallery);

      return () => {
        window.removeEventListener("galleryUpdate", loadGallery);
        window.removeEventListener("storage", loadGallery);
      };
    }, []);
    
  return (
      <main className="gallerie-container">
        <h2>🎨 Gallerie</h2>

        {photos.length === 0 ? (
          <p>Aucune photo pour le moment.</p>
        ) : (
          <section className="gallerie-content">
            {photos.map((photo, index) => (
              <figure key={index} className="photo-item">
              <img src={photo.photo} alt={`photo ${index + 1}`} />
              <figcaption>
                {photo.user} - {" "}
                {new Date(photo.date).toLocaleDateString("fr-FR")}
              </figcaption>
              <button
              onClick={ () =>
              deletePhoto(index)}
              className="delete-button"
              aria-label="Supprimer cette photo"
              >
                🗑️ Supprimer
              </button>
              </figure>
            ))}
          </section>
        )}
      </main>
  );
}
