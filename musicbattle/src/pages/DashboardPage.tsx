import React, { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseConfig";
import BackToHomeButton from "../components/BackHomeButton";
import ClickHistory from "../components/ClickHistory";
import VersionInfo from "../components/VersionInfo";
import FastestTeamDisplay from "../components/FastestTeamDisplay";
import Logo from "../assets/uadj_01_fixed.png";

// Importera ljudfiler
import redSound from "../assets/sounds/red.mp3";
import blueSound from "../assets/sounds/blue.mp3";
import orangeSound from "../assets/sounds/orange.mp3";
import lightBlueSound from "../assets/sounds/lightblue.mp3";
import yellowSound from "../assets/sounds/yellow.mp3";
import purpleSound from "../assets/sounds/purple.mp3";
import greenSound from "../assets/sounds/green.mp3";
import pinkSound from "../assets/sounds/pink.mp3";
import resetSound from "../assets/sounds/bush.mp3";

interface ClickEntry {
  team: string;
}

const DashboardPage: React.FC = () => {
  const isFirstLoad = useRef(true);
  const [clicks, setClicks] = useState<ClickEntry[]>([]);
  const [fastestTeam, setFastestTeam] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(true); // Ljudet är mutat som standard

  useEffect(() => {
    // Lyssna på klickhistoriken i databasen
    const clicksRef = ref(database, `clicks`);
    const unsubscribe = onValue(clicksRef, (clickSnapshot) => {
      const clickData = clickSnapshot.val();
      const clicksArray = clickData
        ? (Object.values(clickData) as ClickEntry[])
        : [];
      setClicks(clicksArray);

      // Visa snabbaste laget om det finns klick
      if (clicksArray.length > 0) {
        const currentFastestTeam = clicksArray[0].team; // Anta att det första laget är det snabbaste
        setFastestTeam(currentFastestTeam);

        // Spela ljudet första gången någon klickar om det inte är första laddningen
        if (clicksArray.length === 1 && !isFirstLoad.current && !isMuted) {
          playSound(currentFastestTeam); // Spela lag-ljudet första gången någon klickar
        }
      } else {
        setFastestTeam("");
        if (!isMuted) {
          playResetSound(); // Spela pling-ljudet när listan är tom
        }
      }

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    });

    return () => unsubscribe(); // Avregistrera lyssnare
  }, [isMuted]); // Lägg till isMuted som beroende

  // Funktion för att spela upp ljud baserat på laget
  const playSound = (team: string) => {
    let sound: HTMLAudioElement;

    switch (team) {
      case "Röd":
        sound = new Audio(redSound);
        break;
      case "Ljusblå":
        sound = new Audio(lightBlueSound);
        break;
      case "Orange":
        sound = new Audio(orangeSound);
        break;
      case "Blå":
        sound = new Audio(blueSound);
        break;
      case "Gul":
        sound = new Audio(yellowSound);
        break;
      case "Lila":
        sound = new Audio(purpleSound);
        break;
      case "Grön":
        sound = new Audio(greenSound);
        break;
      case "Rosa":
        sound = new Audio(pinkSound);
        break;
      default:
        return;
    }

    sound.play(); // Spela upp ljudet
  };

  // Funktion för att spela pling-ljudet när listan är tom
  const playResetSound = () => {
    const pling = new Audio(resetSound);
    pling.play();
  };

  // Funktion för att toggla mute-status
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen text-black p-6 relative colorful-background-slow">
      <BackToHomeButton />

      <div className="absolute top-4 right-4">
        <button
          onClick={toggleMute}
          className="p-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md transition duration-300"
          aria-label={isMuted ? "Slå på ljud" : "Stäng av ljud"}
        >
          {isMuted ? "🔇" : "🔊"} {/* Ikon för mute/unmute */}
        </button>
      </div>

      {/* Loggan högst upp
      <img src={Logo} alt="Uppsala discjockey Logo" className="w-40 mb-6" /> */}

      <h1 className="text-4xl font-extrabold mb-4 text-center tracking-wide">
        <span className="musikkampen-title">Musikkampen</span>
      </h1>

      <FastestTeamDisplay fastestTeam={fastestTeam} />

      <ClickHistory clicks={clicks} />
      <p className="mt-10 text-center">
        <span className="musikkampen-normal">Musikkampen</span>
        <br />
        en del av
      </p>
      <div className="flex justify-center mt-2">
        <a
          href="https://uppsaladiscjockey.se"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={Logo} alt="Uppsala discjockey Logo" className="w-40" />
        </a>
      </div>
    </div>
  );
};
export default DashboardPage;
