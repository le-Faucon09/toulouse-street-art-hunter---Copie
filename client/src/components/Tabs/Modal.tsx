import "./Modal.css";
import { createPortal } from "react-dom";
import tabsData from "../../data/tabsData";
import TabArtistContain from "./TabsContain/TabArtistContain";
import TabUserContain from "./TabsContain/TabUserContain";

export default function Modal({
  tabId,
  onClose,
}: {
  tabId: number | null;
  onClose: () => void;
}) {
  const tab = tabsData.find((obj) => obj.id === tabId);

  return createPortal(
    <dialog open className="modalBase">
      {tab && (
        <>
          <div className="tabTitle">{tab.title}</div>
          <div className="tabContainArray">
            {tab.title === "Utilisateurs" && <TabUserContain />}
            {tab.title === "Artistes" && <TabArtistContain />}
          </div>
        </>
      )}

      <button className="modalButton" onClick={onClose} type="button">
        Fermer
      </button>
    </dialog>,
    document.body,
  );
}
