import React, { useState, useEffect } from "react";
import { ref, set, push, remove, onValue, get } from "firebase/database";
import { database } from "./firebaseConfig";
import VersionInfo from "./VersionInfo";
import { teams } from "./constants/teamConfig";
import TeamButton from "./components/TeamButton";
import BackToHomeButton from "./components/BackHomeButton";
import CreateGameButton from "./components/CreateGameButton";
import EndGameButton from "./components/EndGameButton";
import ButtonModeSelector from "./components/ButtonModeSelector";
import ClickHistory from "./components/ClickHistory";
import ClearClickHistoryButton from "./components/ClearClickHistoryButton";
import Logo from "./assets/uadj_01_fixed.png";
type ButtonMode = "inactive" | "single-press" | "multi-press";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const AdminPage: React.FC = () => {
  const [gameId, setGameId] = useState<number | null>(null);
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [pressedTeams, setPressedTeams] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    checkForActiveGame();
  });

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

  const handleButtonPress = (team: string) => {
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
      {/* Hem knapp längst upp till vänster*/}
      <BackToHomeButton />

      {/* Loggan högst upp till höger*/}
      <img
        src={Logo}
        alt="Musikkampen Logo"
        className="w-20 mb-6 absolute top-4 right-4"
      />

      {/* Visa aktivt spel-ID om det finns ett aktivt spel*/}
      {gameId && (
        <div className="mb-4 text-xl font-semibold bg-white p-4 rounded-lg shadow-md">
          🏆 Aktivt spel-ID: <span className="text-blue-600">{gameId}</span>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {/* Visa knapp för att skapa spel det inte finns ett aktivt spel*/}
        {!gameId && <CreateGameButton onCreateGame={createNewGame} />}

        {/* Visa knapp för att avsluta spel det finns ett aktivt spel*/}
        {gameId && <EndGameButton gameId={gameId} onEndGame={endGame} />}
      </div>

      {/* Lagknappar för admin att testa med*/}
      <div className="grid grid-cols-4 gap-4">
        {teams.map(
          ({ name, displayName, teamButtonColor, teamButtonPressedColor }) => (
            <TeamButton
              key={name}
              isPressed={pressedTeams[name]}
              buttonMode={buttonMode}
              teamButtonColor={teamButtonColor}
              teamButtonPressedColor={teamButtonPressedColor}
              onClick={handleButtonPress}
              teamName={displayName}
              width="w-20"
              height="h-20"
            />
          )
        )}
      </div>

      {/* Styr lagknapparnas funktion */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <span className="text-lg font-semibold">🕹️ Styr lagens knappar:</span>
        <ButtonModeSelector
          currentMode={buttonMode}
          onChange={updateButtonMode}
        />
      </div>

      {/* Knapp för att rensa historiken */}
      <ClearClickHistoryButton onClear={clearClickHistory} />

      {/* Visa historik över klick*/}
      <ClickHistory clicks={clicks} />

      <VersionInfo />
    </div>
  );
};

export default AdminPage;
