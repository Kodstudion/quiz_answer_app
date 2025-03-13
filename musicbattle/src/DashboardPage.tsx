import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebaseConfig";
import BackToHomeButton from "./components/BackHomeButton";
import ClickHistory from "./components/ClickHistory";
import VersionInfo from "./VersionInfo";
import FastestTeamDisplay from "./components/FastestTeamDisplay";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const DashboardPage: React.FC = () => {
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [fastestTeam, setFastestTeam] = useState<string>("");

  useEffect(() => {
    // Kollar vilket spel som är aktivt
    const gamesRef = ref(database, "games");
    const unsubscribe = onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setClicks([]);
        setFastestTeam("");
        return;
      }

      const activeGameId = Object.keys(data)[0];
      const clicksRef = ref(database, `games/${activeGameId}/clicks`);

      // Lyssnar på klickhistoriken i det aktiva spelet
      onValue(clicksRef, (clickSnapshot) => {
        const clickData = clickSnapshot.val();
        const clicksArray = clickData
          ? (Object.values(clickData) as ClickEntry[])
          : [];
        setClicks(clicksArray);

        if (clicksArray.length > 0) {
          setFastestTeam(clicksArray[0].team); // Första laget som klickade
        } else {
          setFastestTeam("");
        }
      });
    });

    return () => unsubscribe(); // Avregistrera lyssnare
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      <BackToHomeButton />

      <h1 className="text-4xl font-extrabold mb-4 text-center tracking-wide">
        📊 Dashboard
      </h1>

      <FastestTeamDisplay fastestTeam={fastestTeam} />

      <ClickHistory clicks={clicks} />

      <VersionInfo />
    </div>
  );
};

export default DashboardPage;
