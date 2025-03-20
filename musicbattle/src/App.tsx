import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team/:teamName" element={<TeamPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};

export default App;
