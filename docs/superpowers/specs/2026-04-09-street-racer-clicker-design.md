# Street Racer Clicker — Design Spec

## Overview

A car-building clicker game with a street/JDM theme. Players race to earn cash, build a garage collection of iconic cars, and upgrade them to dominate increasingly difficult race tiers. Core mechanic: drag strip races where clicks = throttle, with gear shifting and NOS timing skill elements.

**Stack:** React 18 + TypeScript + Vite + Zustand
**Repo:** `street-racer/`
**Aesthetic:** Midnight Neon — dark, moody, Japanese street racing atmosphere

---

## Core Game Loop

Click → Race → Win Cash + Rep → Upgrade/Buy Cars → Harder Races → Repeat

### Views

1. **Garage** (default) — Car collection grid. Click a car to select it. Each car shows a side-profile silhouette with visible mods that change as upgrades are applied. Idle income display if crew members are unlocked.

2. **Race** — Pick a race tier (Street, Highway, Circuit, Midnight). Selected car enters a drag strip. Cars animate left-to-right across the screen. Clicks = throttle. Gear shifting via tachometer. NOS boost button. Race lasts ~15-20 seconds.

3. **Shop** — Spend cash on parts (8 slots), cosmetics (6 types), new cars (unlocked by rep milestones), and garage slots.

4. **Idle Income** — Unlockable crew members race in the background earning passive cash (slower than active racing).

---

## Cars & Progression

### Starting Car
1995 Honda Civic EG — rusty, stock, slow. Free.

### Unlock Tiers (by reputation)

| Tier | Rep Required | Cars Available | Price Range |
|------|-------------|----------------|-------------|
| D | 0 | Civic EG, Miata NA, Corolla AE86 | Free - $5K |
| C | 500 | 240SX S14, Integra Type R, Eclipse GSX | $15K - $30K |
| B | 2,000 | Supra MK4, Silvia S15, RX-7 FD, Evo IX | $60K - $120K |
| A | 8,000 | Skyline R34 GT-R, NSX, 370Z | $200K - $400K |
| S | 25,000 | LFA, GT-R R35, Demon, 911 GT3 RS | $800K - $2M |
| SS | 100,000 | Legendary one-offs (custom widebody builds) | $5M+ |

### Garage
- Start with 2 slots
- Buy more with cash (increasing cost per slot)
- Maximum 12 slots

### Car Stats
- **Power (HP)** — affects top speed
- **Grip** — affects how forgiving shift timing is
- **Weight** — affects acceleration
- **NOS Capacity** — number of boost uses per race
- **Style** — cosmetic score, multiplies rep earned

All stats improvable via parts. Each part has 5 upgrade levels with increasing cost.

---

## Race Mechanic

### Visual Layout
Full-width drag strip. Two cars (player + opponent) race left to right. Scrolling parallax background: distant city skyline, mid-ground buildings with neon signs, foreground guardrails blurring past. Road has lane markings that blur with speed.

### Controls
- **Click anywhere on road area** = throttle. More clicks = more acceleration. Diminishing returns to counter autoclickers.
- **Tachometer** (bottom-left) — needle climbs as you click. Green zone = shift window. Red zone = rev limiter (speed drops).
- **SHIFT button** — hit when needle is in the green. Perfect shift = speed boost. Miss = bog down ~1 second. Gear indicator shows 1st-6th.
- **NOS button** — 3-second speed burst. Limited uses per race. More effective in higher gears (5th/6th >> 1st).

### Opponent AI
Each race tier has a target completion time. Opponent drives at that pace +/- small random variance. Higher tiers = tighter margins. Upgrades required to progress, not just fast clicking.

### Rewards
- **Win:** Cash + rep. Bonus for perfect shifts, unused NOS, margin of victory.
- **Lose:** 20% consolation cash. No rep.
- **Wager system:** Unlocks at B tier. Bet own cash for 3x returns.

---

## Visual Design — Midnight Neon

### Colors
- Background: near-black `#0a0a0f` with subtle asphalt texture grain
- Primary accent: electric cyan `#00f0ff`
- Secondary accent: hot pink `#ff2d7b`
- Used for neon glows, UI borders, active states

### Typography
- Display/headers: monospace-inspired font (digital gauge feel)
- Body: clean sans-serif

### Car Rendering
CSS/SVG side-profile silhouettes with colored fills. Stylized blueprints, not photorealistic. Mods visually appear as upgrades are purchased (lowered stance, wider body, spoiler, underglow).

### UI Elements
- **Tachometer:** Circular gauge with glowing needle, animated sweep. Green/yellow/red zones. Aftermarket gauge aesthetic.
- **Race strip:** Scrolling parallax — dark city skyline at night, neon signs, streaking street lights. Blurring lane markings.
- **Garage:** Cars on dark showroom floor with subtle reflection. Selected car has cyan glow halo.
- **Shop:** Parts as glowing cards. Upgrade levels as pips that fill in. Locked items dimmed with padlock.
- **Particles:** Exhaust sparks on NOS, tire smoke on bad shifts, confetti on wins.

---

## Tech Architecture

### Stack
React 18 + TypeScript + Vite + Zustand (with localStorage persistence)

### File Structure

```
street-racer/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx          — entry point
│   ├── App.tsx           — view switcher (garage/race/shop), top-level layout
│   ├── store.ts          — single Zustand store, localStorage persist
│   ├── Garage.tsx        — car collection grid, car selection, idle income
│   ├── Race.tsx          — drag strip animation, tachometer, shift/NOS, opponent AI
│   ├── Shop.tsx          — parts & cosmetics upgrades, new car purchases
│   ├── data.ts           — car definitions, part definitions, race tiers, costs, stats
│   ├── types.ts          — TypeScript interfaces
│   └── index.css         — global styles, CSS variables, fonts, animations
├── Dockerfile
└── .github/workflows/docker.yml
```

### State (single Zustand store)
- `cash: number`
- `rep: number`
- `garageSlots: number`
- `cars: OwnedCar[]` — each with id, carType, parts (keyed by slot + level), cosmetics, computed stats
- `selectedCarId: string`
- `crewMembers: CrewMember[]` — idle income generators
- `view: 'garage' | 'race' | 'shop'`
- Persisted to `localStorage` key `'street_racer_save'`

### Race Engine
- `requestAnimationFrame` loop
- Player click events feed into acceleration model
- Tach needle position derived from current RPM state
- Gear shifts modify torque curve
- Opponent runs on timer-based position curve
- Race resolves when either car crosses finish line position

### Deployment
- Dockerfile for containerized hosting
- GitHub Actions workflow for Docker build/push
- No backend, no external APIs — pure client-side
