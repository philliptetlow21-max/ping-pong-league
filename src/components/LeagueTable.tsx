"use client";

import { Standing, PLAYER_COLORS } from "@/lib/types";

interface LeagueTableProps {
  standings: Standing[];
}

export default function LeagueTable({ standings }: LeagueTableProps) {
  if (standings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No matches recorded yet for this year.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-800">
            <th className="text-left py-3 px-4 w-12">#</th>
            <th className="text-left py-3 px-4">Player</th>
            <th className="text-center py-3 px-4">P</th>
            <th className="text-center py-3 px-4">W</th>
            <th className="text-center py-3 px-4">L</th>
            <th className="text-center py-3 px-4">GD</th>
            <th className="text-center py-3 px-4 font-bold text-emerald-400">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, i) => {
            const color = PLAYER_COLORS[standing.player] || "#6b7280";
            return (
              <tr
                key={standing.player}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                      i === 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-white">
                      {standing.player}
                    </span>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-gray-400">
                  {standing.played}
                </td>
                <td className="text-center py-4 px-4 text-green-400">
                  {standing.won}
                </td>
                <td className="text-center py-4 px-4 text-red-400">
                  {standing.lost}
                </td>
                <td className="text-center py-4 px-4 text-gray-400">
                  {standing.gamesWon - standing.gamesLost > 0 ? "+" : ""}
                  {standing.gamesWon - standing.gamesLost}
                </td>
                <td className="text-center py-4 px-4">
                  <span className="font-bold text-lg text-emerald-400">
                    {standing.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
