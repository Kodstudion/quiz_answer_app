import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VersionInfo from "./VersionInfo";

interface ClickEntry {
  team: string;
  time: string;
}

const teams = [
  { name: "Red", color: "from-red-500 to-red-700", pressedColor: "from-red-700 to-red-900" },
  { name: "Blue", color: "from-blue-500 to-blue-700", pressedColor: "from-blue-700 to-blue-900" },
  { name: "Yellow", color: "from-yellow-400 to-yellow-600", pressedColor: "from-yellow-600 to-yellow-800" },
  { name: "Orange", color: "from-orange-500 to-orange-700", pressedColor: "from-orange-700 to-orange-900" },
  { name: "Purple", color: "from-purple-500 to-purple-700", pressedColor: "from-purple-700 to-purple-900" },
  { name: "Green", color: "from-green-500 to-green-700", pressedColor: "from-green-700 to-green-900" },
  { name: "Pink", color: "from-pink-500 to-pink-700", pressedColor: "from-pink-700 to-pink-900" },
  { name: "LightBlue", color: "from-cyan-500 to-cyan-700", pressedColor: "from-cyan-700 to-cyan-900" },
];

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<number | null>(null);
  const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(true);
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [pressedTeams, setPressedTeams] = useState<{ [key: string]: boolean }>({});

  // Funktion för att skapa en ny spelomgång
  const createNewGame = () => {
    if (gameId !== null) {
      const confirmNewGame = window.confirm(
        `Det finns redan en aktiv spelomgång med ID ${gameId}. Vill du verkligen ta bort den och skapa en ny?`
      );
      if (!confirmNewGame) return;
    }

    const newId = Math.floor(Math.random() * 9) + 1;
    setGameId(newId);
    setClicks([]);
    setPressedTeams({});
  };

  // Funktion för att avsluta spelet
  const endGame = () => {
    if (gameId === null) return;

    const confirmEndGame = window.confirm(
      `Är du säker på att du vill avsluta spelomgång ${gameId}?`
    );
    if (confirmEndGame) {
      setGameId(null);
      setClicks([]);
      setPressedTeams({});
    }
  };

  // Funktion för att aktivera/inaktivera lagens knappar
  const toggleButtons = () => {
    setButtonsEnabled((prev) => !prev);
  };

  // Funktion för att registrera ett knapptryck
  const addClick = (team: string) => {
    if (pressedTeams[team]) return; // Om laget redan tryckt, gör inget

    const timestamp = new Date().toLocaleTimeString();
    setClicks((prev) => [...prev, { team, time: timestamp }]);
    setPressedTeams((prev) => ({ ...prev, [team]: true }));
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

      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        🔧 Admin Panel
      </h1>

      <p className="text-lg text-center mb-6">
        Här kan du hantera spelets omgångar och laginställningar.
      </p>

      {/* Visa aktivt spel-ID */}
      {gameId && (
        <div className="mb-4 text-xl font-semibold bg-white p-4 rounded-lg shadow-md">
          🏆 Aktivt spel-ID: <span className="text-blue-600">{gameId}</span>
        </div>
      )}

      {/* Rad med knappar för att skapa och avsluta spel */}
      <div className="flex gap-4">
        <button 
          onClick={createNewGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
        >
          🎲 Skapa ny spelomgång
        </button>

        {gameId && (
          <button 
            onClick={endGame}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
          >
            🛑 Avsluta spelet
          </button>
        )}
      </div>

      {/* Knapp för att aktivera/inaktivera lagens knappar */}
      <div className="mt-6">
        <button 
          onClick={toggleButtons}
          className={`px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition ${
            buttonsEnabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          {buttonsEnabled ? "✅ Svarsknappar AKTIVA" : "❌ Svarsknappar INAKTIVA"}
        </button>
      </div>

      {/* 🆕 Snygga runda lagknappar */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {teams.map(({ name, color, pressedColor }) => (
          <button
            key={name}
            onClick={() => addClick(name)}
            className={`w-20 h-20 rounded-full shadow-lg border-4 border-gray-300 
            transition-all duration-300 transform hover:scale-110 
            bg-gradient-to-b ${pressedTeams[name] ? pressedColor : color}`}
          />
        ))}
      </div>

      {/* 🆕 Återställer tabellen under knapparna */}
      <div className="mt-10 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-center">📋 Tryckhistorik</h2>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-2 px-4 text-left">Lag</th>
              <th className="py-2 px-4 text-left">Tidpunkt</th>
            </tr>
          </thead>
          <tbody>
            {clicks.length > 0 ? (
              clicks.map((click, index) => (
                <tr key={index} className="border-t border-gray-300">
                  <td className="py-2 px-4">{click.team}</td>
                  <td className="py-2 px-4">{click.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-2 px-4 text-center text-gray-500">
                  Inga tryck registrerade än
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VersionInfo />
    </div>
  );
};

export default AdminPage;
