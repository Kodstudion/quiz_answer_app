import React from "react";
import { useNavigate } from "react-router-dom";

const BackToHomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm shadow-md"
    >
      ⬅ Till start
    </button>
  );
};

export default BackToHomeButton;
