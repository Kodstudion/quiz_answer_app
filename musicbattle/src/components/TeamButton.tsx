import React from "react";

interface TeamButtonProps {
  isPressed: boolean;
  buttonMode: string;
  teamButtonColor: string;
  teamButtonPressedColor: string;
  onClick: () => void;
}

const TeamButton: React.FC<TeamButtonProps> = ({
  isPressed,
  buttonMode,
  teamButtonColor,
  teamButtonPressedColor,
  onClick,
}) => {
  const isDisabled =
    buttonMode === "inactive" || (buttonMode === "single-press" && isPressed);

  return (
    <button
      onClick={onClick}
      disabled={isPressed || isDisabled}
      className={`w-62 h-62 rounded-full shadow-lg border-4 border-gray-300 transition-all duration-300 transform hover:scale-110 bg-gradient-to-b ${
        isPressed ? teamButtonPressedColor : teamButtonColor
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
    ></button>
  );
};

export default TeamButton;
