import React from "react";

interface ClickEntry {
  team: string;
  answer?: string;
}

interface ClickHistoryProps {
  clicks: ClickEntry[];
}

const ClickHistory: React.FC<ClickHistoryProps> = ({ clicks }) => {
  return (
    <div className="mt-10 w-full max-w-2xl mx-auto z-1">
      <h2 className="text-xl font-semibold mb-2 text-center">📋 Resultat</h2>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-300">
          <tr>
            <th className="py-2 px-4 text-left">Lag</th>
            <th className="py-2 px-4 text-left">Svar</th>
          </tr>
        </thead>
        <tbody>
          {clicks.length > 0 ? (
            clicks.map((click, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="py-2 px-4 align-top whitespace-nowrap">
                  {click.team}
                </td>
                <td className="py-2 px-4 align-top break-words">
                  {click.answer || ""}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="py-2 px-4 text-center text-gray-500">
                Inga tryck registrerade än
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClickHistory;
