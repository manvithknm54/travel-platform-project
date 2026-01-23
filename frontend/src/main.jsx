import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
