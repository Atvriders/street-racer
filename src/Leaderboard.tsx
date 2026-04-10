import { useGameStore } from './store'
import type { LeaderboardEntry } from './types'
import './Leaderboard.css'

const LEADERBOARD_KEY = 'street_racer_leaderboard'

function readLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function formatCash(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.floor(n)}`
}

export function Leaderboard() {
  const username = useGameStore(s => s.username)
  const entries = readLeaderboard().sort((a, b) => b.rep - a.rep)

  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">LEADERBOARD</h2>
      {entries.length === 0 ? (
        <div className="leaderboard-empty">
          <p>No entries yet. Win a race to appear here.</p>
        </div>
      ) : (
        <div className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>DRIVER</th>
                <th>REP</th>
                <th>RACES WON</th>
                <th>EARNINGS</th>
                <th>TOP TIER</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.username}
                  className={entry.username === username ? 'lb-row lb-row--current' : 'lb-row'}
                >
                  <td className="lb-rank">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </td>
                  <td className="lb-username">
                    {entry.username}
                    {entry.username === username && <span className="lb-you"> YOU</span>}
                  </td>
                  <td className="lb-rep">{entry.rep.toLocaleString()}</td>
                  <td className="lb-wins">{entry.totalRacesWon}</td>
                  <td className="lb-cash">{formatCash(entry.totalCashEarned)}</td>
                  <td className="lb-tier">
                    <span className={`lb-tier-badge tier-${entry.topTier.toLowerCase()}`}>
                      {entry.topTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="leaderboard-note">Local leaderboard — all drivers on this device</p>
    </div>
  )
}
