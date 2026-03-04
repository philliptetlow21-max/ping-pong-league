"use client";

import { PlayerStats, PLAYER_COLORS } from "@/lib/types";

interface StatsCardProps {
  stats: PlayerStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const color = PLAYER_COLORS[stats.player] || "#6b7280";

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-lg font-bold text-white">{stats.player}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Matches" value={stats.totalMatches} />
        <StatItem label="Win %" value={`${stats.winPercentage}%`} />
        <StatItem
          label="W / L"
          value={`${stats.totalWins} / ${stats.totalLosses}`}
        />
        <StatItem
          label="Win Streak"
          value={stats.longestWinStreak}
        />
        <StatItem
          label="Tiebreakers"
          value={`${stats.tiebreakersWon}/${stats.tiebreakersPlayed}`}
        />
        <StatItem
          label="Years"
          value={stats.yearsPlayed.length}
        />
        {stats.bestYear && (
          <StatItem
            label="Best Year"
            value={`${stats.bestYear.year} (${stats.bestYear.points}pts)`}
          />
        )}
        {stats.worstYear && stats.yearsPlayed.length > 1 && (
          <StatItem
            label="Worst Year"
            value={`${stats.worstYear.year} (${stats.worstYear.points}pts)`}
          />
        )}
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-white font-semibold">{value}</div>
    </div>
  );
}
