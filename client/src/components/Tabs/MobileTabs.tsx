import { useState } from "react";
import tabsData, { TabData } from "../../data/TabsData.tsx";
import "./MobileTabs.css";
import Modal from "./Modal.tsx";

function MobileTabs() {
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);

  return (
    <div className="mobile-tabs">
      {tabsData.map((tab: TabData) => (
        <button
          key={tab.id}
          type="button"
          className="mobile-tab-btn"
          onClick={() => setSelectedTabId(tab.id)}
          aria-label={`Ouvrir ${tab.title || "un onglet"}`}
        >
          <img src={tab.icon} alt={tab.title || "Icône"} />
        </button>
      ))}

      {selectedTabId !== null && (
        <Modal tabId={selectedTabId} onClose={() => setSelectedTabId(null)} />
      )}
    </div>
  );
}

export default MobileTabs;
