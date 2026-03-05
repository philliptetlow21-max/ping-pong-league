export default function RulesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">How It Works</h1>

      <div className="space-y-4">
        {/* Match Format */}
        <section className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Match Format</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Each match consists of <strong className="text-white">2 games</strong>, played to <strong className="text-white">21 points</strong>.</li>
            <li>If the players split 1-1, a <strong className="text-white">tiebreaker game</strong> is played to decide the match.</li>
            <li>Every player plays every other player multiple times per season.</li>
          </ul>
        </section>

        {/* League Points */}
        <section className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h2 className="text-lg font-semibold text-white mb-3">League Points</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full">2-0</span>
              <span className="text-gray-300">Winner gets <strong className="text-white">4 pts</strong>, loser gets <strong className="text-white">0 pts</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full">2-1 (TB)</span>
              <span className="text-gray-300">Winner gets <strong className="text-white">3 pts</strong>, loser gets <strong className="text-white">1 pt</strong></span>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Taking a match to a tiebreaker rewards the loser with a consolation point.
          </p>
        </section>

        {/* Handicaps */}
        <section className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Handicaps</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Handicaps are calculated from <strong className="text-white">all prior years&apos;</strong> head-to-head results between two players.</li>
            <li>The average point difference per game is calculated, then halved and rounded down.</li>
            <li>The weaker player (based on historical average) starts each game with that many points as a head start.</li>
            <li>Handicaps only apply if there is prior year data — new matchups start at 0-0.</li>
          </ul>
        </section>

        {/* Standings */}
        <section className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Standings</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Players are ranked by <strong className="text-white">total league points</strong>.</li>
            <li>If points are tied, <strong className="text-white">game difference</strong> (games won minus games lost) breaks the tie.</li>
            <li>If still tied, <strong className="text-white">total games won</strong> is used as a final tiebreaker.</li>
          </ul>
        </section>

        {/* Power Rankings */}
        <section className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Power Rankings (Elo)</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Every player starts with an <strong className="text-white">Elo rating of 1000</strong>.</li>
            <li>After each match, ratings are adjusted based on the result and the expected outcome.</li>
            <li>Beating a higher-rated player earns more points; losing to a lower-rated player costs more.</li>
            <li>A <strong className="text-white">2-0 win</strong> counts as a full result. A <strong className="text-white">2-1 tiebreaker win</strong> gives partial credit to the loser, so ratings move less dramatically.</li>
            <li>Elo ratings span all years — they reflect your entire career form, not just the current season.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
