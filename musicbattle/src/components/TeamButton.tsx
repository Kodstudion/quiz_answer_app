import React from "react";

interface TeamButtonProps {
  isPressed: boolean;
  buttonMode: string;
  teamButtonColor: string;
  teamButtonPressedColor: string;
  onClick: (teamName: string) => void;
  teamName: string;
  width?: string;
  height?: string;
}

const TeamButton: React.FC<TeamButtonProps> = ({
  isPressed,
  buttonMode,
  teamButtonColor,
  teamButtonPressedColor,
  onClick,
  teamName,
  width = "w-62",
  height = "h-62",
}) => {
  const isDisabled =
    buttonMode === "inactive" || (buttonMode === "single-press" && isPressed);

  return (
    <button
      onClick={() => onClick(teamName)}
      disabled={isPressed || isDisabled}
      className={`${width} ${height} rounded-full shadow-lg border-4 border-gray-300 transition-all duration-300 transform hover:scale-110 bg-gradient-to-b ${
        isPressed ? teamButtonPressedColor : teamButtonColor
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
    ></button>
  );
};

export default TeamButton;
