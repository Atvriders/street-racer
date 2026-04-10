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
