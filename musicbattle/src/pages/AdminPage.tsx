import React, { useState, useEffect, useCallback } from "react";
import { ref, set, push, onValue } from "firebase/database";
import { database } from "../firebaseConfig";
import VersionInfo from "../components/VersionInfo";
import { teams } from "../constants/teamConfig";
import TeamButton from "../components/TeamButton";
import BackToHomeButton from "../components/BackHomeButton";
import ButtonModeSelector from "../components/ButtonModeSelector";
import ClickHistory from "../components/ClickHistory";
import ClearClickHistoryButton from "../components/ClearClickHistoryButton";
import Logo from "../assets/uadj_01_fixed.png";

type ButtonMode = "inactive" | "single-press" | "multi-press";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const AdminPage: React.FC = () => {
  // State för att hantera knappläge och klickhistorik
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [pressedTeams, setPressedTeams] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Hämta knappläget från databasen vid inladdning
  useEffect(() => {
    const modeRef = ref(database, `buttonMode`);
    onValue(modeRef, (snapshot) => {
      const mode = snapshot.val();
      if (mode) {
        setButtonMode(mode as ButtonMode);
      } else {
        setButtonMode("inactive"); // Sätt till inactive om inget värde finns
        set(ref(database, `buttonMode`), "inactive"); // Sätt värdet i databasen
      }
    });
  }, []);

  // Rensa klickhistorik
  const clearClickHistory = () => {
    set(ref(database, `clicks`), {});
    setClicks([]);
    if (buttonMode === "single-press") {
      setPressedTeams({});
    }
  };

  // Uppdatera knappläget i databasen
  const updateButtonMode = (mode: ButtonMode) => {
    set(ref(database, `buttonMode`), mode);
    setButtonMode(mode);
    setPressedTeams({});
  };

  // Hantera knapptryckningar
  const handleButtonPress = (team: string) => {
    if (buttonMode === "inactive") return; // Inaktivera om knappläget är inaktivt
    if (buttonMode === "single-press" && pressedTeams[team]) return; // Förhindra flera tryckningar i single-press-läge

    const clickRef = ref(database, `clicks`);
    push(clickRef, {
      team, // Endast lagnamnet registreras
    });

    if (buttonMode === "single-press") {
      setPressedTeams((prev) => ({ ...prev, [team]: true })); // Spara tryckta lag
    }
  };

  // Lyssna på klick i databasen
  const listenForClicks = useCallback(() => {
    const clicksRef = ref(database, `clicks`);
    onValue(clicksRef, (snapshot) => {
      const data = snapshot.val();
      const clicksData = data ? (Object.values(data) as ClickEntry[]) : [];
      setClicks(clicksData);
      if (buttonMode === "single-press" && clicksData.length > 0) {
        // Gå igenom alla klickdata och uppdatera pressedTeams
        const updatedPressedTeams = clicksData.reduce((acc, click) => {
          acc[click.team] = true; // Sätt laget som tryckt till true
          return acc;
        }, {} as { [key: string]: boolean });
        setPressedTeams(updatedPressedTeams); // Uppdatera pressedTeams med alla tryckta lag
      }
    });
  }, [buttonMode]);

  useEffect(() => {
    listenForClicks(); // Starta lyssnaren
    return () => {
      // Här kan du lägga till kod för att ta bort lyssnare om det behövs
    };
  }, [listenForClicks]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      {/* Header-sektion */}
      <div className="flex justify-between items-center mb-4">
        <BackToHomeButton />
        <a
          href="https://uppsaladiscjockey.se"
          target="_blank"
          rel="noopener noreferrer"
          className="w-20 ml-auto"
        >
          <img src={Logo} alt="Musikkampen Logo" />
        </a>
      </div>

      {/* Lagknappar för admin att testa med */}
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
                isPressed={pressedTeams[displayName]}
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

        {/* Visa historik över klick */}
        <ClickHistory clicks={clicks} />
        <VersionInfo />
      </div>
    </div>
  );
};

export default AdminPage;
