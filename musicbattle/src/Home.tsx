import React from "react";
import { useNavigate } from "react-router-dom";

const teams = [
  { name: "Red", color: "bg-red-600 hover:bg-red-700 text-white" },
  { name: "Blue", color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { name: "Yellow", color: "bg-yellow-500 hover:bg-yellow-600 text-black" },
  { name: "Orange", color: "bg-orange-500 hover:bg-orange-600 text-black" },
  { name: "Purple", color: "bg-purple-600 hover:bg-purple-700 text-white" },
  { name: "Green", color: "bg-green-600 hover:bg-green-700 text-white" },
  { name: "Pink", color: "bg-pink-500 hover:bg-pink-600 text-black" },
  { name: "LightBlue", color: "bg-cyan-500 hover:bg-cyan-600 text-black" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        🎵 Välkommen till <span className="text-blue-600">Musikkampen</span> 🎵
      </h1>

      {/* Grid med 2 kolumner och 4 rader */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {teams.map(({ name, color }) => (
          <button
            key={name}
            onClick={() => navigate(`/team/${name.toLowerCase()}`)}
            className={`${color} px-6 py-3 rounded-2xl text-lg font-semibold w-full shadow-md transform transition duration-300 hover:scale-105`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Admin-knapp längst ner */}
      <button
        onClick={() => navigate("/admin")}
        className="mt-8 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-2xl text-lg font-semibold w-full max-w-md shadow-md transform transition duration-300 hover:scale-105"
      >
        🔧 Admin
      </button>
    </div>
  );
};

export default Home;