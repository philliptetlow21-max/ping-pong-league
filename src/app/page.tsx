"use client";

import { useState } from "react";
import { useMatches } from "@/lib/useMatches";
import { buildLeagueTable, getAvailableYears } from "@/lib/scoring";
import LeagueTable from "@/components/LeagueTable";
import YearSelector from "@/components/YearSelector";
import SignInPrompt from "@/components/SignInPrompt";

export default function Home() {
  const { matches, loading, error } = useMatches();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

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
  const standings = buildLeagueTable(matches, year);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">League Standings</h1>
        <YearSelector
          years={years}
          selectedYear={year}
          onChange={setSelectedYear}
        />
      </div>
      <div className="bg-gray-900/50 rounded-xl border border-gray-800">
        <LeagueTable standings={standings} matches={matches} year={year} />
      </div>
    </div>
  );
}
