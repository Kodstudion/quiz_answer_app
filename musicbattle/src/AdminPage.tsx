import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
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
  const [buttonMode, setButtonMode] = useState<ButtonMode>("inactive");
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [pressedTeams, setPressedTeams] = useState<{ [key: string]: boolean }>(
    {}
  );

  const clearClickHistory = async () => {
    const clicksRef = collection(database, "clicks");
    const snapshot = await getDocs(clicksRef);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
    setClicks([]);
    setPressedTeams({});
  };

  const updateButtonMode = async (mode: ButtonMode) => {
    setButtonMode(mode);
    setPressedTeams({});

    try {
      await setDoc(doc(database, "settings", "buttonMode"), { mode });
    } catch (e) {
      console.error("Error updating button mode: ", e);
    }
  };

  const handleButtonPress = async (team: string) => {
    if (buttonMode === "inactive") return;
    if (buttonMode === "single-press" && pressedTeams[team]) return;

    try {
      await addDoc(collection(database, "clicks"), {
        team,
        timestamp: new Date().toISOString(),
      });

      if (buttonMode === "single-press") {
        setPressedTeams((prev) => ({ ...prev, [team]: true }));
      }
    } catch (e) {
      console.error("Error registering click: ", e);
    }
  };

  useEffect(() => {
    const clicksRef = collection(database, "clicks");
    const unsubscribe = onSnapshot(clicksRef, (snapshot) => {
      const clicksArray: ClickEntry[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp,
      })) as ClickEntry[];
      setClicks(clicksArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      <div className="flex justify-between w-full mb-4">
        <BackToHomeButton />
        <img src={Logo} alt="Musikkampen Logo" className="w-20 ml-auto" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {teams.map(
          ({ name, displayName, teamButtonColor, teamButtonPressedColor }) => (
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

      <div className="flex flex-col items-center gap-4 mt-6">
        <span className="text-lg font-semibold">🕹️ Styr lagens knappar:</span>
        <ButtonModeSelector
          currentMode={buttonMode}
          onChange={updateButtonMode}
        />
      </div>

      <ClearClickHistoryButton onClear={clearClickHistory} />

      <ClickHistory clicks={clicks} />

      <VersionInfo />
    </div>
  );
};

export default AdminPage;
