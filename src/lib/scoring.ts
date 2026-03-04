import { Match, MatchResult, GameResult, Standing } from "./types";

export function parseMatch(row: string[]): Match | null {
  if (!row[0] || !row[2] || !row[3]) return null;

  return {
    year: parseInt(row[0]),
    matchNumber: parseInt(row[1]) || 0,
    player1: row[2],
    player2: row[3],
    p1Game1: row[4] ? parseInt(row[4]) : null,
    p2Game1: row[5] ? parseInt(row[5]) : null,
    p1Game2: row[6] ? parseInt(row[6]) : null,
    p2Game2: row[7] ? parseInt(row[7]) : null,
    p1Tiebreaker: row[8] ? parseInt(row[8]) : null,
    p2Tiebreaker: row[9] ? parseInt(row[9]) : null,
  };
}

export function isMatchComplete(match: Match): boolean {
  return (
    match.p1Game1 !== null &&
    match.p2Game1 !== null &&
    match.p1Game2 !== null &&
    match.p2Game2 !== null
  );
}

function getGameWinner(
  p1Score: number,
  p2Score: number,
  player1: string,
  player2: string
): GameResult {
  return {
    player1Score: p1Score,
    player2Score: p2Score,
    winner: p1Score > p2Score ? player1 : player2,
  };
}

export function calculateMatchResult(match: Match): MatchResult | null {
  if (!isMatchComplete(match)) return null;

  const games: GameResult[] = [];

  const game1 = getGameWinner(
    match.p1Game1!,
    match.p2Game1!,
    match.player1,
    match.player2
  );
  games.push(game1);

  const game2 = getGameWinner(
    match.p1Game2!,
    match.p2Game2!,
    match.player1,
    match.player2
  );
  games.push(game2);

  let tiebreaker: GameResult | null = null;
  const game1Winner = game1.winner;
  const game2Winner = game2.winner;

  if (game1Winner === game2Winner) {
    // 2-0 win
    const winner = game1Winner;
    const loser = winner === match.player1 ? match.player2 : match.player1;
    return {
      match,
      winner,
      loser,
      winnerPoints: 4,
      loserPoints: 0,
      scoreline: "2-0",
      games,
      tiebreaker: null,
    };
  }

  // 1-1, need tiebreaker
  if (match.p1Tiebreaker !== null && match.p2Tiebreaker !== null) {
    tiebreaker = getGameWinner(
      match.p1Tiebreaker,
      match.p2Tiebreaker,
      match.player1,
      match.player2
    );
    const winner = tiebreaker.winner;
    const loser = winner === match.player1 ? match.player2 : match.player1;
    return {
      match,
      winner,
      loser,
      winnerPoints: 3,
      loserPoints: 1,
      scoreline: "2-1 (TB)",
      games,
      tiebreaker,
    };
  }

  // Tiebreaker not yet played — match in progress
  return null;
}

export function buildLeagueTable(
  matches: Match[],
  year: number
): Standing[] {
  const yearMatches = matches.filter((m) => m.year === year);
  const standings: Record<string, Standing> = {};

  // Initialize all players who appear in matches
  for (const match of yearMatches) {
    for (const player of [match.player1, match.player2]) {
      if (!standings[player]) {
        standings[player] = {
          player,
          played: 0,
          won: 0,
          lost: 0,
          points: 0,
          gamesWon: 0,
          gamesLost: 0,
        };
      }
    }
  }

  for (const match of yearMatches) {
    const result = calculateMatchResult(match);
    if (!result) continue;

    const winnerStanding = standings[result.winner];
    const loserStanding = standings[result.loser];

    winnerStanding.played++;
    winnerStanding.won++;
    winnerStanding.points += result.winnerPoints;

    loserStanding.played++;
    loserStanding.lost++;
    loserStanding.points += result.loserPoints;

    // Count games won/lost
    for (const game of result.games) {
      if (game.winner === result.winner) {
        winnerStanding.gamesWon++;
        loserStanding.gamesLost++;
      } else {
        loserStanding.gamesWon++;
        winnerStanding.gamesLost++;
      }
    }
    if (result.tiebreaker) {
      if (result.tiebreaker.winner === result.winner) {
        winnerStanding.gamesWon++;
        loserStanding.gamesLost++;
      } else {
        loserStanding.gamesWon++;
        winnerStanding.gamesLost++;
      }
    }
  }

  return Object.values(standings).sort((a, b) => {
    // Sort by points
    if (b.points !== a.points) return b.points - a.points;
    // Tiebreaker: game difference
    const aDiff = a.gamesWon - a.gamesLost;
    const bDiff = b.gamesWon - b.gamesLost;
    if (bDiff !== aDiff) return bDiff - aDiff;
    // Then by games won
    return b.gamesWon - a.gamesWon;
  });
}

export function getAvailableYears(matches: Match[]): number[] {
  const years = Array.from(new Set(matches.map((m) => m.year)));
  return years.sort((a, b) => b - a);
}
