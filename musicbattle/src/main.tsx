import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Kolla om vi kör på GitHub Pages
const isGitHubPages = import.meta.env.MODE === "production";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={isGitHubPages ? "/quiz_answer_app" : "/"}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
