import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react"; // Importerar ikonbiblioteket för kugghjul

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
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      
      {/* Admin-knapp (kugghjul i övre vänstra hörnet) */}
      <button 
        onClick={() => navigate("/admin")}
        className="absolute top-4 left-4 p-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md transition duration-300"
      >
        <Settings className="w-6 h-6 text-black" />
      </button>

      {/* Titel och instruktion */}
      <h1 className="text-4xl font-extrabold mb-4 text-center tracking-wide">
        🎵 Välkommen till <span className="text-blue-600">Musikkampen</span> 🎵
      </h1>
      <p className="text-lg text-center mb-6">Välj ditt lags ballongfärg för att börja spela!</p>

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
    </div>
  );
};

export default Home;
