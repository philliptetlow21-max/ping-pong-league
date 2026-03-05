"use client";

import { useMatches } from "@/lib/useMatches";
import { calculatePlayerStats } from "@/lib/stats";
import { PLAYERS } from "@/lib/types";
import StatsCard from "@/components/StatsCard";
import PowerRankings from "@/components/PowerRankings";
import SignInPrompt from "@/components/SignInPrompt";

export default function StatsPage() {
  const { matches, loading, error } = useMatches();

  if (error === "sign-in") return <SignInPrompt />;
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-400 py-12">{error}</div>;
  }

  const stats = PLAYERS.map((player) =>
    calculatePlayerStats(matches, player)
  ).sort((a, b) => b.winPercentage - a.winPercentage);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">All-Time Stats</h1>

      <h2 className="text-lg font-semibold text-white mb-3">Power Rankings</h2>
      <div className="mb-6">
        <PowerRankings matches={matches} />
      </div>

      {stats.every((s) => s.totalMatches === 0) ? (
        <div className="text-center text-gray-500 py-12">
          No match data yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((s) => (
            <StatsCard key={s.player} stats={s} />
          ))}
        </div>
      )}
    </div>
  );
}
