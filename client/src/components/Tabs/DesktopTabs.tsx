import { useState } from "react";
import tabsData, {TabData} from "../../data/tabsData.tsx";
import "./DesktopTabs.css";
import Modal from "./Modal.tsx";

function DesktopTabs() {
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);

  return (
    <div className="desktop-tabs">
      {tabsData.map((tab: TabData) => (
        <button
          key={tab.id}
          type="button"
          className={`desktop-tab-btn ${selectedTabId === tab.id ? "active" : ""}`}
          onClick={() => setSelectedTabId(tab.id)}
          aria-label={`Ouvrir ${tab.title}`}
        >
          <div>
            <img src={tab.icon} alt={tab.title} />
            <span>{tab.title}</span>
          </div>
        </button>
      ))}
      
      {selectedTabId !== null && (
        <Modal tabId={selectedTabId} onClose={() => setSelectedTabId(null)} />
      )}
    </div>
  );
}

export default DesktopTabs;
