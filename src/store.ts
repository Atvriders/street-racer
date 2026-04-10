import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, OwnedCar, PartSlot, CosmeticSlot, CarId, View, CarStats, LeaderboardEntry } from './types'
import { CARS, PARTS, COSMETICS, GARAGE_SLOT_COSTS, CREW, getPartCost, getCosmeticCost, getUnlockedTier } from './data'

const LEADERBOARD_KEY = 'street_racer_leaderboard'

function readLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries))
  } catch {
    // ignore storage errors
  }
}

function makeDefaultParts(): Record<PartSlot, number> {
  return {
    engine: 0, turbo: 0, exhaust: 0, suspension: 0, tires: 0, nos: 0, weight: 0, transmission: 0,
    intercooler: 0, ecu: 0, clutch: 0, rollcage: 0, brakes: 0, intake: 0, headers: 0, flywheel: 0, fuel: 0, diff: 0,
  }
}

function makeDefaultCosmetics(): Record<CosmeticSlot, number> {
  return {
    paint: 0, wheels: 0, bodykit: 0, spoiler: 0, underglow: 0, tint: 0,
    hood: 0, exhaust_tip: 0, decals: 0, mirrors: 0, seats: 0, roll_bar: 0,
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function createOwnedCar(carId: CarId): OwnedCar {
  return {
    uid: generateId(),
    carId,
    parts: makeDefaultParts(),
    cosmetics: makeDefaultCosmetics(),
  }
}

export function getEffectiveStats(car: OwnedCar): CarStats {
  const def = CARS.find(c => c.id === car.carId)!
  const stats = { ...def.baseStats }
  for (const part of PARTS) {
    const level = car.parts[part.slot]
    if (level > 0) {
      for (const [key, boost] of Object.entries(part.statBoosts)) {
        stats[key as keyof CarStats] += (boost as number) * level
      }
    }
  }
  // Style from cosmetics
  for (const cosmetic of COSMETICS) {
    const level = car.cosmetics[cosmetic.slot]
    if (level > 0) {
      stats.style += cosmetic.stylePerLevel * level
    }
  }
  return stats
}

interface GameActions {
  setView: (view: View) => void
  selectCar: (uid: string) => void
  buyCar: (carId: CarId) => void
  upgradePart: (carUid: string, slot: PartSlot) => void
  upgradeCosmetic: (carUid: string, slot: CosmeticSlot) => void
  buyGarageSlot: () => void
  addCash: (amount: number) => void
  addRep: (amount: number) => void
  buyCrewMember: (crewId: string) => void
  tickIdleIncome: (deltaSeconds: number) => void
  resetGame: () => void
  setUsername: (name: string) => void
  recordWin: (cashEarned: number) => void
}

const INITIAL_CAR = createOwnedCar('civic_eg')

const INITIAL_STATE: GameState = {
  cash: 0,
  rep: 0,
  garageSlots: 2,
  cars: [INITIAL_CAR],
  selectedCarUid: INITIAL_CAR.uid,
  crewMembers: [],
  view: 'garage',
  username: '',
  totalRacesWon: 0,
  totalCashEarned: 0,
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setView: (view) => set({ view }),

      selectCar: (uid) => set({ selectedCarUid: uid }),

      buyCar: (carId) => set((state) => {
        const def = CARS.find(c => c.id === carId)
        if (!def) return state
        if (state.cash < def.price) return state
        if (state.cars.length >= state.garageSlots) return state
        if (state.cars.some(c => c.carId === carId)) return state
        const newCar = createOwnedCar(carId)
        return {
          cash: state.cash - def.price,
          cars: [...state.cars, newCar],
          selectedCarUid: newCar.uid,
        }
      }),

      upgradePart: (carUid, slot) => set((state) => {
        const carIndex = state.cars.findIndex(c => c.uid === carUid)
        if (carIndex === -1) return state
        const car = state.cars[carIndex]!
        const currentLevel = car.parts[slot]
        if (currentLevel >= 5) return state
        const partDef = PARTS.find(p => p.slot === slot)!
        const cost = getPartCost(partDef, currentLevel + 1)
        if (state.cash < cost) return state
        const updated = [...state.cars]
        updated[carIndex] = {
          ...car,
          parts: { ...car.parts, [slot]: currentLevel + 1 },
        }
        return { cash: state.cash - cost, cars: updated }
      }),

      upgradeCosmetic: (carUid, slot) => set((state) => {
        const carIndex = state.cars.findIndex(c => c.uid === carUid)
        if (carIndex === -1) return state
        const car = state.cars[carIndex]!
        const currentLevel = car.cosmetics[slot]
        if (currentLevel >= 5) return state
        const cosmeticDef = COSMETICS.find(c => c.slot === slot)!
        const cost = getCosmeticCost(cosmeticDef, currentLevel + 1)
        if (state.cash < cost) return state
        const updated = [...state.cars]
        updated[carIndex] = {
          ...car,
          cosmetics: { ...car.cosmetics, [slot]: currentLevel + 1 },
        }
        return { cash: state.cash - cost, cars: updated }
      }),

      buyGarageSlot: () => set((state) => {
        if (state.garageSlots >= 12) return state
        const cost = GARAGE_SLOT_COSTS[state.garageSlots] ?? 10_000_000
        if (state.cash < cost) return state
        return { cash: state.cash - cost, garageSlots: state.garageSlots + 1 }
      }),

      addCash: (amount) => set((state) => ({ cash: state.cash + amount })),

      addRep: (amount) => set((state) => ({ rep: state.rep + amount })),

      buyCrewMember: (crewId) => set((state) => {
        if (state.crewMembers.includes(crewId)) return state
        const crew = CREW.find(c => c.id === crewId)
        if (!crew) return state
        if (state.cash < crew.cost) return state
        return { cash: state.cash - crew.cost, crewMembers: [...state.crewMembers, crewId] }
      }),

      tickIdleIncome: (deltaSeconds) => set((state) => {
        if (state.crewMembers.length === 0) return state
        let income = 0
        for (const id of state.crewMembers) {
          const crew = CREW.find(c => c.id === id)
          if (crew) income += crew.cashPerSecond * deltaSeconds
        }
        return { cash: state.cash + income }
      }),

      resetGame: () => set(() => {
        const car = createOwnedCar('civic_eg')
        return { ...INITIAL_STATE, cars: [car], selectedCarUid: car.uid }
      }),

      setUsername: (name) => set({ username: name }),

      recordWin: (cashEarned) => set((state) => {
        const newTotalRacesWon = state.totalRacesWon + 1
        const newTotalCashEarned = state.totalCashEarned + cashEarned
        const topTier = getUnlockedTier(state.rep)

        if (state.username) {
          const entries = readLeaderboard()
          const idx = entries.findIndex(e => e.username === state.username)
          const entry: LeaderboardEntry = {
            username: state.username,
            rep: state.rep,
            totalCashEarned: newTotalCashEarned,
            totalRacesWon: newTotalRacesWon,
            topTier,
            lastUpdated: Date.now(),
          }
          if (idx >= 0) {
            entries[idx] = entry
          } else {
            entries.push(entry)
          }
          writeLeaderboard(entries)
        }

        return { totalRacesWon: newTotalRacesWon, totalCashEarned: newTotalCashEarned }
      }),
    }),
    { name: 'street_racer_save' }
  )
)
