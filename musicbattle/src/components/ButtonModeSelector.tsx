import React from "react";

type ButtonMode = "inactive" | "single-press" | "multi-press";

interface ButtonModeSelectorProps {
  currentMode: ButtonMode;
  onChange: (mode: ButtonMode) => void;
}

const ButtonModeSelector: React.FC<ButtonModeSelectorProps> = ({
  currentMode,
  onChange,
}) => {
  const modes: ButtonMode[] = ["inactive", "single-press", "multi-press"];

  return (
    <div className="flex flex-col items-start">
      {modes.map((mode) => (
        <label key={mode} className="inline-flex items-center space-x-2">
          <input
            type="radio"
            value={mode}
            checked={currentMode === mode}
            onChange={() => onChange(mode as ButtonMode)}
          />
          <span>
            {mode === "inactive"
              ? "🚫 Inaktiv"
              : mode === "single-press"
              ? "✅ Engångstryck"
              : "🔄 Flera tryck"}
          </span>
        </label>
      ))}
    </div>
  );
};

export default ButtonModeSelector;
