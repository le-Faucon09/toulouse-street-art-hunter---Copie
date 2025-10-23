import { useEffect, useRef, useState } from "react";

type Artist = {
  id: number;
  name: string;
  bio: string;
  profile_image_url: string;
  created_at?: Date;
};

export default function TabArtist() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Camera ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/artist`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);
        setLoading(false);
      });
  }, []);

  // --- Active la caméra ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erreur d’accès à la caméra :", err);
      alert("Impossible d'accéder à la caméra. Vérifie les permissions.");
    }
  };

  // --- Capture une photo ---
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const image = canvasRef.current.toDataURL("image/png");
      setPhotoTaken(image);
    }
  };

  if (loading) return <p>Chargement des artistes en cours...</p>;

  return (
    <div>
      <h3>Les artistes de Street Art Hunter</h3>

      {/* ---- TABLEAU DES ARTISTES ---- */}
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
      <div style={{ marginTop: "2rem" }}>
        <h4>📸 Ajouter une photo d’artiste</h4>

        {!photoTaken ? (
          <>
            <video ref={videoRef} width="320" height="240" autoPlay muted />
            <div style={{ marginTop: "10px" }}>
              <button type="button" onClick={startCamera}>
                Activer la caméra
              </button>
              <button type="button" onClick={takePhoto}>
                Prendre une photo
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width="320"
              height="240"
              style={{ display: "none" }}
            />
          </>
        ) : (
          <>
            <img
              src={photoTaken}
              alt="Photo capturée"
              width="320"
              height="240"
            />
            <div>
              <button type="button" onClick={() => setPhotoTaken(null)}>
                Reprendre une photo
              </button>
              {/* TODO : ici tu pourras envoyer la photo au serveur */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

