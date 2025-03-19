import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import VersionInfo from "./VersionInfo";
import { teams } from "./constants/teamConfig";
import Logo from "./assets/uadj_01_fixed.png";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      {/* Admin-knapp (kugghjul i övre vänstra hörnet) */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-4 left-4 p-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md transition duration-300"
      >
        <Settings className="w-6 h-6 text-black" />
      </button>

      {/* Loggan högst upp */}
      <img src={Logo} alt="Musikkampen Logo" className="w-40 mb-6" />

      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 right-4 p-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md transition duration-300"
      >
        📊
      </button>

      {/* Titel och instruktion */}
      <h1 className="text-4xl font-extrabold mb-4 text-center tracking-wide">
        <span className="musikkampen-title">Musikkampen</span>
      </h1>
      <p className="text-lg text-center mb-6">
        Välj ditt lags ballongfärg för att börja spela!
      </p>

      {/* Grid med 2 kolumner och 4 rader */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {teams.map(({ name, displayName, navigateButtonColor }) => (
          <button
            key={name}
            onClick={() => navigate(`/team/${name.toLowerCase()}`)}
            className={`${navigateButtonColor} px-6 py-3 rounded-2xl text-lg font-semibold w-full shadow-md transform transition duration-300 hover:scale-105`}
          >
            {displayName}
          </button>
        ))}
      </div>

      <VersionInfo />
    </div>
  );
};

export default Home;
