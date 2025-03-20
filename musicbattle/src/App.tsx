import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team/:teamName" element={<TeamPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={user ? <AdminPage /> : <Navigate to="/login" />}
      />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};

export default App;
