import React from "react";

interface CreateGameButtonProps {
  onCreateGame: () => void;
}

const CreateGameButton: React.FC<CreateGameButtonProps> = ({
  onCreateGame,
}) => (
  <button
    onClick={onCreateGame}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
  >
    🎲 Skapa nytt spel
  </button>
);

export default CreateGameButton;
