import { useState, useRef, useCallback, useEffect } from 'react'
import { useGameStore, getEffectiveStats } from './store'
import { RACE_TIERS, CARS, getUnlockedTier, tierRank } from './data'
import { CarSilhouette } from './CarSilhouette'
import { Tachometer } from './Tachometer'
import type { RaceTier, CarId, OwnedCar, PartSlot, CosmeticSlot } from './types'
import './Race.css'

type RacePhase = 'select' | 'countdown' | 'racing' | 'finished'

interface RaceState {
  phase: RacePhase
  raceTier: RaceTier | null
  playerPos: number
  opponentPos: number
  rpm: number
  gear: number
  speed: number
  nosActive: boolean
  nosTimeLeft: number
  nosUsed: number
  maxNos: number
  perfectShifts: number
  totalShifts: number
  countdown: number
  result: 'win' | 'lose' | null
  cashEarned: number
  repEarned: number
  opponentCarId: CarId | null
}

const MAX_RPM = 9000
const SHIFT_ZONE_START = 0.65
const SHIFT_ZONE_END = 0.82
const GEARS = 6
const NOS_DURATION = 3

function getGearSpeedMultiplier(gear: number): number {
  return 0.5 + gear * 0.18
}

export function Race() {
  const { cars, selectedCarUid, cash, rep, addCash, addRep, recordWin } = useGameStore()
  const selectedCar = cars.find(c => c.uid === selectedCarUid)
  const currentTier = getUnlockedTier(rep)

  const [state, setState] = useState<RaceState>({
    phase: 'select',
    raceTier: null,
    playerPos: 0,
    opponentPos: 0,
    rpm: 0,
    gear: 1,
    speed: 0,
    nosActive: false,
    nosTimeLeft: 0,
    nosUsed: 0,
    maxNos: 0,
    perfectShifts: 0,
    totalShifts: 0,
    countdown: 3,
    result: null,
    cashEarned: 0,
    repEarned: 0,
    opponentCarId: null,
  })

  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const clickAccumRef = useRef<number>(0)
  const bogDownUntilRef = useRef<number>(0)
  const opponentSpeedRef = useRef<number>(0)
  const stateRef = useRef(state)
  stateRef.current = state

  const [wager, setWager] = useState(0)
  const canWager = tierRank(currentTier) >= tierRank('B')

  const startRace = useCallback((raceTier: RaceTier) => {
    if (!selectedCar) return
    const stats = getEffectiveStats(selectedCar)
    const tierDef = RACE_TIERS.find(t => t.id === raceTier)!
    const baseSpeed = tierDef.opponentSpeed
    const variance = (Math.random() * 2 - 1) * tierDef.variance
    opponentSpeedRef.current = baseSpeed + variance
    clickAccumRef.current = 0
    bogDownUntilRef.current = 0

    // Pick a random opponent car from the matching tier
    const tierCars = CARS.filter(c => c.tier === tierDef.requiredTier)
    const opponentDef = tierCars[Math.floor(Math.random() * tierCars.length)]
    const opponentCarId: CarId = (opponentDef ?? CARS[0]!).id

    setState({
      phase: 'countdown',
      raceTier,
      playerPos: 0,
      opponentPos: 0,
      rpm: 0,
      gear: 1,
      speed: 0,
      nosActive: false,
      nosTimeLeft: 0,
      nosUsed: 0,
      maxNos: stats.nosCapacity,
      perfectShifts: 0,
      totalShifts: 0,
      countdown: 3,
      result: null,
      cashEarned: 0,
      repEarned: 0,
      opponentCarId,
    })
  }, [selectedCar])

  // Build a fake OwnedCar for the opponent so CarSilhouette can render it
  const buildOpponentCar = useCallback((carId: CarId, raceTier: RaceTier): OwnedCar => {
    // Upgrade range per race tier
    const ranges: Record<RaceTier, [number, number]> = {
      street:   [0, 1],
      highway:  [1, 2],
      circuit:  [2, 3],
      midnight: [3, 4],
    }
    const [lo, hi] = ranges[raceTier]
    const randLevel = () => lo + Math.floor(Math.random() * (hi - lo + 1))

    const partSlots: PartSlot[] = [
      'engine', 'turbo', 'exhaust', 'suspension', 'tires', 'nos', 'weight', 'transmission',
      'intercooler', 'ecu', 'clutch', 'rollcage', 'brakes', 'intake', 'headers', 'flywheel', 'fuel', 'diff',
    ]
    const cosmeticSlots: CosmeticSlot[] = [
      'paint', 'wheels', 'bodykit', 'spoiler', 'underglow', 'tint',
      'hood', 'exhaust_tip', 'decals', 'mirrors', 'seats', 'roll_bar',
    ]

    const parts = Object.fromEntries(partSlots.map(s => [s, randLevel()])) as Record<PartSlot, number>
    const cosmetics = Object.fromEntries(cosmeticSlots.map(s => [s, randLevel()])) as Record<CosmeticSlot, number>

    return { uid: 'opponent', carId, parts, cosmetics }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (state.phase !== 'countdown') return
    if (state.countdown <= 0) {
      setState(s => ({ ...s, phase: 'racing' }))
      lastTimeRef.current = performance.now()
      return
    }
    const timer = setTimeout(() => {
      setState(s => ({ ...s, countdown: s.countdown - 1 }))
    }, 1000)
    return () => clearTimeout(timer)
  }, [state.phase, state.countdown])

  // Main race loop
  useEffect(() => {
    if (state.phase !== 'racing') return
    if (!selectedCar) return

    const stats = getEffectiveStats(selectedCar)
    const powerFactor = stats.power / 500
    const weightFactor = 1500 / Math.max(stats.weight, 500)

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now
      const s = stateRef.current

      if (s.phase !== 'racing') return

      const clicks = clickAccumRef.current
      clickAccumRef.current = 0

      const isBoggedDown = now < bogDownUntilRef.current
      let newRpm = s.rpm

      if (isBoggedDown) {
        newRpm = Math.max(newRpm - 3000 * dt, 1000)
      } else {
        const clickBoost = clicks * (800 / (1 + clicks * 0.15))
        newRpm += clickBoost
        newRpm -= 2000 * dt
      }

      if (newRpm > MAX_RPM) newRpm = MAX_RPM
      if (newRpm < 0) newRpm = 0

      const gearMult = getGearSpeedMultiplier(s.gear)
      const rpmFraction = newRpm / MAX_RPM
      let newSpeed = rpmFraction * gearMult * powerFactor * weightFactor * 0.08

      let nosActive = s.nosActive
      let nosTimeLeft = s.nosTimeLeft
      if (nosActive) {
        nosTimeLeft -= dt
        const nosGearMult = s.gear >= 5 ? 2.0 : s.gear >= 3 ? 1.4 : 0.8
        newSpeed *= (1 + 0.5 * nosGearMult)
        if (nosTimeLeft <= 0) {
          nosActive = false
          nosTimeLeft = 0
        }
      }

      if (rpmFraction > 0.85) {
        newSpeed *= 0.7
      }

      let playerPos = s.playerPos + newSpeed * dt
      let opponentPos = s.opponentPos + opponentSpeedRef.current * dt

      let result = s.result
      let cashEarned = s.cashEarned
      let repEarned = s.repEarned

      if (playerPos >= 1 || opponentPos >= 1) {
        playerPos = Math.min(playerPos, 1)
        opponentPos = Math.min(opponentPos, 1)

        const tierDef = RACE_TIERS.find(t => t.id === s.raceTier)!
        if (playerPos >= 1 && (playerPos >= opponentPos)) {
          result = 'win'
          const styleMultiplier = 1 + (stats.style / 200)
          const shiftBonus = s.totalShifts > 0 ? (s.perfectShifts / s.totalShifts) : 0
          cashEarned = Math.floor(tierDef.baseCashReward * (1 + shiftBonus * 0.5))
          repEarned = Math.floor(tierDef.baseRepReward * styleMultiplier)
          if (wager > 0) cashEarned += wager * 2
          addCash(cashEarned)
          addRep(repEarned)
          recordWin(cashEarned)
        } else {
          result = 'lose'
          cashEarned = Math.floor(tierDef.baseCashReward * 0.2)
          if (wager > 0) cashEarned = 0
          else addCash(cashEarned)
          repEarned = 0
        }
      }

      setState(prev => ({
        ...prev,
        rpm: newRpm,
        speed: newSpeed,
        playerPos,
        opponentPos,
        nosActive,
        nosTimeLeft,
        result,
        cashEarned,
        repEarned,
        phase: result ? 'finished' : 'racing',
      }))

      if (!result) {
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [state.phase, selectedCar, addCash, addRep, recordWin, wager])

  const handleThrottleClick = useCallback(() => {
    if (stateRef.current.phase !== 'racing') return
    clickAccumRef.current++
  }, [])

  const handleShift = useCallback(() => {
    if (stateRef.current.phase !== 'racing') return
    const s = stateRef.current
    if (s.gear >= GEARS) return

    const rpmFraction = s.rpm / MAX_RPM
    const isPerfect = rpmFraction >= SHIFT_ZONE_START && rpmFraction <= SHIFT_ZONE_END

    setState(prev => ({
      ...prev,
      gear: prev.gear + 1,
      rpm: prev.rpm * 0.45,
      perfectShifts: prev.perfectShifts + (isPerfect ? 1 : 0),
      totalShifts: prev.totalShifts + 1,
    }))

    if (!isPerfect) {
      bogDownUntilRef.current = performance.now() + 1000
    }
  }, [])

  const handleNos = useCallback(() => {
    const s = stateRef.current
    if (s.phase !== 'racing') return
    if (s.nosActive) return
    if (s.nosUsed >= s.maxNos) return

    setState(prev => ({
      ...prev,
      nosActive: true,
      nosTimeLeft: NOS_DURATION,
      nosUsed: prev.nosUsed + 1,
    }))
  }, [])

  const backToSelect = useCallback(() => {
    setWager(0)
    setState(s => ({ ...s, phase: 'select', raceTier: null, result: null }))
  }, [])

  if (!selectedCar) {
    return (
      <div className="race-empty">
        <p>Select a car in the Garage first.</p>
      </div>
    )
  }

  if (state.phase === 'select') {
    return (
      <div className="race-select">
        <h2 className="race-title">CHOOSE YOUR RACE</h2>
        {canWager && (
          <div className="wager-section">
            <span className="wager-label">WAGER:</span>
            <input
              type="number"
              className="wager-input"
              min={0}
              max={cash}
              value={wager}
              onChange={e => setWager(Math.min(Number(e.target.value) || 0, cash))}
            />
          </div>
        )}
        <div className="race-tier-grid">
          {RACE_TIERS.map(tier => {
            const locked = tierRank(currentTier) < tierRank(tier.requiredTier)
            return (
              <button
                key={tier.id}
                className={`race-tier-card ${locked ? 'locked' : ''}`}
                onClick={() => !locked && startRace(tier.id)}
                disabled={locked}
              >
                <div className="tier-name">{tier.name}</div>
                <div className="tier-reward">{tier.baseCashReward.toLocaleString()} cash</div>
                <div className="tier-reward">{tier.baseRepReward} rep</div>
                {locked && <div className="tier-lock">TIER {tier.requiredTier} REQUIRED</div>}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const opponentDef = state.opponentCarId ? CARS.find(c => c.id === state.opponentCarId) : null
  const opponentCar = state.opponentCarId && state.raceTier
    ? buildOpponentCar(state.opponentCarId, state.raceTier)
    : null

  if (state.phase === 'countdown') {
    return (
      <div className="race-countdown">
        <div className="countdown-number">{state.countdown > 0 ? state.countdown : 'GO!'}</div>
        {opponentDef && (
          <div className="opponent-name">VS: {opponentDef.name}</div>
        )}
      </div>
    )
  }

  if (state.phase === 'finished') {
    return (
      <div className="race-result">
        <div className={`result-banner ${state.result}`}>
          {state.result === 'win' ? 'YOU WIN!' : 'YOU LOSE'}
        </div>
        {opponentDef && (
          <div className="opponent-name">vs {opponentDef.name}</div>
        )}
        {state.result === 'win' && (
          <div className="result-rewards">
            <span className="reward-cash">+${state.cashEarned.toLocaleString()}</span>
            <span className="reward-rep">+{state.repEarned} REP</span>
            <span className="reward-shifts">{state.perfectShifts}/{state.totalShifts} perfect shifts</span>
          </div>
        )}
        {state.result === 'lose' && state.cashEarned > 0 && (
          <div className="result-rewards">
            <span className="reward-cash consolation">+${state.cashEarned.toLocaleString()} consolation</span>
          </div>
        )}
        <button className="race-again-btn" onClick={backToSelect}>RACE AGAIN</button>
      </div>
    )
  }

  return (
    <div className="race-strip" onClick={handleThrottleClick}>
      <div className="parallax-sky" style={{ backgroundPositionX: `${-state.playerPos * 200}px` }} />
      <div className="parallax-city" style={{ backgroundPositionX: `${-state.playerPos * 600}px` }} />
      <div className="parallax-road">
        <div className="road-lines" style={{ backgroundPositionX: `${-state.playerPos * 2000}px` }} />
        <div className="race-car opponent" style={{ left: `${state.opponentPos * 70 + 5}%` }}>
          {opponentCar
            ? <CarSilhouette car={opponentCar} width={100} />
            : <div style={{ width: 100, height: 40, background: '#333', borderRadius: '8px 20px 4px 4px', opacity: 0.6 }} />
          }
        </div>
        <div className="race-car player" style={{ left: `${state.playerPos * 70 + 5}%` }}>
          <CarSilhouette car={selectedCar} width={120} glowing />
          {state.nosActive && <div className="nos-flame" />}
        </div>
      </div>
      <div className="race-hud">
        <Tachometer
          rpm={state.rpm}
          maxRpm={MAX_RPM}
          gear={state.gear}
          shiftZoneStart={SHIFT_ZONE_START}
          shiftZoneEnd={SHIFT_ZONE_END}
        />
        <div className="race-buttons">
          <button
            className={`shift-btn ${state.rpm / MAX_RPM >= SHIFT_ZONE_START && state.rpm / MAX_RPM <= SHIFT_ZONE_END ? 'in-zone' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleShift() }}
            disabled={state.gear >= GEARS}
          >
            SHIFT
          </button>
          <button
            className={`nos-btn ${state.nosActive ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleNos() }}
            disabled={state.nosUsed >= state.maxNos || state.nosActive}
          >
            NOS ({state.maxNos - state.nosUsed})
          </button>
        </div>
      </div>
      <div className="race-speed">{Math.round(state.speed * 1500)} MPH</div>
    </div>
  )
}
