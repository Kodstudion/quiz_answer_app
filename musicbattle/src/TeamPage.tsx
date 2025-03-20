import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebaseConfig";
import VersionInfo from "./components/VersionInfo";
import { teams } from "./constants/teamConfig";
import { throttle } from "lodash";
import TeamButton from "./components/TeamButton";
import BackToHomeButton from "./components/BackHomeButton";
import ClickHistory from "./components/ClickHistory";
import Logo from "./assets/uadj_01_fixed.png";
type ButtonMode = "inactive" | "single-press" | "multi-press";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const TeamPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [isPressed, setIsPressed] = useState(false);
  const [clicks, setClicks] = useState<ClickEntry[]>([]);

  const currentTeam =
    teams.find((team) => team.name.toLowerCase() === teamName?.toLowerCase()) ||
    teams[0];

  const listenToButtonMode = () => {
    const modeRef = ref(database, `buttonMode`);
    onValue(modeRef, (snapshot) => {
      setButtonMode((snapshot.val() || "inactive") as ButtonMode);
    });
  };

  const listenToClicks = useCallback(() => {
    const clicksRef = ref(database, `clicks`);
    onValue(
      clicksRef,
      throttle((snapshot) => {
        const data = snapshot.val();
        const clicksData = data ? (Object.values(data) as ClickEntry[]) : [];
        setClicks(clicksData);

        if (buttonMode === "single-press") {
          const hasTeamClicked = clicksData.some(
            (click) => click.team === currentTeam.displayName
          );
          setIsPressed(hasTeamClicked);
        }
      }, 300)
    );
  }, [currentTeam.displayName, buttonMode]);

  useEffect(() => {
    listenToClicks();
    listenToButtonMode();

    return () => {
      // Här kan du lägga till kod för att ta bort lyssnare om det behövs
    };
  }, [currentTeam, listenToClicks]);

  const handleButtonPress = (team: string) => {
    if (buttonMode === "inactive") return;

    const clickRef = ref(database, `clicks`);
    push(clickRef, {
      team,
    });

    // Hantera single-press
    if (buttonMode === "single-press") {
      if (!isPressed) {
        setIsPressed(true);
      }
    } else if (buttonMode === "multi-press") {
      // Ingen inaktivering av knappen, tillåt flera tryckningar
      // Här kan du lägga till logik för att hantera visuell feedback om det behövs
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      {/* Header-sektion */}
      <div className="flex justify-between items-center mb-4">
        <BackToHomeButton />
        <img src={Logo} alt="Musikkampen Logo" className="w-20 ml-auto" />{" "}
        {/* Använd ml-auto för att placera logotypen till höger */}
      </div>

      {/* Centrera innehållet */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-3xl font-bold mb-6">
          Lag: {currentTeam.displayName}
        </h1>

        <TeamButton
          isPressed={isPressed}
          buttonMode={buttonMode}
          teamButtonColor={currentTeam.teamButtonColor}
          teamButtonPressedColor={currentTeam.teamButtonPressedColor}
          onClick={handleButtonPress}
          teamName={currentTeam.displayName}
        />

        <ClickHistory clicks={clicks} />
        <VersionInfo />
      </div>
    </div>
  );
};

export default TeamPage;
