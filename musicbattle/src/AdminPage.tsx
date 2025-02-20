import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VersionInfo from "./VersionInfo";

interface ClickEntry {
  team: string;
  time: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<number | null>(null);
  const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(true);
  const [clicks, setClicks] = useState<ClickEntry[]>([]); // 🆕 Lista med tryckhistorik

  // Funktion för att skapa en ny spelomgång med bekräftelse
  const createNewGame = () => {
    if (gameId !== null) {
      const confirmNewGame = window.confirm(
        `Det finns redan en aktiv spelomgång med ID ${gameId}. Vill du verkligen ta bort den och skapa en ny?`
      );
      if (!confirmNewGame) return;
    }

    const newId = Math.floor(Math.random() * 9) + 1;
    setGameId(newId);
    setClicks([]); // 🆕 Nollställ tryckhistoriken vid nytt spel
  };

  // Funktion för att avsluta spelet med bekräftelse
  const endGame = () => {
    if (gameId === null) return;

    const confirmEndGame = window.confirm(
      `Är du säker på att du vill avsluta spelomgång ${gameId}?`
    );
    if (confirmEndGame) {
      setGameId(null);
      setClicks([]); // 🆕 Nollställ tryckhistoriken vid avslut
    }
  };

  // 🆕 Funktion för att aktivera/inaktivera lagens knappar
  const toggleButtons = () => {
    setButtonsEnabled((prev) => !prev);
  };

  // 🆕 Simulerad funktion för att lägga till knapptryckningar i listan
  const addClick = (team: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setClicks((prev) => [...prev, { team, time: timestamp }]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      
      {/* Tillbaka-knapp i övre vänstra hörnet */}
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

      {/* Visa det aktuella spel-ID:t om det finns */}
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

      {/* 🆕 Knapp för att aktivera/inaktivera lagens knappar */}
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

      {/* 🆕 Simulerade knapptryckningar (Testknappar, ska ersättas med Firebase senare) */}
      <div className="flex gap-2 mt-4">
        {["Red", "Blue", "Yellow", "Green"].map((team) => (
          <button 
            key={team}
            onClick={() => addClick(team)}
            className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded-lg text-sm shadow-md"
          >
            Simulera {team}-tryck
          </button>
        ))}
      </div>

      {/* 🆕 Tabell med tryckhistorik */}
      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">📋 Tryckhistorik</h2>
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

      <VersionInfo /> {/* ✅ Behåller versionsinfo längst ner */}
    </div>
  );
};

export default AdminPage;
