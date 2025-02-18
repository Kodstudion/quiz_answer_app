import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
        🎵 Välkommen till Musikkampen 🎵
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xs sm:max-w-md">
        {["Lag A", "Lag B", "Lag C", "Lag D"].map((team, index) => (
          <button
            key={index}
            onClick={() => navigate(`/team/${team.toLowerCase()}`)}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-4 rounded-2xl text-xl font-semibold w-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
          >
            {team}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate("/admin")}
        className="mt-8 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-4 rounded-2xl text-xl font-semibold w-full max-w-xs sm:max-w-md shadow-lg hover:scale-105 hover:from-red-600 hover:to-red-800 transition-all duration-200"
      >
        🔧 Admin
      </button>
    </div>
  );
};

export default Home;
