import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";
import "./src/index.css";
import { AuthProvider } from "./src/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
