import React from "react";

interface AdminTeamButtonProps {
  teamButtonColor: string;
  onClick: (teamName: string) => void;
  teamName: string;
  width?: string;
  height?: string;
}

const AdminTeamButton: React.FC<AdminTeamButtonProps> = ({
  teamButtonColor,
  onClick,
  teamName,
  width = "w-62",
  height = "h-62",
}) => {
  return (
    <button
      onClick={() => onClick(teamName)}
      className={`${width} ${height} rounded-full shadow-lg border-4 border-gray-300 transition-all duration-300 transform hover:scale-110 bg-gradient-to-b ${teamButtonColor}`}
    ></button>
  );
};

export default AdminTeamButton;
