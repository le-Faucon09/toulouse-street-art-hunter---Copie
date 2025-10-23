import "./assets/styles/global.css";
import { Outlet } from "react-router";
import Footer from "./components/FooterComponent.tsx";
import Navigation from "./components/navigation.tsx";

function App() {
  return (
    <>
        <Navigation/>

        <Outlet />

        <Footer />
    </>
  );
}

export default App;

