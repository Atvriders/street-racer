# Street Racer

A JDM street racing clicker game. Build your garage, tune your cars, and dominate the midnight streets.

<!-- screenshot -->

## Features

- 20 cars across 6 tiers (D through SS) — from a rusty 1995 Honda Civic EG to legendary widebody builds
- Drag strip racing with click-to-throttle, tachometer, gear shifting, and NOS
- Upgrade system: 8 performance parts + 6 cosmetic mods, each with 5 levels
- Garage collection up to 12 cars
- 4 race tiers: Street, Highway, Circuit, Midnight Touge
- Crew members for idle income
- Wager system at B-tier and above
- SVG car silhouettes that visually change with mods (spoiler, bodykit, underglow, wheels)
- localStorage save persistence
- Midnight Neon aesthetic with parallax city backgrounds

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Docker

**Docker Compose (recommended):**

```bash
docker compose up -d
```

**Or run directly:**

```bash
docker pull ghcr.io/atvriders/street-racer:latest
docker run -p 8085:80 ghcr.io/atvriders/street-racer:latest
```

Open [http://localhost:8085](http://localhost:8085).

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Zustand
- CSS3 / SVG
