import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, push, set } from "firebase/database";
import { database } from "../firebaseConfig";
import { teams } from "../constants/teamConfig";
import { throttle } from "lodash";
import TeamButton from "../components/TeamButton";
import BackToHomeButton from "../components/BackHomeButton";
import Logo from "../assets/uadj_01_fixed.png";
import { Lock } from "lucide-react";
type ButtonMode = "inactive" | "single-press" | "multi-press";

interface ClickEntry {
  team: string;
  answer?: string;
  timestamp?: string;
}

const TeamPage: React.FC = () => {
  const MAX_CHARS = 100;
  const { teamName } = useParams<{ teamName: string }>();
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [isPressed, setIsPressed] = useState(false);
  const [answerText, setAnswerText] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputHeightPx, setInputHeightPx] = useState<number>(56);
  const isInputDisabled =
    buttonMode === "inactive" || (buttonMode === "single-press" && isPressed);

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

        // För referens: första klicket om man behöver det senare
        // const first = clicksData.length > 0 ? (clicksData[0] as ClickEntry) : null;

        // Om listan är tom (t.ex. rensad av admin) – rensa textfältet
        if (clicksData.length === 0) {
          setAnswerText("");
          setIsPressed(false);
        }

        if (buttonMode === "single-press") {
          const teamClickIndex = clicksData.findIndex(
            (click) => click.team === currentTeam.displayName
          );
          const hasTeamClicked = teamClickIndex !== -1;
          setIsPressed(hasTeamClicked);

          // Uppdatera text om laget har klickat
          if (hasTeamClicked) {
            const teamClick = clicksData[teamClickIndex];
            if (teamClick && teamClick.answer !== undefined) {
              setAnswerText(teamClick.answer || "");
            }
          }
          // Viktigt: om ett annat lag klickar först ska vi INTE låsa detta lags input
        } else if (buttonMode === "inactive") {
          // Visa endast det egna lagets svar i inaktivt läge
          const teamClick = clicksData.find(
            (click) => click.team === currentTeam.displayName
          );
          if (teamClick && teamClick.answer !== undefined) {
            setAnswerText(teamClick.answer || "");
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

  useEffect(() => {
    const measure = () => {
      if (inputRef.current) {
        // Auto-resize textarea och uppdatera spacer-höjd
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        setInputHeightPx(inputRef.current.offsetHeight || 56);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    // Auto-resize vid textförändring
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      setInputHeightPx(inputRef.current.offsetHeight || 56);
    }
  }, [answerText]);

  // Multi-press: håll textfältet i synk med SENASTE svaret för EGET lag
  useEffect(() => {
    const teamAnswerRef = ref(database, `answers/${currentTeam.displayName}`);
    const unsubscribe = onValue(teamAnswerRef, (snapshot) => {
      const data = snapshot.val() as { team?: string; answer?: string } | null;
      if (
        buttonMode === "multi-press" &&
        data &&
        typeof data.answer === "string"
      ) {
        setAnswerText(data.answer);
      }
    });
    return () => unsubscribe();
  }, [currentTeam.displayName, buttonMode]);

  const handleButtonPress = (team: string) => {
    if (buttonMode === "inactive") return;

    const clickRef = ref(database, `clicks`);
    push(clickRef, {
      team,
      answer: answerText.slice(0, MAX_CHARS),
    });

    // Skriv/synka lagets aktuella svar under answers/{team}
    const teamAnswerRef = ref(database, `answers/${team}`);
    set(teamAnswerRef, {
      team,
      answer: answerText.slice(0, MAX_CHARS),
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

        {/* Knapp direkt under lagnamnet */}
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

        {/* Textfältet under knappen */}
        <div className="w-full max-w-md mt-3 px-4 md:px-0 relative">
          <textarea
            ref={inputRef}
            rows={1}
            className={`w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-400 text-base md:text-lg resize-none leading-relaxed ${
              isInputDisabled
                ? "bg-gray-200 text-gray-700 cursor-not-allowed pr-9"
                : "bg-white/90"
            }`}
            placeholder="Skriv ert svar här..."
            value={answerText}
            onChange={(e) => {
              const value = e.target.value;
              setAnswerText(
                value.length > MAX_CHARS ? value.slice(0, MAX_CHARS) : value
              );
            }}
            disabled={isInputDisabled}
            aria-disabled={isInputDisabled}
          />
          {isInputDisabled && (
            <span
              className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden
            >
              <Lock className="w-4 h-4 text-gray-600" />
            </span>
          )}
          <div className="mt-1 text-right text-xs text-gray-700 select-none">
            {answerText.length}/{MAX_CHARS}
          </div>
        </div>

        {/* Spacer under textfältet för att undvika tangentbords-överlapp, lika hög som inputen */}
        <div
          style={{ height: `${inputHeightPx}px` }}
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default TeamPage;
