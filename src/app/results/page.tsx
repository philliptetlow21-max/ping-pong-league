"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMatches } from "@/lib/useMatches";
import { getAvailableYears } from "@/lib/scoring";
import { PLAYERS } from "@/lib/types";
import MatchCard from "@/components/MatchCard";
import YearSelector from "@/components/YearSelector";
import SignInPrompt from "@/components/SignInPrompt";

export default function ResultsPage() {
  const { matches, loading, error, refetch } = useMatches();
  const { data: session } = useSession();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [playerFilter, setPlayerFilter] = useState<string>("");

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

  const years = getAvailableYears(matches);
  const year = selectedYear ?? years[0] ?? new Date().getFullYear();

  // We need to track rowIndex from the full matches array for the PUT API
  const indexedMatches = matches.map((m, i) => ({ match: m, rowIndex: i }));

  const filtered = indexedMatches.filter(({ match }) => {
    if (match.year !== year) return false;
    if (playerFilter && match.player1 !== playerFilter && match.player2 !== playerFilter) {
      return false;
    }
    return true;
  });

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
  const admin = !!session?.user?.email && session.user.email === adminEmail;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Match Results</h1>
        <div className="flex items-center gap-3">
          <select
            value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All players</option>
            {PLAYERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <YearSelector
            years={years}
            selectedYear={year}
            onChange={setSelectedYear}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No matches found.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(({ match, rowIndex }) => (
            <MatchCard
              key={`${match.year}-${match.matchNumber}-${match.player1}-${match.player2}`}
              match={match}
              rowIndex={rowIndex}
              isAdmin={admin}
              onUpdate={refetch}
              allMatches={matches}
            />
          ))}
        </div>
      )}
    </div>
  );
}
