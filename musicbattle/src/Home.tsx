import React from "react";
import { useNavigate } from "react-router-dom";

const teams = [
  { name: "Red", color: "bg-red-600 hover:bg-red-700" },
  { name: "Blue", color: "bg-blue-600 hover:bg-blue-700" },
  { name: "Yellow", color: "bg-yellow-500 hover:bg-yellow-600" },
  { name: "Orange", color: "bg-orange-500 hover:bg-orange-600" },
  { name: "Purple", color: "bg-purple-600 hover:bg-purple-700" },
  { name: "Green", color: "bg-green-600 hover:bg-green-700" },
  { name: "Pink", color: "bg-pink-500 hover:bg-pink-600" },
  { name: "LightBlue", color: "bg-cyan-500 hover:bg-cyan-600" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        🎵 Välkommen till <span className="text-yellow-400">Musikkampen</span> 🎵
      </h1>

      {/* Lagrutor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        {teams.map(({ name, color }) => (
          <button
            key={name}
            onClick={() => navigate(`/team/${name.toLowerCase()}`)}
            className={`${color} text-white px-8 py-4 rounded-2xl text-xl font-semibold w-full shadow-md transform transition duration-300 hover:scale-105`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Admin-knapp */}
      <button
        onClick={() => navigate("/admin")}
        className="mt-10 bg-gray-700 text-white px-8 py-4 rounded-2xl text-xl font-semibold w-full max-w-xl shadow-md transform transition duration-300 hover:bg-gray-800 hover:scale-105"
      >
        🔧 Admin
      </button>
    </div>
  );
};

export default Home;