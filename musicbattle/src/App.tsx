import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team/:teamName" element={<h2>Team Sida</h2>} />
      <Route path="/admin" element={<h2>Admin Sida</h2>} />
    </Routes>
  );
};

export default App;
