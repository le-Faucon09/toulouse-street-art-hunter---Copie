import { useState } from "react";
import { useNavigate } from "react-router";
import "./Accueil.css";

function Accueil() {
const [started, setStarted] = useState(false);
const [fade, setFade] = useState(false);
const navigate = useNavigate();

  function handleClick() {
    setStarted(true);
    setFade(true);
    setTimeout(() => {
      navigate("/chasse");
    }, 800)

    setTimeout(() => {
      navigate("/chasse");
    }, 4000);
  };

  return (
    <main className={`accueil-container ${fade ? "fade-out" : ""}`}>
      <h1>STREET ART HUNTER</h1>
      {!started ? (
      <button className="btn-start bounce" onClick={handleClick} type="button">
        DEMARRER
      </button>
      ) : (
        <p className="welcome-message">Bienvenue ! prêt à explorer le street art 🎨</p>
      )}
    </main>
  );
}

export default Accueil;
