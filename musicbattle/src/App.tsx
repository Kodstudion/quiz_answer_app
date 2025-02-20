import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import TeamPage from "./TeamPage";
import AdminPage from "./AdminPage"; // ✅ Lägg till import för AdminPage

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team/:teamName" element={<TeamPage />} />
      <Route path="/admin" element={<AdminPage />} /> {/* ✅ Uppdaterad för att använda AdminPage */}
    </Routes>
  );
};

export default App;