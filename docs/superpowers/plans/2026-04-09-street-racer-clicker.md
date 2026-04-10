# Street Racer Clicker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a street racing clicker game where players race to earn cash, collect JDM cars, and upgrade them through increasingly difficult tiers.

**Architecture:** Single-page React app with 3 views (Garage, Race, Shop) controlled by Zustand state. Race engine uses requestAnimationFrame for drag strip animation. All game data persisted to localStorage. CSS/SVG car silhouettes with dynamic mod rendering.

**Tech Stack:** React 18, TypeScript, Vite 5, Zustand (with persist middleware), CSS3 animations, SVG

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config |
| `vite.config.ts` | Vite config |
| `index.html` | HTML shell, font imports |
| `src/main.tsx` | React root mount |
| `src/index.css` | Global styles, CSS variables, fonts, keyframes |
| `src/types.ts` | All TypeScript interfaces and type unions |
| `src/data.ts` | Car definitions, part definitions, race tier configs, cost tables |
| `src/store.ts` | Zustand store: game state, actions, localStorage persist |
| `src/App.tsx` | Top-level layout, nav bar, view switcher, cash/rep HUD |
| `src/Garage.tsx` | Car grid, car selection, idle income display |
| `src/CarSilhouette.tsx` | SVG car rendering with dynamic mods |
| `src/Race.tsx` | Drag strip, parallax background, race loop, controls |
| `src/Tachometer.tsx` | Circular SVG gauge with animated needle |
| `src/Shop.tsx` | Parts, cosmetics, car purchases, garage slot purchases |
| `Dockerfile` | Multi-stage Node build + nginx serve |
| `.github/workflows/docker.yml` | Build and push Docker image |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/App.tsx`

- [ ] **Step 1: Initialize project with package.json**

```json
{
  "name": "street-racer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Street Racer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create src/index.css with Midnight Neon theme**

```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #1a1a26;
  --bg-card-hover: #222233;
  --cyan: #00f0ff;
  --cyan-dim: #00f0ff44;
  --cyan-glow: 0 0 20px #00f0ff66, 0 0 40px #00f0ff22;
  --pink: #ff2d7b;
  --pink-dim: #ff2d7b44;
  --pink-glow: 0 0 20px #ff2d7b66, 0 0 40px #ff2d7b22;
  --green: #00ff88;
  --yellow: #ffcc00;
  --red: #ff3344;
  --text-primary: #e8e8f0;
  --text-secondary: #8888aa;
  --text-dim: #555566;
  --font-display: 'Share Tech Mono', monospace;
  --font-body: 'Rajdhani', sans-serif;
  --border-subtle: 1px solid #ffffff0a;
  --radius: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

/* Asphalt grain texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}

#root {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

button {
  font-family: var(--font-body);
  cursor: pointer;
  border: none;
  outline: none;
}

button:active {
  transform: scale(0.97);
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.6; }
}

@keyframes confetti-fall {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

- [ ] **Step 6: Create src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 7: Create src/App.tsx placeholder**

```tsx
export function App() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cyan)' }}>
        STREET RACER
      </h1>
    </div>
  )
}
```

- [ ] **Step 8: Install dependencies and verify build**

Run:
```bash
cd /home/kasm-user/street-racer && npm install && npx tsc -b --noEmit && npx vite build
```
Expected: Clean install, no type errors, successful build.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: scaffold project with Vite, React, TS, Midnight Neon theme"
```

---

### Task 2: Types & Game Data

**Files:**
- Create: `src/types.ts`
- Create: `src/data.ts`

- [ ] **Step 1: Create src/types.ts**

```ts
export type CarId =
  | 'civic_eg' | 'miata_na' | 'corolla_ae86'
  | 's14_240sx' | 'integra_type_r' | 'eclipse_gsx'
  | 'supra_mk4' | 'silvia_s15' | 'rx7_fd' | 'evo_ix'
  | 'skyline_r34' | 'nsx_na1' | 'z370'
  | 'lfa' | 'gtr_r35' | 'demon' | 'gt3_rs'
  | 'widebody_legend_1' | 'widebody_legend_2' | 'widebody_legend_3'

export type Tier = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS'

export type PartSlot = 'engine' | 'turbo' | 'exhaust' | 'suspension' | 'tires' | 'nos' | 'weight' | 'transmission'

export type CosmeticSlot = 'paint' | 'wheels' | 'bodykit' | 'spoiler' | 'underglow' | 'tint'

export type RaceTier = 'street' | 'highway' | 'circuit' | 'midnight'

export type View = 'garage' | 'race' | 'shop'

export interface CarDefinition {
  id: CarId
  name: string
  year: number
  tier: Tier
  price: number
  baseStats: CarStats
  /** SVG color for the silhouette fill */
  color: string
}

export interface CarStats {
  power: number
  grip: number
  weight: number
  nosCapacity: number
  style: number
}

export interface OwnedCar {
  uid: string
  carId: CarId
  parts: Record<PartSlot, number>   // 0-5 upgrade level
  cosmetics: Record<CosmeticSlot, number> // 0-5 upgrade level
}

export interface PartDefinition {
  slot: PartSlot
  name: string
  /** stat boost per level */
  statBoosts: Partial<CarStats>
  baseCost: number
  costMultiplier: number
}

export interface CosmeticDefinition {
  slot: CosmeticSlot
  name: string
  stylePerLevel: number
  baseCost: number
  costMultiplier: number
}

export interface RaceTierDefinition {
  id: RaceTier
  name: string
  requiredTier: Tier
  baseCashReward: number
  baseRepReward: number
  /** opponent speed as fraction of track per second at baseline */
  opponentSpeed: number
  /** random variance ± this fraction */
  variance: number
}

export interface CrewMember {
  id: string
  name: string
  cashPerSecond: number
  cost: number
}

export interface GameState {
  cash: number
  rep: number
  garageSlots: number
  cars: OwnedCar[]
  selectedCarUid: string | null
  crewMembers: string[]  // crew IDs purchased
  view: View
}
```

- [ ] **Step 2: Create src/data.ts**

```ts
import type { CarDefinition, PartDefinition, CosmeticDefinition, RaceTierDefinition, CrewMember, Tier } from './types'

export const REP_THRESHOLDS: Record<Tier, number> = {
  D: 0,
  C: 500,
  B: 2_000,
  A: 8_000,
  S: 25_000,
  SS: 100_000,
}

export const CARS: CarDefinition[] = [
  // Tier D
  { id: 'civic_eg', name: 'Honda Civic EG', year: 1995, tier: 'D', price: 0, baseStats: { power: 105, grip: 40, weight: 1050, nosCapacity: 1, style: 5 }, color: '#8b9dc3' },
  { id: 'miata_na', name: 'Mazda Miata NA', year: 1993, tier: 'D', price: 3_000, baseStats: { power: 116, grip: 55, weight: 960, nosCapacity: 1, style: 10 }, color: '#cc3333' },
  { id: 'corolla_ae86', name: 'Toyota AE86', year: 1986, tier: 'D', price: 5_000, baseStats: { power: 128, grip: 50, weight: 940, nosCapacity: 1, style: 15 }, color: '#f0f0f0' },
  // Tier C
  { id: 's14_240sx', name: 'Nissan 240SX S14', year: 1997, tier: 'C', price: 15_000, baseStats: { power: 155, grip: 60, weight: 1200, nosCapacity: 2, style: 20 }, color: '#e8d44d' },
  { id: 'integra_type_r', name: 'Acura Integra Type R', year: 1998, tier: 'C', price: 22_000, baseStats: { power: 195, grip: 65, weight: 1080, nosCapacity: 2, style: 25 }, color: '#f5f5dc' },
  { id: 'eclipse_gsx', name: 'Mitsubishi Eclipse GSX', year: 1999, tier: 'C', price: 30_000, baseStats: { power: 210, grip: 55, weight: 1340, nosCapacity: 2, style: 18 }, color: '#2a2a2a' },
  // Tier B
  { id: 'supra_mk4', name: 'Toyota Supra MK4', year: 1994, tier: 'B', price: 60_000, baseStats: { power: 320, grip: 70, weight: 1510, nosCapacity: 3, style: 40 }, color: '#ff6600' },
  { id: 'silvia_s15', name: 'Nissan Silvia S15', year: 2000, tier: 'B', price: 75_000, baseStats: { power: 250, grip: 75, weight: 1240, nosCapacity: 3, style: 45 }, color: '#c0c0c0' },
  { id: 'rx7_fd', name: 'Mazda RX-7 FD', year: 1995, tier: 'B', price: 90_000, baseStats: { power: 276, grip: 80, weight: 1260, nosCapacity: 3, style: 50 }, color: '#ffcc00' },
  { id: 'evo_ix', name: 'Mitsubishi Evo IX', year: 2006, tier: 'B', price: 120_000, baseStats: { power: 286, grip: 85, weight: 1410, nosCapacity: 3, style: 35 }, color: '#0044cc' },
  // Tier A
  { id: 'skyline_r34', name: 'Nissan Skyline R34 GT-R', year: 2002, tier: 'A', price: 200_000, baseStats: { power: 330, grip: 90, weight: 1560, nosCapacity: 4, style: 60 }, color: '#4466bb' },
  { id: 'nsx_na1', name: 'Honda NSX', year: 1999, tier: 'A', price: 300_000, baseStats: { power: 290, grip: 95, weight: 1370, nosCapacity: 4, style: 70 }, color: '#aa0000' },
  { id: 'z370', name: 'Nissan 370Z', year: 2012, tier: 'A', price: 400_000, baseStats: { power: 332, grip: 78, weight: 1496, nosCapacity: 4, style: 55 }, color: '#333333' },
  // Tier S
  { id: 'lfa', name: 'Lexus LFA', year: 2012, tier: 'S', price: 800_000, baseStats: { power: 553, grip: 92, weight: 1480, nosCapacity: 5, style: 85 }, color: '#f0f0ff' },
  { id: 'gtr_r35', name: 'Nissan GT-R R35', year: 2020, tier: 'S', price: 1_200_000, baseStats: { power: 565, grip: 95, weight: 1740, nosCapacity: 5, style: 75 }, color: '#888888' },
  { id: 'demon', name: 'Dodge Demon', year: 2018, tier: 'S', price: 1_500_000, baseStats: { power: 840, grip: 60, weight: 1894, nosCapacity: 5, style: 65 }, color: '#ff2200' },
  { id: 'gt3_rs', name: 'Porsche 911 GT3 RS', year: 2023, tier: 'S', price: 2_000_000, baseStats: { power: 518, grip: 99, weight: 1450, nosCapacity: 5, style: 90 }, color: '#00cc44' },
  // Tier SS
  { id: 'widebody_legend_1', name: 'Midnight Phantom', year: 2026, tier: 'SS', price: 5_000_000, baseStats: { power: 1000, grip: 95, weight: 1300, nosCapacity: 6, style: 100 }, color: '#1a0033' },
  { id: 'widebody_legend_2', name: 'Neon Ronin', year: 2026, tier: 'SS', price: 8_000_000, baseStats: { power: 1100, grip: 90, weight: 1250, nosCapacity: 6, style: 100 }, color: '#00f0ff' },
  { id: 'widebody_legend_3', name: 'Sakura Drift King', year: 2026, tier: 'SS', price: 12_000_000, baseStats: { power: 1200, grip: 98, weight: 1200, nosCapacity: 7, style: 100 }, color: '#ff69b4' },
]

export const PARTS: PartDefinition[] = [
  { slot: 'engine', name: 'Engine Swap', statBoosts: { power: 40 }, baseCost: 2_000, costMultiplier: 2.5 },
  { slot: 'turbo', name: 'Turbo Kit', statBoosts: { power: 60 }, baseCost: 3_000, costMultiplier: 2.8 },
  { slot: 'exhaust', name: 'Exhaust System', statBoosts: { power: 15 }, baseCost: 800, costMultiplier: 2.0 },
  { slot: 'suspension', name: 'Coilovers', statBoosts: { grip: 12 }, baseCost: 1_500, costMultiplier: 2.2 },
  { slot: 'tires', name: 'Racing Tires', statBoosts: { grip: 18 }, baseCost: 1_000, costMultiplier: 2.0 },
  { slot: 'nos', name: 'NOS System', statBoosts: { nosCapacity: 1 }, baseCost: 2_500, costMultiplier: 3.0 },
  { slot: 'weight', name: 'Weight Reduction', statBoosts: { weight: -80 }, baseCost: 1_800, costMultiplier: 2.5 },
  { slot: 'transmission', name: 'Short Throw Trans', statBoosts: { grip: 8, power: 10 }, baseCost: 2_200, costMultiplier: 2.4 },
]

export const COSMETICS: CosmeticDefinition[] = [
  { slot: 'paint', name: 'Paint Job', stylePerLevel: 5, baseCost: 500, costMultiplier: 1.8 },
  { slot: 'wheels', name: 'Aftermarket Wheels', stylePerLevel: 6, baseCost: 800, costMultiplier: 2.0 },
  { slot: 'bodykit', name: 'Body Kit', stylePerLevel: 8, baseCost: 1_200, costMultiplier: 2.2 },
  { slot: 'spoiler', name: 'Rear Spoiler', stylePerLevel: 4, baseCost: 400, costMultiplier: 1.6 },
  { slot: 'underglow', name: 'Underglow', stylePerLevel: 7, baseCost: 600, costMultiplier: 1.5 },
  { slot: 'tint', name: 'Window Tint', stylePerLevel: 3, baseCost: 300, costMultiplier: 1.4 },
]

export const RACE_TIERS: RaceTierDefinition[] = [
  { id: 'street', name: 'Street Race', requiredTier: 'D', baseCashReward: 500, baseRepReward: 10, opponentSpeed: 0.06, variance: 0.008 },
  { id: 'highway', name: 'Highway Run', requiredTier: 'C', baseCashReward: 2_000, baseRepReward: 30, opponentSpeed: 0.08, variance: 0.006 },
  { id: 'circuit', name: 'Circuit Battle', requiredTier: 'B', baseCashReward: 8_000, baseRepReward: 80, opponentSpeed: 0.10, variance: 0.005 },
  { id: 'midnight', name: 'Midnight Touge', requiredTier: 'A', baseCashReward: 25_000, baseRepReward: 200, opponentSpeed: 0.13, variance: 0.004 },
]

export const CREW: CrewMember[] = [
  { id: 'crew_1', name: 'Rookie Runner', cashPerSecond: 2, cost: 5_000 },
  { id: 'crew_2', name: 'Street Hustler', cashPerSecond: 8, cost: 25_000 },
  { id: 'crew_3', name: 'Drift King', cashPerSecond: 25, cost: 100_000 },
  { id: 'crew_4', name: 'Midnight Boss', cashPerSecond: 80, cost: 500_000 },
  { id: 'crew_5', name: 'Legend', cashPerSecond: 250, cost: 2_000_000 },
]

export const GARAGE_SLOT_COSTS = [0, 0, 5_000, 10_000, 25_000, 50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000]

export function getPartCost(part: PartDefinition, level: number): number {
  if (level <= 0) return 0
  return Math.floor(part.baseCost * Math.pow(part.costMultiplier, level - 1))
}

export function getCosmeticCost(cosmetic: CosmeticDefinition, level: number): number {
  if (level <= 0) return 0
  return Math.floor(cosmetic.baseCost * Math.pow(cosmetic.costMultiplier, level - 1))
}

export function getUnlockedTier(rep: number): Tier {
  if (rep >= 100_000) return 'SS'
  if (rep >= 25_000) return 'S'
  if (rep >= 8_000) return 'A'
  if (rep >= 2_000) return 'B'
  if (rep >= 500) return 'C'
  return 'D'
}

export function tierRank(tier: Tier): number {
  return { D: 0, C: 1, B: 2, A: 3, S: 4, SS: 5 }[tier]
}
```

- [ ] **Step 3: Verify types compile**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/data.ts && git commit -m "feat: add game types and car/part/race data definitions"
```

---

### Task 3: Zustand Store

**Files:**
- Create: `src/store.ts`

- [ ] **Step 1: Create src/store.ts**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, OwnedCar, PartSlot, CosmeticSlot, CarId, View, CarStats } from './types'
import { CARS, PARTS, COSMETICS, GARAGE_SLOT_COSTS, CREW, getPartCost, getCosmeticCost } from './data'

function makeDefaultParts(): Record<PartSlot, number> {
  return { engine: 0, turbo: 0, exhaust: 0, suspension: 0, tires: 0, nos: 0, weight: 0, transmission: 0 }
}

function makeDefaultCosmetics(): Record<CosmeticSlot, number> {
  return { paint: 0, wheels: 0, bodykit: 0, spoiler: 0, underglow: 0, tint: 0 }
}

function createOwnedCar(carId: CarId): OwnedCar {
  return {
    uid: crypto.randomUUID(),
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
    }),
    { name: 'street_racer_save' }
  )
)
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/store.ts && git commit -m "feat: add Zustand game store with persistence"
```

---

### Task 4: App Shell & Navigation

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace src/App.tsx with full app shell**

```tsx
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
```

- [ ] **Step 2: Add app shell styles to src/index.css**

Append to the end of `src/index.css`:

```css
/* App Shell */
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--cyan-dim);
  flex-shrink: 0;
  z-index: 100;
}

.hud-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--cyan);
  text-shadow: var(--cyan-glow);
  letter-spacing: 3px;
  animation: neon-flicker 4s infinite;
}

.hud-stats {
  display: flex;
  gap: 24px;
  font-family: var(--font-display);
  font-size: 1rem;
}

.hud-cash {
  color: var(--green);
  text-shadow: 0 0 10px #00ff8844;
}

.hud-rep {
  color: var(--yellow);
  text-shadow: 0 0 10px #ffcc0044;
}

.hud-tier {
  color: var(--pink);
  text-shadow: 0 0 10px #ff2d7b44;
}

.hud-nav {
  display: flex;
  gap: 4px;
}

.nav-btn {
  font-family: var(--font-display);
  font-size: 0.85rem;
  padding: 8px 20px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--text-dim);
  border-radius: var(--radius);
  letter-spacing: 2px;
  transition: all 0.2s;
}

.nav-btn:hover {
  color: var(--cyan);
  border-color: var(--cyan-dim);
}

.nav-btn.active {
  color: var(--cyan);
  border-color: var(--cyan);
  background: var(--cyan-dim);
  box-shadow: var(--cyan-glow);
}

.main-view {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
```

- [ ] **Step 3: Create placeholder Garage, Race, Shop components**

Create `src/Garage.tsx`:
```tsx
export function Garage() {
  return <div style={{ padding: 24, fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>GARAGE — coming next</div>
}
```

Create `src/Race.tsx`:
```tsx
export function Race() {
  return <div style={{ padding: 24, fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>RACE — coming soon</div>
}
```

Create `src/Shop.tsx`:
```tsx
export function Shop() {
  return <div style={{ padding: 24, fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>SHOP — coming soon</div>
}
```

- [ ] **Step 4: Verify types compile and build succeeds**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit && npx vite build
```
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add app shell with HUD, nav, and view routing"
```

---

### Task 5: Car Silhouette SVG Component

**Files:**
- Create: `src/CarSilhouette.tsx`

- [ ] **Step 1: Create src/CarSilhouette.tsx**

```tsx
import type { OwnedCar } from './types'
import { CARS } from './data'

interface Props {
  car: OwnedCar
  width?: number
  glowing?: boolean
}

export function CarSilhouette({ car, width = 200, glowing = false }: Props) {
  const def = CARS.find(c => c.id === car.carId)!
  const height = width * 0.4
  const hasBodykit = car.cosmetics.bodykit > 0
  const hasSpoiler = car.cosmetics.spoiler > 0
  const hasUnderglow = car.cosmetics.underglow > 0
  const lowered = car.parts.suspension > 0
  const wheelLevel = car.cosmetics.wheels

  // Ground position shifts down when not lowered
  const groundY = lowered ? height * 0.82 : height * 0.78
  const bodyBottom = groundY - height * 0.08

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ filter: glowing ? `drop-shadow(0 0 12px ${def.color}88)` : undefined }}
    >
      {/* Underglow */}
      {hasUnderglow && (
        <ellipse
          cx={width * 0.5}
          cy={groundY + 4}
          rx={width * 0.38}
          ry={6}
          fill={`var(--cyan)`}
          opacity={0.3 + car.cosmetics.underglow * 0.12}
        >
          <animate attributeName="opacity" values={`${0.2 + car.cosmetics.underglow * 0.1};${0.4 + car.cosmetics.underglow * 0.1};${0.2 + car.cosmetics.underglow * 0.1}`} dur="2s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* Car body */}
      <path
        d={`
          M ${width * 0.08} ${bodyBottom}
          L ${width * 0.12} ${bodyBottom - height * 0.18}
          ${hasBodykit ? `L ${width * 0.14} ${bodyBottom - height * 0.22}` : ''}
          L ${width * 0.28} ${bodyBottom - height * 0.32}
          L ${width * 0.32} ${bodyBottom - height * 0.52}
          L ${width * 0.62} ${bodyBottom - height * 0.52}
          L ${width * 0.7} ${bodyBottom - height * 0.32}
          ${hasBodykit ? `L ${width * 0.86} ${bodyBottom - height * 0.22}` : ''}
          L ${width * 0.88} ${bodyBottom - height * 0.18}
          L ${width * 0.92} ${bodyBottom}
          Z
        `}
        fill={def.color}
        stroke={def.color}
        strokeWidth="1"
        opacity={0.9}
      />

      {/* Windows */}
      <path
        d={`
          M ${width * 0.34} ${bodyBottom - height * 0.48}
          L ${width * 0.46} ${bodyBottom - height * 0.48}
          L ${width * 0.44} ${bodyBottom - height * 0.3}
          L ${width * 0.32} ${bodyBottom - height * 0.3}
          Z
        `}
        fill="#0a0a1f"
        opacity={car.cosmetics.tint > 0 ? 0.95 : 0.7}
      />
      <path
        d={`
          M ${width * 0.48} ${bodyBottom - height * 0.48}
          L ${width * 0.6} ${bodyBottom - height * 0.48}
          L ${width * 0.66} ${bodyBottom - height * 0.3}
          L ${width * 0.46} ${bodyBottom - height * 0.3}
          Z
        `}
        fill="#0a0a1f"
        opacity={car.cosmetics.tint > 0 ? 0.95 : 0.7}
      />

      {/* Spoiler */}
      {hasSpoiler && (
        <g>
          <rect x={width * 0.84} y={bodyBottom - height * 0.56 - car.cosmetics.spoiler * 2} width={width * 0.08} height={3} rx={1} fill={def.color} />
          <rect x={width * 0.87} y={bodyBottom - height * 0.48} width={2} height={height * 0.08 + car.cosmetics.spoiler * 2} fill={def.color} />
        </g>
      )}

      {/* Front wheel */}
      <circle cx={width * 0.22} cy={groundY} r={height * 0.1 + (wheelLevel > 2 ? 2 : 0)} fill="#111" stroke={wheelLevel > 0 ? '#666' : '#333'} strokeWidth={wheelLevel > 0 ? 2 : 1} />
      <circle cx={width * 0.22} cy={groundY} r={height * 0.04} fill={wheelLevel > 3 ? 'var(--cyan)' : '#333'} />

      {/* Rear wheel */}
      <circle cx={width * 0.78} cy={groundY} r={height * 0.1 + (wheelLevel > 2 ? 2 : 0)} fill="#111" stroke={wheelLevel > 0 ? '#666' : '#333'} strokeWidth={wheelLevel > 0 ? 2 : 1} />
      <circle cx={width * 0.78} cy={groundY} r={height * 0.04} fill={wheelLevel > 3 ? 'var(--cyan)' : '#333'} />

      {/* Headlight */}
      <ellipse cx={width * 0.1} cy={bodyBottom - height * 0.08} rx={4} ry={3} fill="#ffee88" opacity={0.8} />

      {/* Taillight */}
      <ellipse cx={width * 0.91} cy={bodyBottom - height * 0.08} rx={4} ry={3} fill="var(--red)" opacity={0.8} />

      {/* Reflection on ground */}
      {glowing && (
        <rect
          x={width * 0.15}
          y={groundY + 8}
          width={width * 0.7}
          height={height * 0.12}
          fill={def.color}
          opacity={0.08}
          rx={4}
        />
      )}
    </svg>
  )
}
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/CarSilhouette.tsx && git commit -m "feat: add SVG car silhouette with dynamic mod rendering"
```

---

### Task 6: Garage View

**Files:**
- Modify: `src/Garage.tsx`

- [ ] **Step 1: Replace src/Garage.tsx with full implementation**

```tsx
import { useGameStore, getEffectiveStats } from './store'
import { CARS, CREW } from './data'
import { CarSilhouette } from './CarSilhouette'

export function Garage() {
  const { cars, selectedCarUid, selectCar, crewMembers } = useGameStore()

  const selectedCar = cars.find(c => c.uid === selectedCarUid)
  const activeCrew = CREW.filter(c => crewMembers.includes(c.id))
  const totalIdleIncome = activeCrew.reduce((sum, c) => sum + c.cashPerSecond, 0)

  return (
    <div className="garage">
      <div className="garage-grid">
        {cars.map((car) => {
          const def = CARS.find(c => c.id === car.carId)!
          const isSelected = car.uid === selectedCarUid
          return (
            <button
              key={car.uid}
              className={`garage-card ${isSelected ? 'selected' : ''}`}
              onClick={() => selectCar(car.uid)}
            >
              <CarSilhouette car={car} width={180} glowing={isSelected} />
              <div className="garage-card-name">{def.name}</div>
              <div className="garage-card-year">{def.year}</div>
            </button>
          )
        })}
      </div>

      {selectedCar && (
        <div className="garage-detail">
          <div className="garage-detail-car">
            <CarSilhouette car={selectedCar} width={320} glowing />
            <h2 className="garage-detail-name">
              {CARS.find(c => c.id === selectedCar.carId)!.name}
            </h2>
          </div>
          <div className="garage-stats">
            {(() => {
              const stats = getEffectiveStats(selectedCar)
              return (
                <>
                  <StatBar label="POWER" value={stats.power} max={1500} color="var(--pink)" />
                  <StatBar label="GRIP" value={stats.grip} max={100} color="var(--cyan)" />
                  <StatBar label="WEIGHT" value={stats.weight} max={2000} color="var(--yellow)" inverted />
                  <StatBar label="NOS" value={stats.nosCapacity} max={10} color="var(--green)" />
                  <StatBar label="STYLE" value={stats.style} max={200} color="var(--pink)" />
                </>
              )
            })()}
          </div>
        </div>
      )}

      {totalIdleIncome > 0 && (
        <div className="idle-income">
          <span className="idle-label">CREW INCOME</span>
          <span className="idle-value">+${totalIdleIncome.toFixed(0)}/s</span>
        </div>
      )}
    </div>
  )
}

function StatBar({ label, value, max, color, inverted }: { label: string; value: number; max: number; color: string; inverted?: boolean }) {
  const pct = inverted
    ? Math.max(0, ((max - value) / max) * 100)
    : Math.min(100, (value / max) * 100)
  return (
    <div className="stat-bar">
      <span className="stat-label">{label}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }} />
      </div>
      <span className="stat-value" style={{ color }}>{Math.round(value)}</span>
    </div>
  )
}
```

- [ ] **Step 2: Add garage styles to src/index.css**

Append to `src/index.css`:

```css
/* Garage */
.garage {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}

.garage-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.garage-card {
  background: var(--bg-card);
  border: 1px solid transparent;
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.garage-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--cyan-dim);
}

.garage-card.selected {
  border-color: var(--cyan);
  box-shadow: var(--cyan-glow);
  background: var(--bg-card-hover);
}

.garage-card-name {
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.garage-card-year {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--text-dim);
}

.garage-detail {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  animation: slide-up 0.3s ease;
}

.garage-detail-car {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.garage-detail-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--cyan);
  text-shadow: var(--cyan-glow);
  letter-spacing: 2px;
}

.garage-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.stat-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-label {
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--text-secondary);
  width: 60px;
  letter-spacing: 1px;
}

.stat-track {
  flex: 1;
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 0.8rem;
  width: 50px;
  text-align: right;
}

.idle-income {
  position: fixed;
  bottom: 16px;
  right: 24px;
  background: var(--bg-card);
  border: 1px solid var(--green);
  border-radius: var(--radius);
  padding: 8px 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 0 12px #00ff8833;
}

.idle-label {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.idle-value {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--green);
}
```

- [ ] **Step 3: Verify types compile**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/Garage.tsx src/index.css && git commit -m "feat: add garage view with car grid and stat bars"
```

---

### Task 7: Tachometer Component

**Files:**
- Create: `src/Tachometer.tsx`

- [ ] **Step 1: Create src/Tachometer.tsx**

```tsx
interface Props {
  rpm: number
  maxRpm: number
  gear: number
  /** 0-1 fraction of the arc where green shift zone starts */
  shiftZoneStart: number
  /** 0-1 fraction of the arc where green shift zone ends */
  shiftZoneEnd: number
}

export function Tachometer({ rpm, maxRpm, gear, shiftZoneStart, shiftZoneEnd }: Props) {
  const size = 180
  const cx = size / 2
  const cy = size / 2
  const radius = 70
  const startAngle = 135
  const endAngle = 405
  const totalArc = endAngle - startAngle

  const rpmFraction = Math.min(rpm / maxRpm, 1)
  const needleAngle = startAngle + rpmFraction * totalArc

  // Zone arcs
  const greenStart = startAngle + shiftZoneStart * totalArc
  const greenEnd = startAngle + shiftZoneEnd * totalArc
  const redStart = startAngle + 0.85 * totalArc
  const redEnd = endAngle

  function arcPath(from: number, to: number, r: number): string {
    const fromRad = (from * Math.PI) / 180
    const toRad = (to * Math.PI) / 180
    const x1 = cx + r * Math.cos(fromRad)
    const y1 = cy + r * Math.sin(fromRad)
    const x2 = cx + r * Math.cos(toRad)
    const y2 = cy + r * Math.sin(toRad)
    const largeArc = to - from > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  const needleRad = (needleAngle * Math.PI) / 180
  const needleX = cx + (radius - 8) * Math.cos(needleRad)
  const needleY = cy + (radius - 8) * Math.sin(needleRad)

  const inRedZone = rpmFraction > 0.85
  const inGreenZone = rpmFraction >= shiftZoneStart && rpmFraction <= shiftZoneEnd

  return (
    <div className="tachometer">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <path d={arcPath(startAngle, endAngle, radius)} fill="none" stroke="#222" strokeWidth={10} strokeLinecap="round" />

        {/* Green shift zone */}
        <path d={arcPath(greenStart, greenEnd, radius)} fill="none" stroke="var(--green)" strokeWidth={10} strokeLinecap="round" opacity={0.4} />

        {/* Red zone */}
        <path d={arcPath(redStart, redEnd, radius)} fill="none" stroke="var(--red)" strokeWidth={10} strokeLinecap="round" opacity={0.4} />

        {/* Active arc up to needle */}
        <path
          d={arcPath(startAngle, needleAngle, radius)}
          fill="none"
          stroke={inRedZone ? 'var(--red)' : inGreenZone ? 'var(--green)' : 'var(--cyan)'}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={inRedZone ? 'var(--red)' : '#fff'}
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ filter: inRedZone ? 'drop-shadow(0 0 6px var(--red))' : 'drop-shadow(0 0 4px #ffffff66)' }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={5} fill="#333" stroke="#555" strokeWidth={1} />

        {/* RPM text */}
        <text x={cx} y={cy + 28} textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fill="var(--text-secondary)">
          {Math.round(rpm)}
        </text>
        <text x={cx} y={cy + 42} textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fill="var(--text-dim)">
          RPM
        </text>
      </svg>

      <div className="tach-gear" style={{ color: inGreenZone ? 'var(--green)' : 'var(--text-primary)' }}>
        {gear}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add tachometer styles to src/index.css**

Append to `src/index.css`:

```css
/* Tachometer */
.tachometer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tach-gear {
  font-family: var(--font-display);
  font-size: 2.4rem;
  margin-top: -20px;
  transition: color 0.15s;
}
```

- [ ] **Step 3: Verify types compile**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/Tachometer.tsx src/index.css && git commit -m "feat: add SVG tachometer gauge component"
```

---

### Task 8: Race View — Full Implementation

**Files:**
- Modify: `src/Race.tsx`

- [ ] **Step 1: Replace src/Race.tsx with full race engine**

```tsx
import { useState, useRef, useCallback, useEffect } from 'react'
import { useGameStore, getEffectiveStats } from './store'
import { CARS, RACE_TIERS, getUnlockedTier, tierRank } from './data'
import { CarSilhouette } from './CarSilhouette'
import { Tachometer } from './Tachometer'
import type { RaceTier } from './types'

type RacePhase = 'select' | 'countdown' | 'racing' | 'finished'

interface RaceState {
  phase: RacePhase
  raceTier: RaceTier | null
  playerPos: number      // 0–1 fraction of track
  opponentPos: number
  rpm: number
  gear: number
  speed: number          // pixels/sec conceptual
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
}

const MAX_RPM = 9000
const SHIFT_ZONE_START = 0.65
const SHIFT_ZONE_END = 0.82
const GEARS = 6
const NOS_DURATION = 3

function getGearSpeedMultiplier(gear: number): number {
  // Higher gears = higher top speed but slower acceleration
  return 0.5 + gear * 0.18
}

export function Race() {
  const { cars, selectedCarUid, cash, rep, addCash, addRep } = useGameStore()
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
    })
  }, [selectedCar])

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
    const gripFactor = stats.grip / 100
    const weightFactor = 1500 / Math.max(stats.weight, 500)

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now
      const s = stateRef.current

      if (s.phase !== 'racing') return

      // Process clicks into RPM
      const clicks = clickAccumRef.current
      clickAccumRef.current = 0

      const isBoggedDown = now < bogDownUntilRef.current
      let newRpm = s.rpm

      if (isBoggedDown) {
        newRpm = Math.max(newRpm - 3000 * dt, 1000)
      } else {
        // Each click adds RPM, diminishing returns
        const clickBoost = clicks * (800 / (1 + clicks * 0.15))
        newRpm += clickBoost
        // Natural RPM decay
        newRpm -= 2000 * dt
      }

      // Clamp RPM
      if (newRpm > MAX_RPM) newRpm = MAX_RPM
      if (newRpm < 0) newRpm = 0

      // Speed from RPM + gear
      const gearMult = getGearSpeedMultiplier(s.gear)
      const rpmFraction = newRpm / MAX_RPM
      let newSpeed = rpmFraction * gearMult * powerFactor * weightFactor * 0.08

      // NOS boost
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

      // Red zone penalty
      if (rpmFraction > 0.85) {
        newSpeed *= 0.7
      }

      // Player position
      let playerPos = s.playerPos + newSpeed * dt
      // Opponent position
      let opponentPos = s.opponentPos + opponentSpeedRef.current * dt

      // Check finish
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
  }, [state.phase, selectedCar, addCash, addRep, wager])

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

  // -- RENDER --

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

  if (state.phase === 'countdown') {
    return (
      <div className="race-countdown">
        <div className="countdown-number">{state.countdown > 0 ? state.countdown : 'GO!'}</div>
      </div>
    )
  }

  if (state.phase === 'finished') {
    return (
      <div className="race-result">
        <div className={`result-banner ${state.result}`}>
          {state.result === 'win' ? 'YOU WIN!' : 'YOU LOSE'}
        </div>
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

  // Racing phase
  return (
    <div className="race-strip" onClick={handleThrottleClick}>
      {/* Parallax background */}
      <div className="parallax-sky" style={{ backgroundPositionX: `${-state.playerPos * 200}px` }} />
      <div className="parallax-city" style={{ backgroundPositionX: `${-state.playerPos * 600}px` }} />
      <div className="parallax-road">
        <div className="road-lines" style={{ backgroundPositionX: `${-state.playerPos * 2000}px` }} />

        {/* Opponent car */}
        <div className="race-car opponent" style={{ left: `${state.opponentPos * 70 + 5}%` }}>
          <div className="opponent-silhouette" />
        </div>

        {/* Player car */}
        <div className="race-car player" style={{ left: `${state.playerPos * 70 + 5}%` }}>
          <CarSilhouette car={selectedCar} width={120} glowing />
          {state.nosActive && <div className="nos-flame" />}
        </div>
      </div>

      {/* HUD overlay */}
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
```

- [ ] **Step 2: Add race styles to src/index.css**

Append to `src/index.css`:

```css
/* Race */
.race-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: var(--font-display);
  color: var(--text-secondary);
}

.race-select {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.race-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--cyan);
  text-shadow: var(--cyan-glow);
  letter-spacing: 4px;
}

.wager-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wager-label {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--yellow);
}

.wager-input {
  font-family: var(--font-display);
  font-size: 0.9rem;
  background: var(--bg-card);
  border: 1px solid var(--yellow);
  border-radius: var(--radius);
  color: var(--yellow);
  padding: 6px 12px;
  width: 140px;
  outline: none;
}

.race-tier-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 500px;
  width: 100%;
}

.race-tier-card {
  background: var(--bg-card);
  border: 1px solid var(--cyan-dim);
  border-radius: var(--radius);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;
}

.race-tier-card:not(.locked):hover {
  border-color: var(--cyan);
  box-shadow: var(--cyan-glow);
  transform: translateY(-2px);
}

.race-tier-card.locked {
  opacity: 0.4;
  cursor: not-allowed;
}

.tier-name {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.tier-reward {
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tier-lock {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--red);
  margin-top: 4px;
}

/* Countdown */
.race-countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--bg-primary);
}

.countdown-number {
  font-family: var(--font-display);
  font-size: 6rem;
  color: var(--cyan);
  text-shadow: var(--cyan-glow);
  animation: glow-pulse 1s ease infinite;
}

/* Race strip */
.race-strip {
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  user-select: none;
}

.parallax-sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(180deg, #050510 0%, #0f0f2a 60%, #1a1035 100%);
}

.parallax-city {
  position: absolute;
  top: 15%;
  left: 0;
  right: 0;
  height: 25%;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 40px,
    #111122 40px,
    #111122 42px,
    transparent 42px,
    transparent 80px,
    #0d0d1a 80px,
    #0d0d1a 120px,
    transparent 120px,
    transparent 130px
  );
  opacity: 0.6;
}

.parallax-city::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--cyan-dim);
  box-shadow: var(--cyan-glow);
}

.parallax-road {
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #1a1a1a 0%, #111 100%);
}

.road-lines {
  position: absolute;
  top: 45%;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    #ffcc00 0px,
    #ffcc00 30px,
    transparent 30px,
    transparent 60px
  );
  opacity: 0.5;
}

.race-car {
  position: absolute;
  bottom: 25%;
  transition: left 0.05s linear;
}

.race-car.opponent {
  bottom: 55%;
}

.opponent-silhouette {
  width: 100px;
  height: 40px;
  background: #333;
  border-radius: 8px 20px 4px 4px;
  opacity: 0.6;
  box-shadow: -4px 0 12px #ff220044;
}

.nos-flame {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 16px;
  background: linear-gradient(90deg, var(--cyan), var(--pink), transparent);
  border-radius: 0 50% 50% 0;
  animation: glow-pulse 0.2s infinite;
  filter: blur(2px);
}

/* Race HUD */
.race-hud {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.race-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shift-btn {
  font-family: var(--font-display);
  font-size: 1rem;
  padding: 12px 28px;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--text-dim);
  border-radius: var(--radius);
  letter-spacing: 2px;
  transition: all 0.15s;
}

.shift-btn.in-zone {
  color: var(--green);
  border-color: var(--green);
  box-shadow: 0 0 12px #00ff8844;
  animation: glow-pulse 0.5s infinite;
}

.shift-btn:disabled {
  opacity: 0.3;
}

.nos-btn {
  font-family: var(--font-display);
  font-size: 0.9rem;
  padding: 10px 24px;
  background: var(--bg-card);
  color: var(--pink);
  border: 2px solid var(--pink-dim);
  border-radius: var(--radius);
  letter-spacing: 2px;
  transition: all 0.15s;
}

.nos-btn.active {
  background: var(--pink);
  color: #fff;
  box-shadow: var(--pink-glow);
}

.nos-btn:disabled:not(.active) {
  opacity: 0.3;
}

.race-speed {
  position: absolute;
  bottom: 20px;
  right: 24px;
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--text-primary);
  text-shadow: 0 0 10px #ffffff33;
}

/* Race result */
.race-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 24px;
  animation: slide-up 0.4s ease;
}

.result-banner {
  font-family: var(--font-display);
  font-size: 3.5rem;
  letter-spacing: 6px;
}

.result-banner.win {
  color: var(--green);
  text-shadow: 0 0 30px #00ff8866, 0 0 60px #00ff8833;
}

.result-banner.lose {
  color: var(--red);
  text-shadow: 0 0 30px #ff334466;
}

.result-rewards {
  display: flex;
  gap: 20px;
  font-family: var(--font-display);
  font-size: 1.1rem;
}

.reward-cash {
  color: var(--green);
}

.reward-cash.consolation {
  color: var(--text-secondary);
}

.reward-rep {
  color: var(--yellow);
}

.reward-shifts {
  color: var(--text-secondary);
}

.race-again-btn {
  font-family: var(--font-display);
  font-size: 1rem;
  padding: 12px 36px;
  background: var(--cyan-dim);
  color: var(--cyan);
  border: 1px solid var(--cyan);
  border-radius: var(--radius);
  letter-spacing: 3px;
  transition: all 0.2s;
}

.race-again-btn:hover {
  background: var(--cyan);
  color: var(--bg-primary);
  box-shadow: var(--cyan-glow);
}
```

- [ ] **Step 3: Verify types compile**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/Race.tsx src/index.css && git commit -m "feat: add race view with drag strip, tachometer, shift/NOS mechanics"
```

---

### Task 9: Shop View

**Files:**
- Modify: `src/Shop.tsx`

- [ ] **Step 1: Replace src/Shop.tsx with full implementation**

```tsx
import { useGameStore, getEffectiveStats } from './store'
import { CARS, PARTS, COSMETICS, CREW, GARAGE_SLOT_COSTS, getPartCost, getCosmeticCost, getUnlockedTier, tierRank } from './data'
import { CarSilhouette } from './CarSilhouette'
import type { PartSlot, CosmeticSlot } from './types'

export function Shop() {
  const {
    cars, selectedCarUid, cash, rep, garageSlots, crewMembers,
    upgradePart, upgradeCosmetic, buyCar, buyGarageSlot, buyCrewMember,
  } = useGameStore()

  const selectedCar = cars.find(c => c.uid === selectedCarUid)
  const currentTier = getUnlockedTier(rep)
  const ownedCarIds = new Set(cars.map(c => c.carId))

  return (
    <div className="shop">
      {/* Parts & Cosmetics for selected car */}
      {selectedCar && (
        <section className="shop-section">
          <h3 className="shop-heading">UPGRADES — {CARS.find(c => c.id === selectedCar.carId)!.name}</h3>

          <div className="upgrade-grid">
            <div className="upgrade-column">
              <h4 className="upgrade-subhead">PERFORMANCE</h4>
              {PARTS.map(part => {
                const level = selectedCar.parts[part.slot]
                const maxed = level >= 5
                const cost = maxed ? 0 : getPartCost(part, level + 1)
                const canAfford = cash >= cost
                return (
                  <div key={part.slot} className="upgrade-card">
                    <div className="upgrade-info">
                      <span className="upgrade-name">{part.name}</span>
                      <div className="upgrade-pips">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`pip ${i < level ? 'filled' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <button
                      className={`upgrade-btn ${maxed ? 'maxed' : canAfford ? '' : 'cant-afford'}`}
                      onClick={() => upgradePart(selectedCar.uid, part.slot as PartSlot)}
                      disabled={maxed || !canAfford}
                    >
                      {maxed ? 'MAX' : `$${cost.toLocaleString()}`}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="upgrade-column">
              <h4 className="upgrade-subhead">COSMETICS</h4>
              {COSMETICS.map(cosmetic => {
                const level = selectedCar.cosmetics[cosmetic.slot]
                const maxed = level >= 5
                const cost = maxed ? 0 : getCosmeticCost(cosmetic, level + 1)
                const canAfford = cash >= cost
                return (
                  <div key={cosmetic.slot} className="upgrade-card">
                    <div className="upgrade-info">
                      <span className="upgrade-name">{cosmetic.name}</span>
                      <div className="upgrade-pips">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`pip ${i < level ? 'filled' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <button
                      className={`upgrade-btn ${maxed ? 'maxed' : canAfford ? '' : 'cant-afford'}`}
                      onClick={() => upgradeCosmetic(selectedCar.uid, cosmetic.slot as CosmeticSlot)}
                      disabled={maxed || !canAfford}
                    >
                      {maxed ? 'MAX' : `$${cost.toLocaleString()}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Buy Cars */}
      <section className="shop-section">
        <h3 className="shop-heading">BUY CARS</h3>
        <div className="car-shop-grid">
          {CARS.filter(c => tierRank(currentTier) >= tierRank(c.tier)).map(carDef => {
            const owned = ownedCarIds.has(carDef.id)
            const canAfford = cash >= carDef.price
            const garageFull = cars.length >= garageSlots
            return (
              <div key={carDef.id} className={`car-shop-card ${owned ? 'owned' : ''}`}>
                <div className="car-shop-tier">TIER {carDef.tier}</div>
                <div className="car-shop-name">{carDef.name}</div>
                <div className="car-shop-year">{carDef.year}</div>
                {owned ? (
                  <div className="car-shop-owned">OWNED</div>
                ) : (
                  <button
                    className={`buy-car-btn ${!canAfford || garageFull ? 'cant-afford' : ''}`}
                    onClick={() => buyCar(carDef.id)}
                    disabled={!canAfford || garageFull}
                  >
                    {garageFull ? 'GARAGE FULL' : carDef.price === 0 ? 'FREE' : `$${carDef.price.toLocaleString()}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Garage Slots */}
      {garageSlots < 12 && (
        <section className="shop-section">
          <h3 className="shop-heading">GARAGE SLOT</h3>
          <p className="shop-desc">{garageSlots}/12 slots</p>
          <button
            className={`buy-slot-btn ${cash < (GARAGE_SLOT_COSTS[garageSlots] ?? 10_000_000) ? 'cant-afford' : ''}`}
            onClick={buyGarageSlot}
            disabled={cash < (GARAGE_SLOT_COSTS[garageSlots] ?? 10_000_000)}
          >
            BUY SLOT — ${(GARAGE_SLOT_COSTS[garageSlots] ?? 10_000_000).toLocaleString()}
          </button>
        </section>
      )}

      {/* Crew */}
      <section className="shop-section">
        <h3 className="shop-heading">CREW</h3>
        <div className="crew-grid">
          {CREW.map(crew => {
            const owned = crewMembers.includes(crew.id)
            const canAfford = cash >= crew.cost
            return (
              <div key={crew.id} className={`crew-card ${owned ? 'owned' : ''}`}>
                <div className="crew-name">{crew.name}</div>
                <div className="crew-income">+${crew.cashPerSecond}/s</div>
                {owned ? (
                  <div className="crew-hired">HIRED</div>
                ) : (
                  <button
                    className={`hire-btn ${!canAfford ? 'cant-afford' : ''}`}
                    onClick={() => buyCrewMember(crew.id)}
                    disabled={!canAfford}
                  >
                    ${crew.cost.toLocaleString()}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Add shop styles to src/index.css**

Append to `src/index.css`:

```css
/* Shop */
.shop {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 60px;
}

.shop-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shop-heading {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--cyan);
  letter-spacing: 3px;
  border-bottom: 1px solid var(--cyan-dim);
  padding-bottom: 8px;
}

.shop-desc {
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.upgrade-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.upgrade-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upgrade-subhead {
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.upgrade-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid transparent;
  border-radius: var(--radius);
  padding: 10px 14px;
  transition: border-color 0.2s;
}

.upgrade-card:hover {
  border-color: var(--cyan-dim);
}

.upgrade-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upgrade-name {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.upgrade-pips {
  display: flex;
  gap: 4px;
}

.pip {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: var(--bg-primary);
  border: 1px solid var(--text-dim);
  transition: all 0.2s;
}

.pip.filled {
  background: var(--cyan);
  border-color: var(--cyan);
  box-shadow: 0 0 6px var(--cyan-dim);
}

.upgrade-btn {
  font-family: var(--font-display);
  font-size: 0.75rem;
  padding: 6px 14px;
  background: var(--cyan-dim);
  color: var(--cyan);
  border: 1px solid var(--cyan);
  border-radius: var(--radius);
  letter-spacing: 1px;
  transition: all 0.2s;
}

.upgrade-btn:hover:not(:disabled) {
  background: var(--cyan);
  color: var(--bg-primary);
}

.upgrade-btn.maxed {
  background: transparent;
  border-color: var(--text-dim);
  color: var(--text-dim);
}

.upgrade-btn.cant-afford {
  opacity: 0.4;
}

/* Car shop */
.car-shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.car-shop-card {
  background: var(--bg-card);
  border: 1px solid transparent;
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s;
}

.car-shop-card:hover:not(.owned) {
  border-color: var(--cyan-dim);
}

.car-shop-card.owned {
  opacity: 0.5;
}

.car-shop-tier {
  font-family: var(--font-display);
  font-size: 0.65rem;
  color: var(--pink);
  letter-spacing: 2px;
}

.car-shop-name {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.car-shop-year {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--text-dim);
}

.car-shop-owned {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--green);
  letter-spacing: 2px;
}

.buy-car-btn {
  font-family: var(--font-display);
  font-size: 0.75rem;
  padding: 6px 12px;
  margin-top: 4px;
  background: var(--cyan-dim);
  color: var(--cyan);
  border: 1px solid var(--cyan);
  border-radius: var(--radius);
  letter-spacing: 1px;
  transition: all 0.2s;
}

.buy-car-btn:hover:not(:disabled) {
  background: var(--cyan);
  color: var(--bg-primary);
}

.buy-car-btn.cant-afford {
  opacity: 0.4;
}

.buy-slot-btn {
  font-family: var(--font-display);
  font-size: 0.85rem;
  padding: 10px 24px;
  background: var(--bg-card);
  color: var(--yellow);
  border: 1px solid var(--yellow);
  border-radius: var(--radius);
  letter-spacing: 2px;
  align-self: flex-start;
  transition: all 0.2s;
}

.buy-slot-btn:hover:not(:disabled) {
  background: var(--yellow);
  color: var(--bg-primary);
}

.buy-slot-btn.cant-afford {
  opacity: 0.4;
}

/* Crew */
.crew-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.crew-card {
  background: var(--bg-card);
  border: 1px solid transparent;
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s;
}

.crew-card:hover:not(.owned) {
  border-color: var(--green);
}

.crew-card.owned {
  border-color: var(--green);
  opacity: 0.6;
}

.crew-name {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.crew-income {
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--green);
}

.crew-hired {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--green);
  letter-spacing: 2px;
}

.hire-btn {
  font-family: var(--font-display);
  font-size: 0.75rem;
  padding: 6px 12px;
  margin-top: 4px;
  background: transparent;
  color: var(--green);
  border: 1px solid var(--green);
  border-radius: var(--radius);
  letter-spacing: 1px;
  transition: all 0.2s;
}

.hire-btn:hover:not(:disabled) {
  background: var(--green);
  color: var(--bg-primary);
}

.hire-btn.cant-afford {
  opacity: 0.4;
}
```

- [ ] **Step 3: Verify types compile and build succeeds**

Run:
```bash
cd /home/kasm-user/street-racer && npx tsc -b --noEmit && npx vite build
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/Shop.tsx src/index.css && git commit -m "feat: add shop view with parts, cosmetics, cars, crew"
```

---

### Task 10: Dockerfile & CI/CD

**Files:**
- Create: `Dockerfile`
- Create: `.github/workflows/docker.yml`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 2: Create .github/workflows/docker.yml**

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/street-racer:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/street-racer:${{ github.sha }}
```

- [ ] **Step 3: Commit**

```bash
git add Dockerfile .github/workflows/docker.yml && git commit -m "feat: add Dockerfile and GitHub Actions CI/CD"
```

---

### Task 11: Create GitHub Repo & Push

- [ ] **Step 1: Create remote repo**

```bash
TOKEN=$(cat /home/kasm-user/.github_token)
curl -s -H "Authorization: token $TOKEN" https://api.github.com/user/repos -d '{"name":"street-racer","description":"Street racing clicker game — build cars, race, collect JDM legends","public":true}'
```

- [ ] **Step 2: Add remote and push**

```bash
cd /home/kasm-user/street-racer
TOKEN=$(cat /home/kasm-user/.github_token)
git remote add origin https://Atvriders:${TOKEN}@github.com/Atvriders/street-racer.git
git push -u origin master
```

---

### Task 12: Manual Smoke Test

- [ ] **Step 1: Start dev server**

```bash
cd /home/kasm-user/street-racer && npx vite --host 0.0.0.0 --port 5173
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173` and check:
- HUD shows STREET RACER title, $0 cash, 0 REP, TIER D
- Garage shows Honda Civic EG card with silhouette
- Clicking the car shows stat bars
- RACE tab → tier selection grid, Street Race clickable, others locked
- Starting a race shows countdown, then drag strip
- Clicking on strip increases RPM on tachometer
- SHIFT button glows green in shift zone
- NOS button works
- Winning awards cash and rep
- SHOP tab → parts/cosmetics for Civic, car shop, crew section
- Buying upgrades deducts cash and fills pips
- localStorage persistence: refresh page, state preserved
