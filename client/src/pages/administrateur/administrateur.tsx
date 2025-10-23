import "./administrateur.css";
// import "../assets/styles/global.css";
import DesktopTabs from "../../components/Tabs/DesktopTabs.tsx";
import MobileTabs from "../../components/Tabs/MobileTabs.tsx";

export default function Administrateur() {
  return (
    <main className="administrator-container">
      <h2>Administrateur</h2>
      {/* Version mobile */}
      <div className="mobile-only">
      <MobileTabs />
      </div>
      
      {/* Version desktop*/}
      <div className="desktop-only">
      <DesktopTabs />
      </div>
    </main>
  );
}
