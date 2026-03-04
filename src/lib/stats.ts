import { Match, PlayerStats } from "./types";
import { calculateMatchResult, buildLeagueTable, getAvailableYears } from "./scoring";

export function calculatePlayerStats(
  matches: Match[],
  player: string
): PlayerStats {
  const playerMatches = matches.filter(
    (m) => m.player1 === player || m.player2 === player
  );

  let totalWins = 0;
  let totalLosses = 0;
  let tiebreakersPlayed = 0;
  let tiebreakersWon = 0;
  let currentStreak = 0;
  let longestWinStreak = 0;

  // Sort by year then match number for streak calculation
  const sorted = [...playerMatches].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.matchNumber - b.matchNumber;
  });

  for (const match of sorted) {
    const result = calculateMatchResult(match);
    if (!result) continue;
    if (result.winner === player) {
      totalWins++;
      currentStreak++;
      longestWinStreak = Math.max(longestWinStreak, currentStreak);
    } else {
      totalLosses++;
      currentStreak = 0;
    }

    if (result.tiebreaker) {
      tiebreakersPlayed++;
      if (result.winner === player) tiebreakersWon++;
    }
  }

  const totalMatches = totalWins + totalLosses;
  const winPercentage =
    totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  // Best/worst year
  const years = getAvailableYears(matches);
  let bestYear: { year: number; points: number } | null = null;
  let worstYear: { year: number; points: number } | null = null;
  const yearsPlayed: number[] = [];

  for (const year of years) {
    const table = buildLeagueTable(matches, year);
    const standing = table.find((s) => s.player === player);
    if (!standing || standing.played === 0) continue;

    yearsPlayed.push(year);

    if (!bestYear || standing.points > bestYear.points) {
      bestYear = { year, points: standing.points };
    }
    if (!worstYear || standing.points < worstYear.points) {
      worstYear = { year, points: standing.points };
    }
  }

  return {
    player,
    totalMatches,
    totalWins,
    totalLosses,
    winPercentage,
    tiebreakersPlayed,
    tiebreakersWon,
    bestYear,
    worstYear,
    longestWinStreak,
    yearsPlayed,
  };
}
