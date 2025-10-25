import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import BoutonAccueil from "./boutonAccueil.tsx";
// import "../assets/styles/burger.css";
import "./navigation.css";

function Navigation() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [fermeture, setFermeture] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fermetureAvecAnimation = () => {
      if (!menuOuvert || fermeture) return;

      setFermeture(true);
      setMenuOuvert(false);
      setFermeture(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        fermetureAvecAnimation();
      }
    };
    if (menuOuvert) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOuvert, fermeture]);

  useEffect(() => {
    const fermetureAvecAnimation = () => {
      if (!menuOuvert || fermeture) return;

      setFermeture(true);
      setMenuOuvert(false);
      setFermeture(false);
    };

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        fermetureAvecAnimation();
      }
    }
    if (menuOuvert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOuvert, fermeture]);

  return (
    <>
      <nav className="menu-nav" ref={menuRef}>
        <BoutonAccueil />
        {menuOuvert && (
          <ul className="liens">
            <li>
              <Link to={"/connexion"}>connexion</Link>
            </li>
            <li>
              <Link to={"/inscription"}>inscription</Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setFermeture(true);
                  setMenuOuvert(false);
                }}
                to="/gallerie"
              >
                Galleries
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setFermeture(true);
                  setMenuOuvert(false);
                }}
                to="/carte"
              >
                Cartes
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setFermeture(true);
                  setMenuOuvert(false);
                }}
                to="/instructions"
              >
                Instructions
              </Link>
              /
              <Link
                onClick={() => {
                  setFermeture(true);
                  setMenuOuvert(false);
                }}
                to="/infos"
              >
              informations
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setFermeture(true);
                  setMenuOuvert(false);
                }}
                to="/classement"
              >
                Classement
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setFermeture(true);
                  setMenuOuvert(false);
                }}
                to="/administrateur"
              >
                Administrateur
              </Link>
            </li>
          </ul>
        )}
        <button
          ref={btnRef}
          type="button"
          className="floating-btn"
          onClick={() => setMenuOuvert((prev) => !prev)}
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32m0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32m448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32"
            />
          </svg>
        </button>
      </nav>
    </>
  );
}

export default Navigation;
