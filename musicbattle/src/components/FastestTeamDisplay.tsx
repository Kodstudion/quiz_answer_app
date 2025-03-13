import React from "react";
import { teams } from "../constants/teamConfig";

interface FastestTeamDisplayProps {
  fastestTeam: string;
}

const FastestTeamDisplay: React.FC<FastestTeamDisplayProps> = ({
  fastestTeam,
}) => {
  if (!fastestTeam) {
    return (
      <p className="text-lg mb-6 text-gray-500 text-center">
        Ingen har tryckt ännu!
      </p>
    );
  }

  const team = teams.find((t) => t.displayName === fastestTeam);

  const backgroundColor = team ? team.backgroundColor : "bg-green-200";
  const textColor = team ? team.textColor : "text-green-700";

  return (
    <div
      className={`mb-6 p-4 ${backgroundColor} rounded-lg shadow-md text-center`}
    >
      <h2 className={`text-2xl font-semibold ${textColor}`}>
        Snabbast på knappen:
      </h2>
      <p className={`text-3xl font-bold mt-2 ${textColor}`}>{fastestTeam}</p>
    </div>
  );
};

export default FastestTeamDisplay;
