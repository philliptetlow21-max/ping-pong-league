"use client";

import { useState } from "react";
import { useMatches } from "@/lib/useMatches";
import { calculateHandicap } from "@/lib/handicap";
import { PLAYERS, PLAYER_COLORS } from "@/lib/types";
import HeadToHead from "@/components/HeadToHead";
import SignInPrompt from "@/components/SignInPrompt";

export default function HeadToHeadPage() {
  const { matches, loading, error } = useMatches();
  const [player1, setPlayer1] = useState<string>(PLAYERS[0]);
  const [player2, setPlayer2] = useState<string>(PLAYERS[1]);

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

  const record = calculateHandicap(matches, player1, player2);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Head to Head</h1>

      <div className="flex items-center gap-4 mb-6">
        <select
          value={player1}
          onChange={(e) => {
            if (e.target.value === player2) {
              setPlayer2(player1);
            }
            setPlayer1(e.target.value);
          }}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          style={{
            borderColor: PLAYER_COLORS[player1] || undefined,
          }}
        >
          {PLAYERS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="text-gray-500 text-sm">vs</span>
        <select
          value={player2}
          onChange={(e) => {
            if (e.target.value === player1) {
              setPlayer1(player2);
            }
            setPlayer2(e.target.value);
          }}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          style={{
            borderColor: PLAYER_COLORS[player2] || undefined,
          }}
        >
          {PLAYERS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <HeadToHead record={record} />
    </div>
  );
}
