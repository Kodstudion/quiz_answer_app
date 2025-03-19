import React, { useState, useEffect } from "react";
import { ref, set, push, onValue } from "firebase/database";
import { database } from "./firebaseConfig";
import VersionInfo from "./VersionInfo";
import { teams } from "./constants/teamConfig";
import TeamButton from "./components/TeamButton";
import BackToHomeButton from "./components/BackHomeButton";
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
  //const [gameId, setGameId] = useState<number | null>(null);
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [pressedTeams, setPressedTeams] = useState<{ [key: string]: boolean }>(
    {}
  );

  const clearClickHistory = () => {
    set(ref(database, `clicks`), {});
    setClicks([]);
    // Återaktivera alla knappar för engångstryck
    if (buttonMode === "single-press") {
      setPressedTeams({});
    }
  };
  const updateButtonMode = (mode: ButtonMode) => {
    set(ref(database, `buttonMode`), mode);
    setButtonMode(mode);
    setPressedTeams({});
  };

  const handleButtonPress = (team: string) => {
    if (buttonMode === "inactive") return;
    if (buttonMode === "single-press" && pressedTeams[team]) return;

    const clickRef = ref(database, `clicks`);
    push(clickRef, {
      team,
      timestamp: new Date().toISOString(),
    });

    if (buttonMode === "single-press") {
      setPressedTeams((prev) => ({ ...prev, [team]: true }));
    }
  };

  const listenForClicks = () => {
    const clicksRef = ref(database, `clicks`);
    onValue(clicksRef, (snapshot) => {
      const data = snapshot.val();
      const clicksData = data ? (Object.values(data) as ClickEntry[]) : [];
      setClicks(clicksData);
    });
  };

  useEffect(() => {
    listenForClicks();
    return () => {
      // Här kan du lägga till kod för att ta bort lyssnare om det behövs
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      {/* Header-sektion */}
      <div className="flex justify-between items-center mb-4">
        <BackToHomeButton />
        <img src={Logo} alt="Musikkampen Logo" className="w-20 ml-auto" />
      </div>

      {/* Lagknappar för admin att testa med*/}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {teams.map(
            ({
              name,
              displayName,
              teamButtonColor,
              teamButtonPressedColor,
            }) => (
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
    </div>
  );
};

export default AdminPage;
