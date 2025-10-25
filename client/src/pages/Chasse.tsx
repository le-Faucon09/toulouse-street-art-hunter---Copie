import { useEffect, useRef, useState } from "react";
import "./Chasse.css";

export default function Chasse() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erreur d'accès à la caméra :", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
    };
  }, []);

  const savePhotoLocally = (photoData: string) => {
    const existingPhotos = JSON.parse(localStorage.getItem("galleryPhotos") || "[]");
    existingPhotos.push({
      photo: photoData,
      date: new Date().toISOString(),
      user: "user_3", 
    });
    localStorage.setItem("galleryPhotos", JSON.stringify(existingPhotos));
    
    // 🔔 avertit la galerie qu'une nouvelle photo a été ajoutée
    window.dispatchEvent(new Event("galleryUpdate"))
  };

 

  const sendPhotoToBackend = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("photo", blob, "capture.png");
      formData.append("userId", "3");
      formData.append("artworkId", "1");

      const response = await fetch("http://localhost:3310/api/discovered", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Erreur serveur: ${response.statusText}`);

      const data = await response.json();
      setUploadStatus("✅ Photo envoyée avec succès !");
      console.log("Réponse serveur :", data);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la photo :", error);
      setUploadStatus("❌ Erreur lors de l'envoi de la photo.");
    }
  };

  const capturePhoto = (): void => {
    if (!videoRef.current || !canvasRef.current) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    if (width === 0 || height === 0) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const photoUrl = URL.createObjectURL(blob);
          setPhoto(photoUrl);
          savePhotoLocally(photoUrl);
          sendPhotoToBackend(blob);
          // ⚡ effet flash
          setFlash(true);
          setTimeout(() => setFlash(false), 400);
        }
      }, "image/png");
    }
  };

  return (
    <div className="chasse-page">
      {flash && <div className="flash" />}

      <h1 className="chasse-title">📸 Capture ton œuvre !</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        tabIndex={-1}
        className="video-preview"
      >
        <track kind="captions" />
      </video>

      <button type="button" onClick={capturePhoto} className="capture-button">
        Prendre la photo
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photo && (
        <div className="photo-preview">
          <h2>Photo capturée :</h2>
          <img src={photo} alt="œuvre capturée" className="captured-image" />
        </div>
      )}

      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
    </div>
  );
}
