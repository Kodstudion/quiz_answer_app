import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebaseConfig";
import VersionInfo from "./VersionInfo";
import { throttle } from "lodash";

interface TeamColors {
  [key: string]: { color: string; pressedColor: string };
}

const teamColors: TeamColors = {
  red: { color: "from-red-500 to-red-700", pressedColor: "from-red-700 to-red-900" },
  blue: { color: "from-blue-500 to-blue-700", pressedColor: "from-blue-700 to-blue-900" },
  yellow: { color: "from-yellow-400 to-yellow-600", pressedColor: "from-yellow-600 to-yellow-800" },
  orange: { color: "from-orange-500 to-orange-700", pressedColor: "from-orange-700 to-orange-900" },
  purple: { color: "from-purple-500 to-purple-700", pressedColor: "from-purple-700 to-purple-900" },
  green: { color: "from-green-500 to-green-700", pressedColor: "from-green-700 to-green-900" },
  pink: { color: "from-pink-500 to-pink-700", pressedColor: "from-pink-700 to-pink-900" },
  lightblue: { color: "from-cyan-500 to-cyan-700", pressedColor: "from-cyan-700 to-cyan-900" },
};

const validateTeamName = (name: string | undefined): keyof TeamColors => {
  return teamColors[name?.toLowerCase() || ""] ? (name!.toLowerCase() as keyof TeamColors) : "red";
};

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamName } = useParams<{ teamName: string }>();
  const [gameId, setGameId] = useState<number | null>(null);
  const buttonMode = React.useRef<string>("inactive"); // Byter från useState till let
  const [isPressed, setIsPressed] = useState(false);
  const [clicks, setClicks] = useState<{ team: string; timestamp: string }[]>([]);

  const validTeamName = validateTeamName(teamName?.toString());
  const teamStyle = teamColors[validTeamName];

  const listenToButtonMode = (id: number) => {
  const modeRef = ref(database, `games/${id}/buttonMode`);
  onValue(modeRef, (snapshot) => {
    const mode = snapshot.val();
    console.log("Button mode updated from admin:", mode);
    buttonMode.current = mode || "inactive";
  });
};

const isButtonDisabled = () => {
  return buttonMode.current === "inactive" || (buttonMode.current === "single-press" && isPressed);
};

  

  const handleGameIdSelect = (id: number) => {
    setGameId(id);
listenToClicks(id);
listenToButtonMode(id);
  };

  const listenToClicks = (id: number) => {
    console.log(`Listening to clicks for game ID: ${id}`);
    const clicksRef = ref(database, `games/${id}/clicks`);
    onValue(clicksRef, throttle((snapshot) => {
      const data = snapshot.val();
      const clicksData = data
        ? (Object.values(data) as { team: string; timestamp: string }[])
        : [];
      console.log('Fetched clicks data:', clicksData);
      console.log("listenToClicks");
      setClicks(clicksData);

      if (buttonMode.current === "single-press") {
        const hasTeamClicked = clicksData.some((click) => click.team === teamName);
        setIsPressed(hasTeamClicked);
      }
    }, 300));
  };

  const handleButtonPress = () => {
    if (buttonMode.current === "inactive") return;
    if (buttonMode.current === "single-press" && isPressed) return;

    const clickRef = ref(database, `games/${gameId}/clicks`);
    push(clickRef, {
      team: teamName,
      timestamp: new Date().toISOString(),
    });
    console.log("handleButtonPress");
    if (buttonMode.current === "single-press") {
    setIsPressed(true);
    }
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
          <h1 className="text-3xl font-bold mb-6">Lag: {teamName}</h1>
          <button
            onClick={handleButtonPress}
            disabled={isButtonDisabled()}
            className={`w-62 h-62 rounded-full shadow-lg border-4 border-gray-300 transition-all duration-300 transform hover:scale-110 bg-gradient-to-b ${isPressed ? teamStyle.pressedColor : teamStyle.color} ${buttonMode.current === "inactive" ? "opacity-50 cursor-not-allowed" : ""}`}
          ></button>

          <div className="mt-10 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2 text-center">📋 Tryckhistorik</h2>
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
                      <td className="py-2 px-4">{new Date(click.timestamp).toLocaleTimeString()}</td>
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
        </>
      )}

      <VersionInfo />
    </div>
  );
};

export default TeamPage;