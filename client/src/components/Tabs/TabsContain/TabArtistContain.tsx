import { useEffect, useRef, useState } from "react";
import "./TabArtistContain.css";

type Artist = {
  id: number;
  name: string;
  bio: string;
  profile_image_url: string;
  created_at?: Date;
};

export default function TabArtistContain() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/artist`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);
        setLoading(false);
      });
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra :", err);
      alert("Impossible d'accéder à la caméra. Vérifie les permissions.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const image = canvasRef.current.toDataURL("image/png");

      // Ajoute la photo à l'état local
      setPhotos((prev) => {
        const newPhotos = [...prev, image];

         // Enregistre dans 
        localStorage.setItem("galleryPhotos", JSON.stringify(newPhotos))

        window.dispatchEvent(new Event("galleryUpdate"));

        return newPhotos;
    });
  }
  };

  const clearPhotos = () => {
    setPhotos([]);
    localStorage.removeItem("galleryPhotos");
  };

  if (loading) return <p>Chargement des artistes en cours...</p>;

  return (
    <div>
      <h3>Les artistes de Street Art Hunter</h3>

      {/* ---- TABLEAU ---- */}
      <table>
        <caption>Liste des artistes</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Bio</th>
            <th>Image</th>
            <th>Créé le</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.name}</td>
              <td>{a.bio}</td>
              <td>
                {a.profile_image_url ? (
                  <img
                    src={a.profile_image_url}
                    alt={a.name}
                    width="60"
                    height="60"
                    style={{ borderRadius: "8px" }}
                  />
                ) : (
                  "Aucune image"
                )}
              </td>
              <td>
                {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---- MODULE PHOTO ---- */}
      <div className="photo-container">
        {/* --- Galerie à gauche --- */}
        <div className="gallery-section">
          <h4>🎨 Capture ton œuvre</h4>

          {photos.length === 0 ? (
            <p>Aucune photo capturée pour le moment.</p>
          ) : (
            photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`photo ${index + 1}`}
                className="captured-image"
              />
            ))
          )}
        </div>

        {/* --- Caméra à droite --- */}
        <div className="camera-section">
          <h4>📸 Prendre une photo</h4>

          {isCameraOn ? (
            <video ref={videoRef} width="320" height="240" autoPlay muted />
          ) : (
            <p>🎥 Caméra non activée</p>
          )}

          <div className="camera-buttons">
            {!isCameraOn && (
              <button type="button" onClick={startCamera}>
                Activer la caméra
              </button>
            )}
            {isCameraOn && (
              <button type="button" onClick={takePhoto}>
                Prendre une photo
              </button>
            )}
            {photos.length > 0 && (
              <button type="button" onClick={clearPhotos}>
                🗑️ Supprimer toutes les photos
              </button>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width="320"
            height="240"
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
