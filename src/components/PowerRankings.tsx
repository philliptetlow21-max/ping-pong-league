"use client";

import { useMemo } from "react";
import { Match, PLAYER_COLORS } from "@/lib/types";
import { calculateEloRatings } from "@/lib/elo";

interface PowerRankingsProps {
  matches: Match[];
}

export default function PowerRankings({ matches }: PowerRankingsProps) {
  const { ratings, recentChange } = useMemo(
    () => calculateEloRatings(matches),
    [matches]
  );

  const ranked = useMemo(() => {
    return Object.entries(ratings)
      .map(([player, rating]) => ({
        player,
        rating: Math.round(rating),
        change: recentChange[player] ?? 0,
      }))
      .sort((a, b) => b.rating - a.rating);
  }, [ratings, recentChange]);

  if (ranked.length === 0) return null;

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
      <div className="space-y-3">
        {ranked.map((entry, i) => {
          const color = PLAYER_COLORS[entry.player] || "#6b7280";
          return (
            <div
              key={entry.player}
              className="flex items-center gap-3"
            >
              <span className="text-gray-500 font-mono text-sm w-6 text-right">
                #{i + 1}
              </span>
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-white font-semibold flex-1">
                {entry.player}
              </span>
              <span className="text-gray-300 font-mono tabular-nums">
                {entry.rating}
              </span>
              {entry.change !== 0 && (
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    entry.change > 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {entry.change > 0 ? "+" : ""}
                  {entry.change}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
