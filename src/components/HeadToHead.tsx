"use client";

import { HeadToHeadRecord, PLAYER_COLORS } from "@/lib/types";

interface HeadToHeadProps {
  record: HeadToHeadRecord;
}

export default function HeadToHead({ record }: HeadToHeadProps) {
  const p1Color = PLAYER_COLORS[record.player1] || "#6b7280";
  const p2Color = PLAYER_COLORS[record.player2] || "#6b7280";
  const total = record.player1Wins + record.player2Wins;

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: p1Color }}
          />
          <span className="text-xl font-bold text-white">{record.player1}</span>
        </div>
        <span className="text-gray-600 text-sm">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">{record.player2}</span>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: p2Color }}
          />
        </div>
      </div>

      {/* Win bar */}
      {total > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white font-bold">{record.player1Wins}</span>
            <span className="text-gray-500">{total} matches</span>
            <span className="text-white font-bold">{record.player2Wins}</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-700">
            <div
              className="transition-all duration-500"
              style={{
                width: `${(record.player1Wins / total) * 100}%`,
                backgroundColor: p1Color,
              }}
            />
            <div
              className="transition-all duration-500"
              style={{
                width: `${(record.player2Wins / total) * 100}%`,
                backgroundColor: p2Color,
              }}
            />
          </div>
        </div>
      )}

      {/* Handicap */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
        <h3 className="text-sm text-gray-400 mb-2">Current Handicap</h3>
        {record.handicap > 0 ? (
          <p className="text-white">
            <span className="font-bold text-emerald-400">
              {record.handicapFavour}
            </span>{" "}
            starts each game with a{" "}
            <span className="font-bold text-emerald-400">
              {record.handicap}-point
            </span>{" "}
            head start
          </p>
        ) : (
          <p className="text-gray-500">No handicap — evenly matched</p>
        )}
      </div>

      {/* By year */}
      {record.byYear.length > 0 && (
        <div>
          <h3 className="text-sm text-gray-400 mb-3">By Year</h3>
          <div className="space-y-2">
            {record.byYear.map((yr) => (
              <div
                key={yr.year}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-500">{yr.year}</span>
                <div className="flex items-center gap-4">
                  <span style={{ color: p1Color }} className="font-medium">
                    {yr.p1Wins}
                  </span>
                  <span className="text-gray-600">-</span>
                  <span style={{ color: p2Color }} className="font-medium">
                    {yr.p2Wins}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
