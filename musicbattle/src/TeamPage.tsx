import React, { useState } from "react";
import { useParams } from "react-router-dom";

const validGameIds = ["1234", "5678", "91011"]; 

const TeamPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [gameId, setGameId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [clicks, setClicks] = useState<string[]>([]);

  const verifyGameId = () => {
    if (validGameIds.includes(gameId)) {
      setIsVerified(true);
    } else {
      alert("Felaktigt spelomgångs-ID, försök igen.");
    }
  };

  const handleButtonClick = () => {
    if (isButtonEnabled) {
      const timestamp = new Date().toLocaleTimeString();
      setClicks((prev) => [...prev, `${teamName?.toUpperCase()} tryckte kl. ${timestamp}`]);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col justify-center items-center w-full max-w-lg">
        <h1 className="text-4xl font-extrabold mb-8">{teamName?.toUpperCase()}</h1>

        {!isVerified ? (
          <div className="flex flex-col justify-center items-center w-full">
            <p className="text-xl mb-4">Ange spelomgångens ID:</p>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="px-4 py-2 rounded-lg text-gray-900 text-center text-xl w-3/4 max-w-sm"
              placeholder="Skriv in ID"
            />
            <button
              onClick={verifyGameId}
              className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              Verifiera
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full">
            <p className="text-2xl font-semibold mb-6">✅ Spelomgångens ID verifierat!</p>

            <button
              onClick={handleButtonClick}
              className={`px-8 py-6 text-2xl font-bold rounded-xl shadow-lg transition ${
                isButtonEnabled ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!isButtonEnabled}
            >
              🔴 TRYCK
            </button>

            {/* Tryckhistorik */}
            <div className="mt-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-2">Tryckhistorik</h2>
              <table className="w-full bg-gray-800 text-white rounded-lg border border-gray-700">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2">Tid</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.length > 0 ? (
                    clicks.map((click, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="py-2 text-center">{click}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 text-center text-gray-400">Inga tryck registrerade än</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;