import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import "./profil.css";

type StoredUser = {
  id: number;
  email: string;
  pseudo: string;
};

type UserDetails = StoredUser & {
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  zip_code: number | null;
  created_at?: string;
  updated_at?: string;
};

export default function Profil() {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");

    if (rawUser == null) {
      navigate("/connexion", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as StoredUser;

      if (parsedUser == null || parsedUser.id == null) {
        throw new Error("Données utilisateur invalides");
      }

      setStoredUser(parsedUser);
    } catch (error) {
      console.error("Impossible de lire l'utilisateur en mémoire", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/connexion", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (storedUser == null) {
      return;
    }

    const controller = new AbortController();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    setIsLoading(true);
    setErrorMessage(null);

    fetch(`${apiUrl}/api/users/${storedUser.id}`, {
      method: "GET",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Impossible de récupérer le profil (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }
        const detailsCandidate = Array.isArray(data) ? data[0] : data;

        if (detailsCandidate == null) {
          setErrorMessage("Aucune information de profil supplémentaire à afficher pour le moment.");
          setUserDetails(null);
          return;
        }

        setUserDetails({
          ...storedUser,
          avatar_url: detailsCandidate.avatar_url ?? null,
          first_name: detailsCandidate.first_name ?? null,
          last_name: detailsCandidate.last_name ?? null,
          zip_code: detailsCandidate.zip_code ?? null,
          created_at: detailsCandidate.created_at ?? undefined,
          updated_at: detailsCandidate.updated_at ?? undefined,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }
        console.error(error);
        setErrorMessage(
          "Nous n'avons pas pu récupérer toutes tes informations pour le moment. Tu peux réessayer plus tard.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [storedUser]);

  const displayName = useMemo(() => {
    if (userDetails?.first_name || userDetails?.last_name) {
      return [userDetails.first_name, userDetails.last_name]
        .filter((value) => value != null && value.length > 0)
        .join(" ");
    }

    return storedUser?.pseudo ?? "Chasseur·se";
  }, [storedUser, userDetails]);

  const initials = useMemo(() => {
    const base = displayName || storedUser?.pseudo || "";

    return base
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("");
  }, [displayName, storedUser]);

  const formattedJoinDate = useMemo(() => {
    if (userDetails?.created_at == null) {
      return "Bientôt disponible";
    }

    const date = new Date(userDetails.created_at);

    if (Number.isNaN(date.getTime())) {
      return "Bientôt disponible";
    }

    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [userDetails]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/connexion", { replace: true });
  };

  return (
    <main className="profil-page">
      <section className="profil-card">
        <header className="profil-header">
          {userDetails?.avatar_url ? (
            <img
              src={userDetails.avatar_url}
              alt={`Avatar de ${displayName}`}
              className="profil-avatar"
            />
          ) : (
            <div aria-hidden className="profil-avatar profil-avatar--fallback">
              {initials || "SA"}
            </div>
          )}
          <div>
            <h1>Bonjour, {displayName} 👋</h1>
            <p className="profil-subtitle">
              Voici ton espace Street Art Hunter. Tout ce qui te concerne est regroupé ici.
            </p>
          </div>
        </header>

        <div className="profil-info-grid">
          <div className="profil-info-item">
            <span className="profil-info-label">Pseudo</span>
            <span className="profil-info-value">{storedUser?.pseudo}</span>
          </div>
          <div className="profil-info-item">
            <span className="profil-info-label">Adresse email</span>
            <span className="profil-info-value">{storedUser?.email}</span>
          </div>
          <div className="profil-info-item">
            <span className="profil-info-label">Code postal</span>
            <span className="profil-info-value">
              {userDetails?.zip_code != null ? userDetails.zip_code : "À compléter"}
            </span>
          </div>
          <div className="profil-info-item">
            <span className="profil-info-label">Membre depuis</span>
            <span className="profil-info-value">{formattedJoinDate}</span>
          </div>
        </div>

        {isLoading && (
          <p className="profil-status">Chargement de tes informations…</p>
        )}

        {errorMessage != null && (
          <div className="profil-alert" role="status">
            {errorMessage}
          </div>
        )}

        <div className="profil-actions">
          <button className="profil-action profil-action--primary" type="button">
            Modifier mon profil
          </button>
          <button
            className="profil-action profil-action--secondary"
            type="button"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </section>

      <section className="profil-secondary">
        <h2>Mon activité</h2>
        <div className="profil-secondary-grid">
          <article className="profil-secondary-card">
            <h3>Œuvres découvertes</h3>
            <p className="profil-secondary-value">Bientôt disponible</p>
            <p className="profil-secondary-desc">
              Continue tes explorations ! Nous te montrerons ici toutes les œuvres que tu as dénichées.
            </p>
          </article>
          <article className="profil-secondary-card">
            <h3>Classement</h3>
            <p className="profil-secondary-value">En construction</p>
            <p className="profil-secondary-desc">
              Les points gagnés lors de tes chasses apparaîtront ici dès que la fonctionnalité sera prête.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
