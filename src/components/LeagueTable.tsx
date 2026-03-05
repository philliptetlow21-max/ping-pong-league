"use client";

import { useMemo } from "react";
import { Standing, Match, PLAYER_COLORS } from "@/lib/types";
import { calculateMatchResult } from "@/lib/scoring";

interface LeagueTableProps {
  standings: Standing[];
  matches?: Match[];
  year?: number;
}

function getRecentForm(
  matches: Match[],
  year: number,
  player: string,
  count = 5
): ("W" | "L")[] {
  const playerMatches = matches
    .filter(
      (m) =>
        m.year === year &&
        (m.player1 === player || m.player2 === player)
    )
    .sort((a, b) => a.matchNumber - b.matchNumber);

  const form: ("W" | "L")[] = [];
  for (const match of playerMatches) {
    const result = calculateMatchResult(match);
    if (!result) continue;
    form.push(result.winner === player ? "W" : "L");
  }
  return form.slice(-count);
}

export default function LeagueTable({ standings, matches, year }: LeagueTableProps) {
  const formMap = useMemo(() => {
    if (!matches || !year) return {};
    const map: Record<string, ("W" | "L")[]> = {};
    for (const s of standings) {
      map[s.player] = getRecentForm(matches, year, s.player);
    }
    return map;
  }, [matches, year, standings]);
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
            {matches && <th className="text-center py-3 px-4">Form</th>}
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
                {matches && (
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {(formMap[standing.player] || []).map((r, fi) => (
                        <span
                          key={fi}
                          className={`inline-block w-5 h-5 rounded-full text-[10px] font-bold leading-5 text-center ${
                            r === "W"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
