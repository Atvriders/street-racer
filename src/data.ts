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
