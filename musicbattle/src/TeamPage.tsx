import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, onSnapshot, addDoc, doc } from "firebase/firestore";
import { database } from "./firebaseConfig";
import VersionInfo from "./VersionInfo";
import { teams } from "./constants/teamConfig";
import TeamButton from "./components/TeamButton";
import BackToHomeButton from "./components/BackHomeButton";
import ClickHistory from "./components/ClickHistory";
import Logo from "./assets/uadj_01_fixed.png";

interface ClickEntry {
  team: string;
  timestamp: string;
}

const TeamPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const buttonMode = useRef<string>("inactive");
  const [isPressed, setIsPressed] = useState(false);
  const [clicks, setClicks] = useState<ClickEntry[]>([]);

  const currentTeam =
    teams.find((team) => team.name.toLowerCase() === teamName?.toLowerCase()) ||
    teams[0];

  const listenToButtonMode = useCallback(() => {
    // Lyssna på buttonMode i Firestore
    const buttonModeRef = doc(database, "settings", "buttonMode");
    const unsubscribe = onSnapshot(buttonModeRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data && data.mode) {
          buttonMode.current = data.mode; // Uppdatera den aktuella buttonMode
        }
      }
    });

    return unsubscribe; // Returnera avregistreringsfunktionen
  }, []);

  const listenToClicks = useCallback(() => {
    // Lyssna på klickhistorik i Firestore
    const clicksRef = collection(database, "clicks");
    const unsubscribe = onSnapshot(clicksRef, (snapshot) => {
      const clicksArray: ClickEntry[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp,
      })) as ClickEntry[];
      setClicks(clicksArray);

      if (buttonMode.current === "single-press") {
        const hasTeamClicked = clicksArray.some(
          (click) => click.team === currentTeam.displayName
        );
        setIsPressed(hasTeamClicked);
      }
    });

    return unsubscribe; // Returnera avregistreringsfunktionen
  }, [currentTeam.displayName]);

  useEffect(() => {
    const unsubscribeButtonMode = listenToButtonMode();
    const unsubscribeClicks = listenToClicks();

    return () => {
      unsubscribeButtonMode(); // Avregistrera lyssnare för buttonMode
      unsubscribeClicks(); // Avregistrera lyssnare för clicks
    };
  }, [listenToButtonMode, listenToClicks]);

  const handleButtonPress = async (team: string) => {
    if (buttonMode.current === "inactive") return;
    if (buttonMode.current === "single-press" && isPressed) return;

    // Registrera klick i Firestore
    try {
      await addDoc(collection(database, "clicks"), {
        team,
        timestamp: new Date().toISOString(),
      });

      if (buttonMode.current === "single-press") {
        setIsPressed(true);
      }
    } catch (e) {
      console.error("Error registering click: ", e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      {/* Header-sektion */}
      <div className="flex justify-between w-full mb-4">
        <BackToHomeButton />
        <img src={Logo} alt="Musikkampen Logo" className="w-20 ml-auto" />
      </div>

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

        <ClickHistory clicks={clicks} />
      </>

      <VersionInfo />
    </div>
  );
};

export default TeamPage;
