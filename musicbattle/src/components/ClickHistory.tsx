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
    <div className="mt-10 w-full max-w-4xl mx-auto z-1">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-24 min-w-24">
                  Lag
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Svar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clicks.length > 0 ? (
                clicks.map((click, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-center">
                        {/* <div className="w-3 h-3 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div> */}
                        <span className="font-medium text-gray-900 text-sm">
                          {click.team}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="text-gray-800 leading-relaxed">
                        {click.answer ? (
                          <span className="break-words">{click.answer}</span>
                        ) : (
                          <span className="text-gray-400 italic">
                            Inget svar
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-12 px-6 text-center">
                    <div className="text-gray-500 text-lg">
                      <div className="text-4xl mb-2">📝</div>
                      Inga svar registrerade än
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClickHistory;
