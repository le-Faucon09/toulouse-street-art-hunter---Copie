import art from "../assets/icon/art.png";
import hunt from "../assets/icon/hunt.png";
import peintre from "../assets/icon/peintre.png";
import reporting from "../assets/icon/reporting.png";
import users from "../assets/icon/users.png";

export interface TabData {
  id: number;
  title: string;
  icon: string;
}

const tabsData: TabData[] = [
  {
    title: "Artistes",
    id: 1,
    icon: peintre,
  },
  {
    title: "Utilisateurs",
    id: 2,
    icon: users,
  },
  {
    title: "Oeuvres/Artistes",
    id: 3,
    icon: art,
  },
  {
    title: "Chasse",
    id: 4,
    icon: hunt,
  },
  {
    title: "Signalement",
    id: 5,
    icon: reporting,
  },
];

export default tabsData;
