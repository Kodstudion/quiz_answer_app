import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, set, push, remove, onValue, get } from "firebase/database";
import { database } from "./firebaseConfig";
import VersionInfo from "./VersionInfo";
import { teams } from "./constants/teamConfig";

type ButtonMode = "inactive" | "single-press" | "multi-press";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<number | null>(null);
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [pressedTeams, setPressedTeams] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    checkForActiveGame();
  }, []);

  const checkForActiveGame = async () => {
    const gamesRef = ref(database, "games");
    const snapshot = await get(gamesRef);
    if (snapshot.exists()) {
      const games = snapshot.val();
      const activeGameId = Object.keys(games)[0];
      setGameId(Number(activeGameId));
      setButtonMode(games[activeGameId].buttonMode || "inactive");
      listenForClicks(Number(activeGameId));
    }
  };

  const createNewGame = () => {
    if (gameId !== null) {
      alert(
        `Det finns redan en aktiv spelomgång med ID ${gameId}. Avsluta den innan du skapar en ny.`
      );
      return;
    }

    const newId = Math.floor(Math.random() * 9) + 1;
    setGameId(newId);
    setButtonMode("inactive");
    set(ref(database, `games/${newId}`), {
      buttonMode: "inactive",
      clicks: {},
    });
  };

  const endGame = () => {
    if (gameId !== null) {
      const confirmEnd = window.confirm(
        `Är du säker på att du vill avsluta spelomgång ${gameId}?`
      );
      if (confirmEnd) {
        clearGameData(gameId);
        setGameId(null);
        setButtonMode("inactive");
        setClicks([]);
        setPressedTeams({});
      }
    }
  };

  const clearGameData = (id: number) => {
    remove(ref(database, `games/${id}`));
  };

  const clearClickHistory = () => {
    if (gameId !== null) {
      set(ref(database, `games/${gameId}/clicks`), {});
      setClicks([]);
      // Återaktivera alla knappar för engångstryck
      if (buttonMode === "single-press") {
        setPressedTeams({});
      }
    }
  };
  const updateButtonMode = (mode: ButtonMode) => {
    if (gameId !== null) {
      set(ref(database, `games/${gameId}/buttonMode`), mode);
      setButtonMode(mode);
      setPressedTeams({});
    }
  };

  const handleTeamPress = (team: string) => {
    if (buttonMode === "inactive") return;
    if (buttonMode === "single-press" && pressedTeams[team]) return;

    const clickRef = ref(database, `games/${gameId}/clicks`);
    push(clickRef, {
      team,
      timestamp: new Date().toISOString(),
    });

    if (buttonMode === "single-press") {
      setPressedTeams((prev) => ({ ...prev, [team]: true }));
    }
  };

  const listenForClicks = (id: number) => {
    const clicksRef = ref(database, `games/${id}/clicks`);
    onValue(clicksRef, (snapshot) => {
      const data = snapshot.val();
      const clicksData = data ? (Object.values(data) as ClickEntry[]) : [];
      setClicks(clicksData);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm shadow-md"
      >
        ⬅ Till start
      </button>

      {gameId && (
        <div className="mb-4 text-xl font-semibold bg-white p-4 rounded-lg shadow-md">
          🏆 Aktivt spel-ID: <span className="text-blue-600">{gameId}</span>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {!gameId && (
          <button
            onClick={createNewGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
          >
            🎲 Skapa ny spelomgång
          </button>
        )}

        {gameId && (
          <button
            onClick={endGame}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
          >
            🛑 Avsluta spel
          </button>
        )}
      </div>

      {/* Lagknappar */}
      <div className="grid grid-cols-4 gap-4">
        {teams.map(
          ({ name, displayName, teamButtonColor, teamButtonPressedColor }) => (
            <button
              key={name}
              onClick={() => handleTeamPress(displayName)}
              className={`w-20 h-20 rounded-full shadow-lg border-4 border-gray-300 transition-all duration-300 transform hover:scale-110 bg-gradient-to-b ${
                buttonMode === "single-press" && pressedTeams[name]
                  ? teamButtonPressedColor
                  : teamButtonColor
              }`}
            />
          )
        )}
      </div>

      {/* Styr knappfunktioner */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <span className="text-lg font-semibold">🕹️ Styr lagens knappar:</span>
        <div className="flex flex-col items-start">
          {["inactive", "single-press", "multi-press"].map((mode) => (
            <label key={mode} className="inline-flex items-center space-x-2">
              <input
                type="radio"
                value={mode}
                checked={buttonMode === mode}
                onChange={() => updateButtonMode(mode as ButtonMode)}
                className="form-radio text-blue-600"
              />
              <span>
                {mode === "inactive"
                  ? "🚫 Inaktiv"
                  : mode === "single-press"
                  ? "✅ Engångstryck"
                  : "🔄 Flera tryck"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={clearClickHistory}
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
      >
        🗑️ Rensa knapphistorik
      </button>

      {/* Tryckhistorik */}
      <div className="mt-10 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-center">
          📋 Tryckhistorik
        </h2>
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
                  <td className="py-2 px-4">
                    {new Date(click.timestamp).toLocaleTimeString()}
                  </td>
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
