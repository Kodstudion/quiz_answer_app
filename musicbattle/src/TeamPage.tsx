import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VersionInfo from "./VersionInfo";

const teamColors: { [key: string]: { color: string; pressedColor: string } } = {
  red: { color: "from-red-500 to-red-700", pressedColor: "from-red-700 to-red-900" },
  blue: { color: "from-blue-500 to-blue-700", pressedColor: "from-blue-700 to-blue-900" },
  yellow: { color: "from-yellow-400 to-yellow-600", pressedColor: "from-yellow-600 to-yellow-800" },
  orange: { color: "from-orange-500 to-orange-700", pressedColor: "from-orange-700 to-orange-900" },
  purple: { color: "from-purple-500 to-purple-700", pressedColor: "from-purple-700 to-purple-900" },
  green: { color: "from-green-500 to-green-700", pressedColor: "from-green-700 to-green-900" },
  pink: { color: "from-pink-500 to-pink-700", pressedColor: "from-pink-700 to-pink-900" },
  lightblue: { color: "from-cyan-500 to-cyan-700", pressedColor: "from-cyan-700 to-cyan-900" },
};

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamName } = useParams<{ teamName: string }>();
  const [gameId, setGameId] = useState<string>("");
  const [isGameIdValid, setIsGameIdValid] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const team = teamName?.toLowerCase() || "red";
  const teamStyle = teamColors[team] || teamColors.red;

  const handleGameIdSubmit = () => {
    if (gameId.trim() !== "") {
      setIsGameIdValid(true);
    }
  };

  const handleButtonPress = () => {
    if (!isPressed) {
      setIsPressed(true);
      console.log(`Lag ${teamName} tryckte på knappen!`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      
      {/* Tillbaka-knapp */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm shadow-md"
      >
        ⬅ Till start
      </button>

      <h1 className="text-4xl font-extrabold mb-6 text-center">
        🎵 {teamName?.toUpperCase()} Lag 🎵
      </h1>

      {!isGameIdValid ? (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">Skriv in spel-ID för att ansluta:</p>
          <input 
            type="text" 
            value={gameId} 
            onChange={(e) => setGameId(e.target.value)}
            className="border border-gray-400 rounded-lg px-4 py-2 text-center"
          />
          <button 
            onClick={handleGameIdSubmit}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
          >
            ✔ Anslut till spel
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-6">Vänta på att admin aktiverar knapparna...</p>

          {/* 🆕 Snygg röd knapp för att svara */}
          <button
            onClick={handleButtonPress}
            disabled={isPressed}
            className={`w-32 h-32 rounded-full shadow-lg border-4 border-gray-300 
            transition-all duration-300 transform hover:scale-110 
            bg-gradient-to-b ${isPressed ? teamStyle.pressedColor : teamStyle.color} ${
                isPressed ? "cursor-not-allowed opacity-50" : ""
            }`}
            />

          {isPressed && (
            <p className="mt-4 text-lg font-semibold text-gray-700">✔ Tryck registrerat!</p>
          )}
        </div>
      )}

      <VersionInfo />
    </div>
  );
};

export default TeamPage;