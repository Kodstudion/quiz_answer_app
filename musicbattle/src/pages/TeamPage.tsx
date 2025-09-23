import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, push, set } from "firebase/database";
import { database } from "../firebaseConfig";
import { teams } from "../constants/teamConfig";
import { throttle } from "lodash";
import TeamButton from "../components/TeamButton";
import BackToHomeButton from "../components/BackHomeButton";
import Logo from "../assets/uadj_01_fixed.png";
type ButtonMode = "inactive" | "single-press" | "multi-press";

interface ClickEntry {
  team: string;
  answer?: string;
  timestamp?: string;
}

const TeamPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [isPressed, setIsPressed] = useState(false);
  const [answerText, setAnswerText] = useState<string>("");
  const [firstClick, setFirstClick] = useState<ClickEntry | null>(null);

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

        // Bestäm första klicket (om något) – antas vara första objektet
        const first =
          clicksData.length > 0 ? (clicksData[0] as ClickEntry) : null;
        setFirstClick(first);

        if (buttonMode === "single-press") {
          const hasTeamClicked = clicksData.some(
            (click) => click.team === currentTeam.displayName
          );
          setIsPressed(hasTeamClicked);

          // Om någon (kanske annat lag) redan klickat först,
          // synka textfältet till det svaret
          if (first && first.answer !== undefined) {
            setAnswerText(first.answer || "");
          }
        } else if (buttonMode === "inactive") {
          // Håll inputen i synk med första svar även i inaktivt läge om det finns
          if (first && first.answer !== undefined) {
            setAnswerText(first.answer || "");
          }
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
      answer: answerText,
    });

    // Skriv/synka lagets aktuella svar under answers/{team}
    const teamAnswerRef = ref(database, `answers/${team}`);
    set(teamAnswerRef, {
      team,
      answer: answerText,
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
    <div
      className={`flex flex-col min-h-[100dvh] w-screen text-black p-4 md:p-6 relative bg-gradient-to-b ${currentTeam.lightColor}`}
    >
      {/* Header-sektion */}
      <div className="flex justify-between items-center mb-4">
        <BackToHomeButton />
        <a
          href="https://uppsaladiscjockey.se"
          target="_blank"
          rel="noopener noreferrer"
          className="w-20 ml-auto"
        >
          <img src={Logo} alt="Musikkampen® Logo" />{" "}
        </a>
      </div>

      {/* Huvudinnehåll */}
      <div className="flex flex-col items-center flex-grow">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Lag: {currentTeam.displayName}
        </h1>
        {/* Spacer så att innehållet inte hamnar under den fixerade footern */}
        <div className="flex-grow" />
      </div>

      {/* Fast footer: input + knapp alltid synliga över tangentbordet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] px-4 pt-2">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center gap-3 bg-transparent pb-3">
            <input
              type="text"
              inputMode="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-400 text-base md:text-lg bg-white/90"
              placeholder="Skriv ert svar här..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={
                buttonMode === "inactive" ||
                (buttonMode === "single-press" && !!firstClick)
              }
            />

            <TeamButton
              isPressed={isPressed}
              buttonMode={buttonMode}
              teamButtonColor={currentTeam.teamButtonColor}
              teamButtonPressedColor={currentTeam.teamButtonPressedColor}
              onClick={handleButtonPress}
              teamName={currentTeam.displayName}
              width="w-28 h-28 md:w-44"
              height="h-28 md:h-44"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
