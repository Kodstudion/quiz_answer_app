import React from "react";

interface EndGameButtonProps {
  gameId: number;
  onEndGame: () => void;
}

const EndGameButton: React.FC<EndGameButtonProps> = ({ onEndGame, gameId }) => {
  return (
    <button
      onClick={onEndGame}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
    >
      🛑 Avsluta spel {gameId}
    </button>
  );
};

export default EndGameButton;
