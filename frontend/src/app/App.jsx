import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AppRoutes from "./routes";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("globetrooter_token");

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {token && !hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;
