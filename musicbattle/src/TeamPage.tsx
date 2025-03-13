import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebaseConfig";
import VersionInfo from "./VersionInfo";
import { teams } from "./constants/teamConfig";
import { throttle } from "lodash";
import TeamButton from "./components/TeamButton";
import BackToHomeButton from "./components/BackHomeButton";
import GameIdSelector from "./components/GameIdSelector";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const TeamPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [gameId, setGameId] = useState<number | null>(null);
  const buttonMode = useRef<string>("inactive");
  const [isPressed, setIsPressed] = useState(false);
  const [clicks, setClicks] = useState<ClickEntry[]>([]);

  const currentTeam =
    teams.find((team) => team.name.toLowerCase() === teamName?.toLowerCase()) ||
    teams[0];

  const listenToButtonMode = (id: number) => {
    const modeRef = ref(database, `games/${id}/buttonMode`);
    onValue(modeRef, (snapshot) => {
      buttonMode.current = snapshot.val() || "inactive";
    });
  };

  const listenToClicks = (id: number) => {
    const clicksRef = ref(database, `games/${id}/clicks`);
    onValue(
      clicksRef,
      throttle((snapshot) => {
        const data = snapshot.val();
        const clicksData = data ? (Object.values(data) as ClickEntry[]) : [];
        setClicks(clicksData);

        if (buttonMode.current === "single-press") {
          const hasTeamClicked = clicksData.some(
            (click) => click.team === currentTeam.displayName
          );
          setIsPressed(hasTeamClicked);
        }
      }, 300)
    );
  };

  const handleGameIdSelect = (id: number) => {
    setGameId(id);
    listenToClicks(id);
    listenToButtonMode(id);
  };

  const handleButtonPress = (team: string) => {
    if (buttonMode.current === "inactive") return;
    if (buttonMode.current === "single-press" && isPressed) return;

    const clickRef = ref(database, `games/${gameId}/clicks`);
    push(clickRef, {
      team,
      timestamp: new Date().toISOString(),
    });

    if (buttonMode.current === "single-press") {
      setIsPressed(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      <BackToHomeButton />
      {!gameId ? (
        <GameIdSelector onSelect={handleGameIdSelect} />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">
            Lag: {currentTeam.displayName}
          </h1>
          <TeamButton
            isPressed={isPressed}
            buttonMode={buttonMode.current}
            teamButtonColor={currentTeam.teamButtonColor}
            teamButtonPressedColor={currentTeam.teamButtonPressedColor}
            onClick={handleButtonPress}
            teamName={currentTeam.displayName}
          />
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
                    <td
                      colSpan={2}
                      className="py-2 px-4 text-center text-gray-500"
                    >
                      Inga tryck registrerade än
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <VersionInfo />
    </div>
  );
};

export default TeamPage;
