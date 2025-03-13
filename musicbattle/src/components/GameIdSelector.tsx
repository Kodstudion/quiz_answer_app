import React from "react";

interface GameIdSelectorProps {
  onSelect: (id: number) => void;
}

const GameIdSelector: React.FC<GameIdSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Välj spel-ID</h1>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((id) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-lg shadow-md text-xl"
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameIdSelector;
