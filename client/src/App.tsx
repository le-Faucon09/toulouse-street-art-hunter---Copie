import "./assets/styles/global.css";
import { Outlet } from "react-router";
import Footer from "./components/Footer/Footer.tsx";
import Navigation from "./components/Navigation.tsx";

function App() {
  return (
    <>
      <Navigation />

      <Outlet />

      <Footer />
    </>
  );
}

export default App;
