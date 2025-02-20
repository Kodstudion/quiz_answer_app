import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VersionInfo from "./VersionInfo";

const validGameIds = ["1234", "5678", "91011"];

const teamColors: Record<string, string> = {
  red: "bg-red-600 hover:bg-red-700 text-white",
  blue: "bg-blue-600 hover:bg-blue-700 text-white",
  yellow: "bg-yellow-500 hover:bg-yellow-600 text-black",
  orange: "bg-orange-500 hover:bg-orange-600 text-black",
  purple: "bg-purple-600 hover:bg-purple-700 text-white",
  green: "bg-green-600 hover:bg-green-700 text-white",
  pink: "bg-pink-500 hover:bg-pink-600 text-black",
  lightblue: "bg-cyan-500 hover:bg-cyan-600 text-black",
};

const TeamPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [clicks, setClicks] = useState<string[]>([]);

  const verifyGameId = () => {
    if (validGameIds.includes(gameId)) {
      setIsVerified(true);
    } else {
      alert("Felaktigt spelomgångs-ID, försök igen.");
    }
  };

  const handleButtonClick = () => {
    const timestamp = new Date().toLocaleTimeString();
    setClicks((prev) => [...prev, `${teamName?.toUpperCase()} tryckte kl. ${timestamp}`]);
  };

  const bgColor = teamColors[teamName?.toLowerCase() || ""] || "bg-gray-600 text-white";

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      
      {/* Tillbaka-knapp (ljusgrå) */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm shadow-md"
      >
        ⬅ Till start
      </button>

      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold mb-8">{teamName?.toUpperCase()}</h1>

        {!isVerified ? (
          <div className="flex flex-col justify-center items-center gap-6">
            <p className="text-xl">Ange spelomgångens ID:</p>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="px-4 py-2 rounded-lg text-gray-900 text-center text-xl w-3/4 max-w-sm border border-gray-400"
              placeholder="Skriv in ID"
            />
            <button
              onClick={verifyGameId}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
            >
              Verifiera
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="text-2xl font-semibold">✅ Spelomgångens ID verifierat!</p>

            <button
              onClick={handleButtonClick}
              className={`px-8 py-6 text-2xl font-bold rounded-xl shadow-lg transition transform hover:scale-105 ${bgColor}`}
            >
              🔴 TRYCK
            </button>

            {/* Tryckhistorik */}
            <div className="mt-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-2">Tryckhistorik</h2>
              <table className="w-full bg-gray-200 text-black rounded-lg border border-gray-400">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="py-2">Tid</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.length > 0 ? (
                    clicks.map((click, index) => (
                      <tr key={index} className="border-t border-gray-400">
                        <td className="py-2 text-center">{click}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 text-center text-gray-600">Inga tryck registrerade än</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Knapp för att skriva in nytt ID (ljusgrå) */}
            <button 
              onClick={() => setIsVerified(false)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm shadow-md"
            >
              🔄 Nytt spel-ID
            </button>

          </div>
        )}
      </div>
      <VersionInfo /> {/* ✅ Flyttad utanför div-containern */}
    </div>
  );
};

export default TeamPage;