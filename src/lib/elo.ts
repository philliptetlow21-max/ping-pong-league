import { Match } from "./types";
import { calculateMatchResult } from "./scoring";

interface EloResult {
  ratings: Record<string, number>;
  recentChange: Record<string, number>;
}

export function calculateEloRatings(matches: Match[]): EloResult {
  const ratings: Record<string, number> = {};
  const recentChange: Record<string, number> = {};
  const K = 32;

  // Sort matches chronologically: by year, then match number
  const sorted = [...matches].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.matchNumber - b.matchNumber;
  });

  for (const match of sorted) {
    const result = calculateMatchResult(match);
    if (!result) continue;

    const { winner, loser } = result;

    // Initialize players at 1000 if not seen before
    if (!(winner in ratings)) ratings[winner] = 1000;
    if (!(loser in ratings)) ratings[loser] = 1000;

    const rW = ratings[winner];
    const rL = ratings[loser];

    const expectedW = 1 / (1 + Math.pow(10, (rL - rW) / 400));
    const expectedL = 1 - expectedW;

    // 2-0 win: full score (1.0 vs 0.0)
    // 2-1 TB win: partial credit (0.75 vs 0.25)
    const isTiebreaker = result.scoreline.includes("TB");
    const scoreW = isTiebreaker ? 0.75 : 1.0;
    const scoreL = isTiebreaker ? 0.25 : 0.0;

    const deltaW = Math.round(K * (scoreW - expectedW));
    const deltaL = Math.round(K * (scoreL - expectedL));

    ratings[winner] = rW + deltaW;
    ratings[loser] = rL + deltaL;

    recentChange[winner] = deltaW;
    recentChange[loser] = deltaL;
  }

  return { ratings, recentChange };
}
