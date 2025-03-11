import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebaseConfig";
import VersionInfo from "./VersionInfo";
import { teams } from "./constants/teamConfig";
import { throttle } from "lodash";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleButtonPress = () => {
    if (buttonMode.current === "inactive") return;
    if (buttonMode.current === "single-press" && isPressed) return;

    const clickRef = ref(database, `games/${gameId}/clicks`);
    push(clickRef, {
      team: currentTeam.displayName,
      timestamp: new Date().toISOString(),
    });

    if (buttonMode.current === "single-press") {
      setIsPressed(true);
    }
  };

  const isButtonDisabled = () => {
    return (
      buttonMode.current === "inactive" ||
      (buttonMode.current === "single-press" && isPressed)
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm shadow-md"
      >
        ⬅ Till start
      </button>

      {!gameId ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Välj spel-ID</h1>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((id) => (
              <button
                key={id}
                onClick={() => handleGameIdSelect(id)}
                className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-lg shadow-md text-xl"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">
            Lag: {currentTeam.displayName}
          </h1>
          <button
            onClick={handleButtonPress}
            disabled={isButtonDisabled()}
            className={`w-62 h-62 rounded-full shadow-lg border-4 border-gray-300 transition-all duration-300 transform hover:scale-110 bg-gradient-to-b ${
              isPressed
                ? currentTeam.teamButtonPressedColor
                : currentTeam.teamButtonColor
            } ${
              buttonMode.current === "inactive"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          ></button>

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
