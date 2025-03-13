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

  const modeLabels = {
    inactive: "Inaktiv",
    "single-press": "Engångstryck",
    "multi-press": "Flera tryck",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {modes.map((mode) => (
        <label key={mode} className="flex items-center gap-2">
          <input
            type="radio"
            value={mode}
            checked={currentMode === mode}
            onChange={() => onChange(mode)}
          />
          {modeLabels[mode]}
        </label>
      ))}
    </div>
  );
};

export default ButtonModeSelector;
