import React from "react";

interface ClearClickHistoryButtonProps {
  onClear: () => void;
}

const ClearClickHistoryButton: React.FC<ClearClickHistoryButtonProps> = ({
  onClear,
}) => {
  return (
    <button
      onClick={onClear}
      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
    >
      🗑️ Rensa resultat
    </button>
  );
};

export default ClearClickHistoryButton;
