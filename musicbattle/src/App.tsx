import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import TeamPage from "./TeamPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team/:teamName" element={<TeamPage />} />
      <Route path="/admin" element={<h2>Admin Sida</h2>} />
    </Routes>
  );
};

export default App;