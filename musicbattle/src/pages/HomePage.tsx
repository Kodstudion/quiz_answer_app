import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { teams } from "../constants/teamConfig";
import Logo from "../assets/uadj_01_fixed.png";

// Home-komponenten som representerar startsidan för applikationen
const Home: React.FC = () => {
  // useNavigate hook för att navigera mellan sidor
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen text-black p-3 sm:p-4 md:p-6 relative colorful-background">
      {/* Admin-knapp (kugghjul i övre vänstra hörnet) */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-2 left-2 sm:top-4 sm:left-4 p-1.5 sm:p-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md transition duration-300"
        aria-label="Gå till admin"
      >
        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
      </button>

      {/* Dashboard-knapp (diagram) i övre högra hörnet */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md transition duration-300"
        aria-label="Gå till dashboard"
      >
        <span className="text-lg sm:text-xl">📊</span>
      </button>

      {/* Titel och instruktion */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-center tracking-wide">
        Välkommen till
        <br />
        <span className="musikkampen-title">
          Musikkampen<sup className="text-sm align-super ml-0.5">®</sup>
        </span>
      </h1>
      <p className="text-base sm:text-lg text-center mb-4 sm:mb-6 px-2">
        Välj ditt lags ballongfärg för att börja spela!
      </p>

      {/* Grid med 2 kolumner och 4 rader för lagknappar */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full max-w-sm sm:max-w-md px-2">
        {teams.map(({ name, displayName, navigateButtonColor }) => (
          <button
            key={name}
            onClick={() => navigate(`/team/${name.toLowerCase()}`)}
            className={`${navigateButtonColor} button px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold w-full shadow-md transform transition duration-300 hover:scale-105`}
            aria-label={`Gå till laget ${displayName}`}
          >
            {displayName}
          </button>
        ))}
      </div>
      <p className="mt-6 sm:mt-8 md:mt-10 text-center text-sm sm:text-base">
        <span className="musikkampen-normal">
          Musikkampen<sup className="text-sm align-super ml-0.5">®</sup>
        </span>
        <br />
        en del av
      </p>
      <div className="flex justify-center mt-2">
        <a
          href="https://uppsaladiscjockey.se"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={Logo}
            alt="Uppsala discjockey Logo"
            className="w-32 sm:w-36 md:w-40"
          />
        </a>
      </div>
    </div>
  );
};

export default Home;
