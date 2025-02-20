import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-b from-gray-100 to-gray-300 text-black p-6 relative">
      
      {/* Tillbaka-knapp i övre vänstra hörnet */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm shadow-md"
      >
        ⬅ Till start
      </button>

      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        🔧 Admin Panel
      </h1>

      <p className="text-lg text-center">
        Här kan du hantera spelets omgångar och laginställningar.
      </p>

    </div>
  );
};

export default AdminPage;