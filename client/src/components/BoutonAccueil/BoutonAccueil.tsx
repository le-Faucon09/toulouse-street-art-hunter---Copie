import { useNavigate } from "react-router";

export default function BoutonAccueil() {
  const navigate = useNavigate();

  function handleclick() {
    navigate("/");
  }
  return (
    <button onClick={handleclick} type="button">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" />
      </svg>
    </button>
  );
}