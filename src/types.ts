export type CarId =
  | 'civic_eg' | 'miata_na' | 'corolla_ae86'
  | 's14_240sx' | 'integra_type_r' | 'eclipse_gsx'
  | 'supra_mk4' | 'silvia_s15' | 'rx7_fd' | 'evo_ix'
  | 'skyline_r34' | 'nsx_na1' | 'z370'
  | 'lfa' | 'gtr_r35' | 'demon' | 'gt3_rs'
  | 'widebody_legend_1' | 'widebody_legend_2' | 'widebody_legend_3'
  // Tier D additions
  | 'honda_crx' | 'sentra_ser' | 'starlet_gt' | 'swift_gti' | 'charade_turbo'
  | 'subaru_justy' | 'mazda_323_gtx' | 'honda_beat' | 'toyota_paseo'
  | 'nissan_pulsar' | 'mirage_cyborg' | 'geo_metro_lsi'
  // Tier C additions
  | 'honda_prelude' | 'celica_gt4' | 'nissan_200sx' | 'subaru_wrx'
  | 'mazda_mx6' | 'eagle_talon' | 'civic_type_r_ek9' | 'mr2_turbo'
  | 'pulsar_gtir' | 'mitsubishi_fto' | 'legacy_gt' | 'accord_euro_r'
  | 'protege_speed' | 'caldina_gtt' | 'avenir_gt4'
  // Tier B additions
  | 'z300_tt' | 'chaser_jzx100' | 'gto_tt' | 'impreza_22b' | 'honda_s2000'
  | 'mazda_cosmo' | 'toyota_aristo' | 'stagea_260rs' | 'legnum_vr4'
  | 'mazda_rx8' | 'legacy_sti' | 'integra_dc5' | 'toyota_altezza'
  | 'nissan_cefiro' | 'galant_vr4'
  // Tier A additions
  | 'toyota_2000gt' | 'fairlady_z432' | 'nsx_r' | 'mazda_787b' | 'wrx_sti_s209'
  | 'gr_yaris' | 'nissan_400z' | 'lexus_isf' | 'evo_x_fq400'
  | 'rx7_spirit_r' | 'brz_ts' | 'toyota_gr86' | 'silvia_spec_r'
  | 'civic_type_r_fk8' | 'lexus_rcf'
  // Tier S additions
  | 'gtr_nismo' | 'gr_super_sport' | 'nsx_type_s' | 'lexus_lc500'
  | 'mazda_furai' | 'subaru_viziv_gt' | 'toyota_ft1' | 'nissan_concept_2020'
  | 'evo_xi_concept' | 'nsx_gt3' | 'supra_a90' | 'nissan_z_proto'
  // Tier SS additions
  | 'shadow_weaver' | 'touge_ghost' | 'wangan_devil' | 'midnight_empress'
  | 'drift_reaper' | 'circuit_phantom' | 'thunder_ronin' | 'neon_shogun'
  | 'storm_yokai' | 'razor_tengu'

export type Tier = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS'

export type PartSlot =
  | 'engine' | 'turbo' | 'exhaust' | 'suspension' | 'tires' | 'nos' | 'weight' | 'transmission'
  | 'intercooler' | 'ecu' | 'clutch' | 'rollcage' | 'brakes' | 'intake' | 'headers' | 'flywheel' | 'fuel' | 'diff'

export type CosmeticSlot =
  | 'paint' | 'wheels' | 'bodykit' | 'spoiler' | 'underglow' | 'tint'
  | 'hood' | 'exhaust_tip' | 'decals' | 'mirrors' | 'seats' | 'roll_bar'

export type RaceTier = 'street' | 'highway' | 'circuit' | 'midnight'

export type View = 'garage' | 'race' | 'shop' | 'leaderboard'

export interface LeaderboardEntry {
  username: string
  rep: number
  totalCashEarned: number
  totalRacesWon: number
  topTier: Tier
  lastUpdated: number
}

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
  username: string
  totalRacesWon: number
  totalCashEarned: number
}
