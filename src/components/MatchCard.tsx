"use client";

import { useState } from "react";
import { Match, PLAYER_COLORS } from "@/lib/types";
import { calculateMatchResult, isMatchComplete } from "@/lib/scoring";

interface MatchCardProps {
  match: Match;
  rowIndex: number;
  isAdmin: boolean;
  onUpdate?: () => void;
}

export default function MatchCard({
  match,
  rowIndex,
  isAdmin,
  onUpdate,
}: MatchCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState({
    p1Game1: match.p1Game1?.toString() ?? "",
    p2Game1: match.p2Game1?.toString() ?? "",
    p1Game2: match.p1Game2?.toString() ?? "",
    p2Game2: match.p2Game2?.toString() ?? "",
    p1Tiebreaker: match.p1Tiebreaker?.toString() ?? "",
    p2Tiebreaker: match.p2Tiebreaker?.toString() ?? "",
  });

  const result = calculateMatchResult(match);
  const complete = isMatchComplete(match);
  const p1Color = PLAYER_COLORS[match.player1] || "#6b7280";
  const p2Color = PLAYER_COLORS[match.player2] || "#6b7280";

  const handleSave = async () => {
    setSaving(true);
    try {
      const values = [
        match.year,
        match.matchNumber,
        match.player1,
        match.player2,
        scores.p1Game1 || "",
        scores.p2Game1 || "",
        scores.p1Game2 || "",
        scores.p2Game2 || "",
        scores.p1Tiebreaker || "",
        scores.p2Tiebreaker || "",
      ];
      const res = await fetch("/api/matches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex, values }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setEditing(false);
      onUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const ScoreInput = ({
    value,
    field,
  }: {
    value: string;
    field: keyof typeof scores;
  }) => (
    <input
      type="number"
      min="0"
      max="99"
      value={value}
      onChange={(e) => setScores({ ...scores, [field]: e.target.value })}
      className="w-12 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
    />
  );

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 hover:border-gray-600/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">
          Match #{match.matchNumber}
        </span>
        {result && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              result.scoreline === "2-0"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-amber-500/20 text-amber-400"
            }`}
          >
            {result.scoreline}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Player 1 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: p1Color }}
            />
            <span
              className={`font-semibold ${
                result?.winner === match.player1
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {match.player1}
            </span>
            {result?.winner === match.player1 && (
              <span className="text-emerald-400 text-xs">W</span>
            )}
          </div>
        </div>

        {/* Scores */}
        <div className="flex flex-col items-center gap-1">
          {editing ? (
            <>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>G1:</span>
                <ScoreInput value={scores.p1Game1} field="p1Game1" />
                <span>-</span>
                <ScoreInput value={scores.p2Game1} field="p2Game1" />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>G2:</span>
                <ScoreInput value={scores.p1Game2} field="p1Game2" />
                <span>-</span>
                <ScoreInput value={scores.p2Game2} field="p2Game2" />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>TB:</span>
                <ScoreInput value={scores.p1Tiebreaker} field="p1Tiebreaker" />
                <span>-</span>
                <ScoreInput value={scores.p2Tiebreaker} field="p2Tiebreaker" />
              </div>
            </>
          ) : complete ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-300 font-mono">
                  {match.p1Game1}
                </span>
                <span className="text-gray-600">-</span>
                <span className="text-gray-300 font-mono">
                  {match.p2Game1}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-300 font-mono">
                  {match.p1Game2}
                </span>
                <span className="text-gray-600">-</span>
                <span className="text-gray-300 font-mono">
                  {match.p2Game2}
                </span>
              </div>
              {match.p1Tiebreaker !== null && (
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <span className="font-mono">{match.p1Tiebreaker}</span>
                  <span className="text-gray-600">-</span>
                  <span className="font-mono">{match.p2Tiebreaker}</span>
                </div>
              )}
            </>
          ) : (
            <span className="text-gray-600 text-sm">vs</span>
          )}
        </div>

        {/* Player 2 */}
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2">
            {result?.winner === match.player2 && (
              <span className="text-emerald-400 text-xs">W</span>
            )}
            <span
              className={`font-semibold ${
                result?.winner === match.player2
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {match.player2}
            </span>
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: p2Color }}
            />
          </div>
        </div>
      </div>

      {/* Admin actions */}
      {isAdmin && (
        <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-end gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
            >
              Edit scores
            </button>
          )}
        </div>
      )}
    </div>
  );
}
