import { useEffect, useRef } from 'react'
import { useGameStore } from './store'
import { getUnlockedTier } from './data'
import { Garage } from './Garage'
import { Race } from './Race'
import { Shop } from './Shop'

function formatCash(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.floor(n)}`
}

export function App() {
  const { view, setView, cash, rep, tickIdleIncome, crewMembers } = useGameStore()
  const lastTickRef = useRef(Date.now())

  // Idle income loop
  useEffect(() => {
    if (crewMembers.length === 0) return
    const interval = setInterval(() => {
      const now = Date.now()
      const delta = (now - lastTickRef.current) / 1000
      lastTickRef.current = now
      tickIdleIncome(delta)
    }, 1000)
    lastTickRef.current = Date.now()
    return () => clearInterval(interval)
  }, [crewMembers.length, tickIdleIncome])

  const tier = getUnlockedTier(rep)

  return (
    <div className="app">
      {/* HUD Bar */}
      <header className="hud">
        <div className="hud-title">STREET RACER</div>
        <div className="hud-stats">
          <span className="hud-cash">{formatCash(cash)}</span>
          <span className="hud-rep">{rep.toLocaleString()} REP</span>
          <span className="hud-tier">TIER {tier}</span>
        </div>
        <nav className="hud-nav">
          <button className={`nav-btn ${view === 'garage' ? 'active' : ''}`} onClick={() => setView('garage')}>GARAGE</button>
          <button className={`nav-btn ${view === 'race' ? 'active' : ''}`} onClick={() => setView('race')}>RACE</button>
          <button className={`nav-btn ${view === 'shop' ? 'active' : ''}`} onClick={() => setView('shop')}>SHOP</button>
        </nav>
      </header>

      {/* Views */}
      <main className="main-view">
        {view === 'garage' && <Garage />}
        {view === 'race' && <Race />}
        {view === 'shop' && <Shop />}
      </main>
    </div>
  )
}
