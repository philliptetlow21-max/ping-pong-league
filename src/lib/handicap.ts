import { Match, HeadToHeadRecord } from "./types";
import { calculateMatchResult } from "./scoring";

export function calculateHandicap(
  matches: Match[],
  player1: string,
  player2: string
): HeadToHeadRecord {
  // Find all matches between these two players (in any order)
  const h2hMatches = matches.filter(
    (m) =>
      (m.player1 === player1 && m.player2 === player2) ||
      (m.player1 === player2 && m.player2 === player1)
  );

  let p1Wins = 0;
  let p2Wins = 0;
  let totalPointDiff = 0;
  let totalGames = 0;
  const results = [];
  const yearMap: Record<number, { p1Wins: number; p2Wins: number }> = {};

  for (const match of h2hMatches) {
    const result = calculateMatchResult(match);
    if (!result) continue;

    results.push(result);

    if (result.winner === player1) p1Wins++;
    else p2Wins++;

    if (!yearMap[match.year]) {
      yearMap[match.year] = { p1Wins: 0, p2Wins: 0 };
    }
    if (result.winner === player1) yearMap[match.year].p1Wins++;
    else yearMap[match.year].p2Wins++;

    // Calculate point differences per game for handicap
    for (const game of result.games) {
      const p1Score =
        match.player1 === player1
          ? game.player1Score
          : game.player2Score;
      const p2Score =
        match.player1 === player1
          ? game.player2Score
          : game.player1Score;
      totalPointDiff += p1Score - p2Score;
      totalGames++;
    }
    if (result.tiebreaker) {
      const p1Score =
        match.player1 === player1
          ? result.tiebreaker.player1Score
          : result.tiebreaker.player2Score;
      const p2Score =
        match.player1 === player1
          ? result.tiebreaker.player2Score
          : result.tiebreaker.player1Score;
      totalPointDiff += p1Score - p2Score;
      totalGames++;
    }
  }

  // Handicap = floor(avg point diff per game / 2)
  const avgDiff = totalGames > 0 ? totalPointDiff / totalGames : 0;
  const handicap = Math.floor(Math.abs(avgDiff) / 2);

  // The weaker player (lower avg) gets the head start
  const handicapFavour =
    avgDiff > 0 ? player2 : avgDiff < 0 ? player1 : "";

  const byYear = Object.entries(yearMap)
    .map(([year, record]) => ({
      year: parseInt(year),
      p1Wins: record.p1Wins,
      p2Wins: record.p2Wins,
    }))
    .sort((a, b) => b.year - a.year);

  return {
    player1,
    player2,
    player1Wins: p1Wins,
    player2Wins: p2Wins,
    matches: results,
    byYear,
    handicap,
    handicapFavour,
  };
}
