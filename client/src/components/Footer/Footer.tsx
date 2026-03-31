import { Link } from "react-router";

import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {year} Street Art Hunter – Tous droits réservés</p>
      <ul className="footer-links">
        <li>
          <Link to="/mentions-legales">Mentions légales</Link>
        </li>
        <li>
          <Link to="/cgu">CGU</Link>
        </li>
        <li>
          <Link to="/equipe">L'équipe</Link>
        </li>
      </ul>
    </footer>
  );
}