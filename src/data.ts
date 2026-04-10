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
  // ── Tier D ───────────────────────────────────────────────────────────────────
  { id: 'civic_eg', name: 'Honda Civic EG', year: 1995, tier: 'D', price: 0, baseStats: { power: 105, grip: 40, weight: 1050, nosCapacity: 1, style: 5 }, color: '#8b9dc3' },
  { id: 'miata_na', name: 'Mazda Miata NA', year: 1993, tier: 'D', price: 3_000, baseStats: { power: 116, grip: 55, weight: 960, nosCapacity: 1, style: 10 }, color: '#cc3333' },
  { id: 'corolla_ae86', name: 'Toyota AE86', year: 1986, tier: 'D', price: 5_000, baseStats: { power: 128, grip: 50, weight: 940, nosCapacity: 1, style: 15 }, color: '#f0f0f0' },
  { id: 'honda_crx', name: 'Honda CRX Si', year: 1991, tier: 'D', price: 2_000, baseStats: { power: 108, grip: 48, weight: 920, nosCapacity: 1, style: 8 }, color: '#cc0000' },
  { id: 'sentra_ser', name: 'Nissan Sentra SE-R', year: 1994, tier: 'D', price: 2_500, baseStats: { power: 140, grip: 44, weight: 1090, nosCapacity: 1, style: 6 }, color: '#3355aa' },
  { id: 'starlet_gt', name: 'Toyota Starlet GT', year: 1997, tier: 'D', price: 3_500, baseStats: { power: 133, grip: 46, weight: 890, nosCapacity: 1, style: 9 }, color: '#ffffff' },
  { id: 'swift_gti', name: 'Suzuki Swift GTi', year: 1992, tier: 'D', price: 1_500, baseStats: { power: 101, grip: 43, weight: 850, nosCapacity: 1, style: 7 }, color: '#ff4400' },
  { id: 'charade_turbo', name: 'Daihatsu Charade Turbo', year: 1987, tier: 'D', price: 1_200, baseStats: { power: 93, grip: 38, weight: 750, nosCapacity: 1, style: 5 }, color: '#aaaacc' },
  { id: 'subaru_justy', name: 'Subaru Justy GLi', year: 1992, tier: 'D', price: 1_800, baseStats: { power: 97, grip: 41, weight: 840, nosCapacity: 1, style: 5 }, color: '#446688' },
  { id: 'mazda_323_gtx', name: 'Mazda 323 GTX', year: 1991, tier: 'D', price: 4_500, baseStats: { power: 148, grip: 52, weight: 1060, nosCapacity: 1, style: 12 }, color: '#cc4400' },
  { id: 'honda_beat', name: 'Honda Beat', year: 1993, tier: 'D', price: 3_800, baseStats: { power: 64, grip: 58, weight: 720, nosCapacity: 1, style: 14 }, color: '#ff6622' },
  { id: 'toyota_paseo', name: 'Toyota Paseo', year: 1995, tier: 'D', price: 2_200, baseStats: { power: 100, grip: 40, weight: 1020, nosCapacity: 1, style: 6 }, color: '#66aacc' },
  { id: 'nissan_pulsar', name: 'Nissan Pulsar N14', year: 1994, tier: 'D', price: 2_800, baseStats: { power: 111, grip: 42, weight: 1010, nosCapacity: 1, style: 7 }, color: '#888888' },
  { id: 'mirage_cyborg', name: 'Mitsubishi Mirage Cyborg', year: 1995, tier: 'D', price: 4_000, baseStats: { power: 135, grip: 45, weight: 970, nosCapacity: 1, style: 10 }, color: '#00aa66' },
  { id: 'geo_metro_lsi', name: 'Geo Metro LSi', year: 1993, tier: 'D', price: 800, baseStats: { power: 80, grip: 35, weight: 760, nosCapacity: 1, style: 3 }, color: '#dddddd' },

  // ── Tier C ───────────────────────────────────────────────────────────────────
  { id: 's14_240sx', name: 'Nissan 240SX S14', year: 1997, tier: 'C', price: 15_000, baseStats: { power: 155, grip: 60, weight: 1200, nosCapacity: 2, style: 20 }, color: '#e8d44d' },
  { id: 'integra_type_r', name: 'Acura Integra Type R', year: 1998, tier: 'C', price: 22_000, baseStats: { power: 195, grip: 65, weight: 1080, nosCapacity: 2, style: 25 }, color: '#f5f5dc' },
  { id: 'eclipse_gsx', name: 'Mitsubishi Eclipse GSX', year: 1999, tier: 'C', price: 30_000, baseStats: { power: 210, grip: 55, weight: 1340, nosCapacity: 2, style: 18 }, color: '#2a2a2a' },
  { id: 'honda_prelude', name: 'Honda Prelude Type S', year: 2001, tier: 'C', price: 18_000, baseStats: { power: 200, grip: 62, weight: 1250, nosCapacity: 2, style: 22 }, color: '#330066' },
  { id: 'celica_gt4', name: 'Toyota Celica GT-Four', year: 1999, tier: 'C', price: 28_000, baseStats: { power: 255, grip: 70, weight: 1350, nosCapacity: 2, style: 28 }, color: '#ffffff' },
  { id: 'nissan_200sx', name: 'Nissan 200SX S13', year: 1993, tier: 'C', price: 16_000, baseStats: { power: 140, grip: 58, weight: 1170, nosCapacity: 2, style: 18 }, color: '#222222' },
  { id: 'subaru_wrx', name: 'Subaru Impreza WRX', year: 2001, tier: 'C', price: 25_000, baseStats: { power: 218, grip: 68, weight: 1380, nosCapacity: 2, style: 20 }, color: '#1133bb' },
  { id: 'mazda_mx6', name: 'Mazda MX-6 Turbo', year: 1993, tier: 'C', price: 17_000, baseStats: { power: 185, grip: 60, weight: 1210, nosCapacity: 2, style: 20 }, color: '#994400' },
  { id: 'eagle_talon', name: 'Eagle Talon TSi AWD', year: 1998, tier: 'C', price: 20_000, baseStats: { power: 205, grip: 64, weight: 1310, nosCapacity: 2, style: 17 }, color: '#111111' },
  { id: 'civic_type_r_ek9', name: 'Honda Civic Type R EK9', year: 2000, tier: 'C', price: 35_000, baseStats: { power: 185, grip: 72, weight: 1060, nosCapacity: 2, style: 32 }, color: '#dd0000' },
  { id: 'mr2_turbo', name: 'Toyota MR2 Turbo', year: 1994, tier: 'C', price: 32_000, baseStats: { power: 245, grip: 68, weight: 1260, nosCapacity: 2, style: 30 }, color: '#cc2200' },
  { id: 'pulsar_gtir', name: 'Nissan Pulsar GTI-R', year: 1992, tier: 'C', price: 38_000, baseStats: { power: 230, grip: 66, weight: 1200, nosCapacity: 2, style: 22 }, color: '#4477cc' },
  { id: 'mitsubishi_fto', name: 'Mitsubishi FTO GPX', year: 1998, tier: 'C', price: 22_000, baseStats: { power: 200, grip: 63, weight: 1180, nosCapacity: 2, style: 24 }, color: '#aa0033' },
  { id: 'legacy_gt', name: 'Subaru Legacy GT', year: 2005, tier: 'C', price: 30_000, baseStats: { power: 250, grip: 65, weight: 1490, nosCapacity: 2, style: 18 }, color: '#334455' },
  { id: 'accord_euro_r', name: 'Honda Accord Euro R', year: 2002, tier: 'C', price: 26_000, baseStats: { power: 220, grip: 64, weight: 1310, nosCapacity: 2, style: 22 }, color: '#880000' },
  { id: 'protege_speed', name: 'Mazda Protege Mazdaspeed', year: 2003, tier: 'C', price: 19_000, baseStats: { power: 175, grip: 62, weight: 1190, nosCapacity: 2, style: 16 }, color: '#0055aa' },
  { id: 'caldina_gtt', name: 'Toyota Caldina GT-T', year: 2000, tier: 'C', price: 22_000, baseStats: { power: 260, grip: 60, weight: 1380, nosCapacity: 2, style: 14 }, color: '#666666' },
  { id: 'avenir_gt4', name: 'Nissan Avenir GT4', year: 1998, tier: 'C', price: 24_000, baseStats: { power: 240, grip: 62, weight: 1410, nosCapacity: 2, style: 13 }, color: '#224466' },

  // ── Tier B ───────────────────────────────────────────────────────────────────
  { id: 'supra_mk4', name: 'Toyota Supra MK4', year: 1994, tier: 'B', price: 60_000, baseStats: { power: 320, grip: 70, weight: 1510, nosCapacity: 3, style: 40 }, color: '#ff6600' },
  { id: 'silvia_s15', name: 'Nissan Silvia S15', year: 2000, tier: 'B', price: 75_000, baseStats: { power: 250, grip: 75, weight: 1240, nosCapacity: 3, style: 45 }, color: '#c0c0c0' },
  { id: 'rx7_fd', name: 'Mazda RX-7 FD', year: 1995, tier: 'B', price: 90_000, baseStats: { power: 276, grip: 80, weight: 1260, nosCapacity: 3, style: 50 }, color: '#ffcc00' },
  { id: 'evo_ix', name: 'Mitsubishi Evo IX', year: 2006, tier: 'B', price: 120_000, baseStats: { power: 286, grip: 85, weight: 1410, nosCapacity: 3, style: 35 }, color: '#0044cc' },
  { id: 'z300_tt', name: 'Nissan 300ZX Twin Turbo', year: 1996, tier: 'B', price: 65_000, baseStats: { power: 300, grip: 72, weight: 1560, nosCapacity: 3, style: 38 }, color: '#1a1a2e' },
  { id: 'chaser_jzx100', name: 'Toyota Chaser JZX100', year: 1998, tier: 'B', price: 70_000, baseStats: { power: 280, grip: 68, weight: 1480, nosCapacity: 3, style: 36 }, color: '#2c2c54' },
  { id: 'gto_tt', name: 'Mitsubishi GTO Twin Turbo', year: 1996, tier: 'B', price: 80_000, baseStats: { power: 320, grip: 70, weight: 1710, nosCapacity: 3, style: 34 }, color: '#cc2200' },
  { id: 'impreza_22b', name: 'Subaru Impreza 22B STi', year: 1998, tier: 'B', price: 150_000, baseStats: { power: 280, grip: 88, weight: 1270, nosCapacity: 3, style: 50 }, color: '#0033bb' },
  { id: 'honda_s2000', name: 'Honda S2000', year: 2005, tier: 'B', price: 85_000, baseStats: { power: 240, grip: 82, weight: 1270, nosCapacity: 3, style: 48 }, color: '#f0f0f0' },
  { id: 'mazda_cosmo', name: 'Mazda Cosmo Type E', year: 1992, tier: 'B', price: 95_000, baseStats: { power: 280, grip: 70, weight: 1420, nosCapacity: 3, style: 42 }, color: '#660033' },
  { id: 'toyota_aristo', name: 'Toyota Aristo V300', year: 2001, tier: 'B', price: 88_000, baseStats: { power: 320, grip: 72, weight: 1640, nosCapacity: 3, style: 38 }, color: '#111111' },
  { id: 'stagea_260rs', name: 'Nissan Stagea 260RS', year: 1997, tier: 'B', price: 110_000, baseStats: { power: 280, grip: 78, weight: 1600, nosCapacity: 3, style: 36 }, color: '#333333' },
  { id: 'legnum_vr4', name: 'Mitsubishi Legnum VR-4', year: 1998, tier: 'B', price: 75_000, baseStats: { power: 280, grip: 76, weight: 1590, nosCapacity: 3, style: 33 }, color: '#004488' },
  { id: 'mazda_rx8', name: 'Mazda RX-8 R3', year: 2011, tier: 'B', price: 78_000, baseStats: { power: 232, grip: 84, weight: 1310, nosCapacity: 3, style: 44 }, color: '#cc0000' },
  { id: 'legacy_sti', name: 'Subaru Legacy B4 STi', year: 2003, tier: 'B', price: 92_000, baseStats: { power: 260, grip: 80, weight: 1470, nosCapacity: 3, style: 38 }, color: '#002299' },
  { id: 'integra_dc5', name: 'Honda Integra Type R DC5', year: 2004, tier: 'B', price: 68_000, baseStats: { power: 220, grip: 83, weight: 1270, nosCapacity: 3, style: 44 }, color: '#cc0011' },
  { id: 'toyota_altezza', name: 'Toyota Altezza RS200', year: 2000, tier: 'B', price: 62_000, baseStats: { power: 210, grip: 75, weight: 1260, nosCapacity: 3, style: 38 }, color: '#eeeeee' },
  { id: 'nissan_cefiro', name: 'Nissan Cefiro A31', year: 1994, tier: 'B', price: 58_000, baseStats: { power: 210, grip: 68, weight: 1440, nosCapacity: 3, style: 32 }, color: '#888899' },
  { id: 'galant_vr4', name: 'Mitsubishi Galant VR-4', year: 1993, tier: 'B', price: 65_000, baseStats: { power: 240, grip: 72, weight: 1470, nosCapacity: 3, style: 30 }, color: '#224422' },

  // ── Tier A ───────────────────────────────────────────────────────────────────
  { id: 'skyline_r34', name: 'Nissan Skyline R34 GT-R', year: 2002, tier: 'A', price: 200_000, baseStats: { power: 330, grip: 90, weight: 1560, nosCapacity: 4, style: 60 }, color: '#4466bb' },
  { id: 'nsx_na1', name: 'Honda NSX', year: 1999, tier: 'A', price: 300_000, baseStats: { power: 290, grip: 95, weight: 1370, nosCapacity: 4, style: 70 }, color: '#aa0000' },
  { id: 'z370', name: 'Nissan 370Z', year: 2012, tier: 'A', price: 400_000, baseStats: { power: 332, grip: 78, weight: 1496, nosCapacity: 4, style: 55 }, color: '#333333' },
  { id: 'toyota_2000gt', name: 'Toyota 2000GT', year: 1967, tier: 'A', price: 210_000, baseStats: { power: 150, grip: 82, weight: 1120, nosCapacity: 4, style: 80 }, color: '#996600' },
  { id: 'fairlady_z432', name: 'Nissan Fairlady Z432', year: 1970, tier: 'A', price: 240_000, baseStats: { power: 160, grip: 78, weight: 1040, nosCapacity: 4, style: 78 }, color: '#aa6600' },
  { id: 'nsx_r', name: 'Honda NSX-R', year: 2002, tier: 'A', price: 380_000, baseStats: { power: 290, grip: 96, weight: 1270, nosCapacity: 4, style: 75 }, color: '#cc0000' },
  { id: 'mazda_787b', name: 'Mazda 787B', year: 1991, tier: 'A', price: 450_000, baseStats: { power: 700, grip: 88, weight: 830, nosCapacity: 4, style: 85 }, color: '#ff6600' },
  { id: 'wrx_sti_s209', name: 'Subaru WRX STI S209', year: 2019, tier: 'A', price: 320_000, baseStats: { power: 341, grip: 90, weight: 1510, nosCapacity: 4, style: 58 }, color: '#0033aa' },
  { id: 'gr_yaris', name: 'Toyota GR Yaris', year: 2021, tier: 'A', price: 260_000, baseStats: { power: 261, grip: 88, weight: 1280, nosCapacity: 4, style: 60 }, color: '#cc2200' },
  { id: 'nissan_400z', name: 'Nissan 400Z', year: 2024, tier: 'A', price: 350_000, baseStats: { power: 400, grip: 82, weight: 1590, nosCapacity: 4, style: 62 }, color: '#222244' },
  { id: 'lexus_isf', name: 'Lexus IS-F', year: 2014, tier: 'A', price: 280_000, baseStats: { power: 416, grip: 80, weight: 1765, nosCapacity: 4, style: 60 }, color: '#111111' },
  { id: 'evo_x_fq400', name: 'Mitsubishi Evo X FQ-400', year: 2010, tier: 'A', price: 420_000, baseStats: { power: 400, grip: 92, weight: 1560, nosCapacity: 4, style: 55 }, color: '#003399' },
  { id: 'rx7_spirit_r', name: 'Mazda RX-7 Spirit R', year: 2002, tier: 'A', price: 480_000, baseStats: { power: 280, grip: 90, weight: 1220, nosCapacity: 4, style: 80 }, color: '#cc6600' },
  { id: 'brz_ts', name: 'Subaru BRZ tS', year: 2018, tier: 'A', price: 210_000, baseStats: { power: 205, grip: 88, weight: 1270, nosCapacity: 4, style: 58 }, color: '#002244' },
  { id: 'toyota_gr86', name: 'Toyota GR86', year: 2022, tier: 'A', price: 230_000, baseStats: { power: 228, grip: 86, weight: 1270, nosCapacity: 4, style: 58 }, color: '#cc1100' },
  { id: 'silvia_spec_r', name: 'Nissan Silvia Spec-R', year: 2002, tier: 'A', price: 250_000, baseStats: { power: 250, grip: 84, weight: 1280, nosCapacity: 4, style: 62 }, color: '#dddddd' },
  { id: 'civic_type_r_fk8', name: 'Honda Civic Type R FK8', year: 2022, tier: 'A', price: 300_000, baseStats: { power: 315, grip: 88, weight: 1390, nosCapacity: 4, style: 64 }, color: '#cc0000' },
  { id: 'lexus_rcf', name: 'Lexus RC-F Track Edition', year: 2023, tier: 'A', price: 550_000, baseStats: { power: 472, grip: 84, weight: 1840, nosCapacity: 4, style: 68 }, color: '#111111' },

  // ── Tier S ───────────────────────────────────────────────────────────────────
  { id: 'lfa', name: 'Lexus LFA', year: 2012, tier: 'S', price: 800_000, baseStats: { power: 553, grip: 92, weight: 1480, nosCapacity: 5, style: 85 }, color: '#f0f0ff' },
  { id: 'gtr_r35', name: 'Nissan GT-R R35', year: 2020, tier: 'S', price: 1_200_000, baseStats: { power: 565, grip: 95, weight: 1740, nosCapacity: 5, style: 75 }, color: '#888888' },
  { id: 'demon', name: 'Dodge Demon', year: 2018, tier: 'S', price: 1_500_000, baseStats: { power: 840, grip: 60, weight: 1894, nosCapacity: 5, style: 65 }, color: '#ff2200' },
  { id: 'gt3_rs', name: 'Porsche 911 GT3 RS', year: 2023, tier: 'S', price: 2_000_000, baseStats: { power: 518, grip: 99, weight: 1450, nosCapacity: 5, style: 90 }, color: '#00cc44' },
  { id: 'gtr_nismo', name: 'Nissan GT-R Nismo', year: 2024, tier: 'S', price: 2_200_000, baseStats: { power: 600, grip: 97, weight: 1720, nosCapacity: 5, style: 82 }, color: '#cc0000' },
  { id: 'gr_super_sport', name: 'Toyota GR Super Sport', year: 2023, tier: 'S', price: 2_800_000, baseStats: { power: 986, grip: 96, weight: 1100, nosCapacity: 5, style: 92 }, color: '#cc2200' },
  { id: 'nsx_type_s', name: 'Acura NSX Type S', year: 2022, tier: 'S', price: 1_800_000, baseStats: { power: 600, grip: 95, weight: 1725, nosCapacity: 5, style: 88 }, color: '#333333' },
  { id: 'lexus_lc500', name: 'Lexus LC500 Sport+', year: 2023, tier: 'S', price: 1_600_000, baseStats: { power: 471, grip: 88, weight: 1925, nosCapacity: 5, style: 90 }, color: '#111100' },
  { id: 'mazda_furai', name: 'Mazda Furai Concept', year: 2008, tier: 'S', price: 3_000_000, baseStats: { power: 450, grip: 98, weight: 890, nosCapacity: 5, style: 96 }, color: '#cc3300' },
  { id: 'subaru_viziv_gt', name: 'Subaru Viziv GT Concept', year: 2020, tier: 'S', price: 2_500_000, baseStats: { power: 590, grip: 94, weight: 1350, nosCapacity: 5, style: 89 }, color: '#0022cc' },
  { id: 'toyota_ft1', name: 'Toyota FT-1 Vision GT', year: 2019, tier: 'S', price: 2_600_000, baseStats: { power: 620, grip: 93, weight: 1300, nosCapacity: 5, style: 94 }, color: '#cc3300' },
  { id: 'nissan_concept_2020', name: 'Nissan GT-R Concept 2020', year: 2020, tier: 'S', price: 2_400_000, baseStats: { power: 700, grip: 96, weight: 1450, nosCapacity: 5, style: 91 }, color: '#220044' },
  { id: 'evo_xi_concept', name: 'Mitsubishi Evo XI Concept', year: 2022, tier: 'S', price: 1_900_000, baseStats: { power: 500, grip: 97, weight: 1340, nosCapacity: 5, style: 85 }, color: '#cc0000' },
  { id: 'nsx_gt3', name: 'Acura NSX GT3 Evo', year: 2021, tier: 'S', price: 2_300_000, baseStats: { power: 500, grip: 99, weight: 1300, nosCapacity: 5, style: 93 }, color: '#111111' },
  { id: 'supra_a90', name: 'Toyota Supra A90 GR', year: 2023, tier: 'S', price: 1_400_000, baseStats: { power: 382, grip: 88, weight: 1395, nosCapacity: 5, style: 80 }, color: '#3300aa' },
  { id: 'nissan_z_proto', name: 'Nissan Z Proto Nismo', year: 2024, tier: 'S', price: 1_700_000, baseStats: { power: 420, grip: 91, weight: 1490, nosCapacity: 5, style: 83 }, color: '#f0c000' },

  // ── Tier SS ──────────────────────────────────────────────────────────────────
  { id: 'widebody_legend_1', name: 'Midnight Phantom', year: 2026, tier: 'SS', price: 5_000_000, baseStats: { power: 1000, grip: 95, weight: 1300, nosCapacity: 6, style: 100 }, color: '#1a0033' },
  { id: 'widebody_legend_2', name: 'Neon Ronin', year: 2026, tier: 'SS', price: 8_000_000, baseStats: { power: 1100, grip: 90, weight: 1250, nosCapacity: 6, style: 100 }, color: '#00f0ff' },
  { id: 'widebody_legend_3', name: 'Sakura Drift King', year: 2026, tier: 'SS', price: 12_000_000, baseStats: { power: 1200, grip: 98, weight: 1200, nosCapacity: 7, style: 100 }, color: '#ff69b4' },
  { id: 'shadow_weaver', name: 'Shadow Weaver', year: 2026, tier: 'SS', price: 6_000_000, baseStats: { power: 1050, grip: 96, weight: 1180, nosCapacity: 6, style: 100 }, color: '#0a0a0a' },
  { id: 'touge_ghost', name: 'Touge Ghost', year: 2026, tier: 'SS', price: 7_000_000, baseStats: { power: 980, grip: 99, weight: 1140, nosCapacity: 6, style: 100 }, color: '#e8e8ff' },
  { id: 'wangan_devil', name: 'Wangan Devil', year: 2026, tier: 'SS', price: 9_000_000, baseStats: { power: 1150, grip: 92, weight: 1220, nosCapacity: 6, style: 100 }, color: '#880000' },
  { id: 'midnight_empress', name: 'Midnight Empress', year: 2026, tier: 'SS', price: 10_000_000, baseStats: { power: 1090, grip: 94, weight: 1190, nosCapacity: 6, style: 100 }, color: '#330033' },
  { id: 'drift_reaper', name: 'Drift Reaper', year: 2026, tier: 'SS', price: 7_500_000, baseStats: { power: 1020, grip: 97, weight: 1160, nosCapacity: 6, style: 100 }, color: '#003300' },
  { id: 'circuit_phantom', name: 'Circuit Phantom', year: 2026, tier: 'SS', price: 8_500_000, baseStats: { power: 1070, grip: 98, weight: 1150, nosCapacity: 7, style: 100 }, color: '#001133' },
  { id: 'thunder_ronin', name: 'Thunder Ronin', year: 2026, tier: 'SS', price: 11_000_000, baseStats: { power: 1160, grip: 93, weight: 1230, nosCapacity: 7, style: 100 }, color: '#554400' },
  { id: 'neon_shogun', name: 'Neon Shogun', year: 2026, tier: 'SS', price: 15_000_000, baseStats: { power: 1250, grip: 95, weight: 1170, nosCapacity: 7, style: 100 }, color: '#ff00aa' },
  { id: 'storm_yokai', name: 'Storm Yokai', year: 2026, tier: 'SS', price: 18_000_000, baseStats: { power: 1300, grip: 96, weight: 1160, nosCapacity: 7, style: 100 }, color: '#0044ff' },
  { id: 'razor_tengu', name: 'Razor Tengu', year: 2026, tier: 'SS', price: 25_000_000, baseStats: { power: 1400, grip: 99, weight: 1100, nosCapacity: 8, style: 100 }, color: '#cc4400' },
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
  // New parts
  { slot: 'intercooler', name: 'Intercooler', statBoosts: { power: 25 }, baseCost: 1_800, costMultiplier: 2.3 },
  { slot: 'ecu', name: 'ECU Tune', statBoosts: { power: 35 }, baseCost: 2_500, costMultiplier: 2.6 },
  { slot: 'clutch', name: 'Racing Clutch', statBoosts: { grip: 10 }, baseCost: 1_200, costMultiplier: 2.0 },
  { slot: 'rollcage', name: 'Roll Cage', statBoosts: { grip: 6, weight: -40 }, baseCost: 3_000, costMultiplier: 2.5 },
  { slot: 'brakes', name: 'Big Brake Kit', statBoosts: { grip: 15 }, baseCost: 2_000, costMultiplier: 2.3 },
  { slot: 'intake', name: 'Cold Air Intake', statBoosts: { power: 20 }, baseCost: 600, costMultiplier: 1.8 },
  { slot: 'headers', name: 'Racing Headers', statBoosts: { power: 18 }, baseCost: 1_000, costMultiplier: 2.0 },
  { slot: 'flywheel', name: 'Lightweight Flywheel', statBoosts: { weight: -30 }, baseCost: 900, costMultiplier: 1.9 },
  { slot: 'fuel', name: 'Fuel System', statBoosts: { power: 30 }, baseCost: 1_500, costMultiplier: 2.4 },
  { slot: 'diff', name: 'Limited Slip Diff', statBoosts: { grip: 14 }, baseCost: 2_200, costMultiplier: 2.3 },
]

export const COSMETICS: CosmeticDefinition[] = [
  { slot: 'paint', name: 'Paint Job', stylePerLevel: 5, baseCost: 500, costMultiplier: 1.8 },
  { slot: 'wheels', name: 'Aftermarket Wheels', stylePerLevel: 6, baseCost: 800, costMultiplier: 2.0 },
  { slot: 'bodykit', name: 'Body Kit', stylePerLevel: 8, baseCost: 1_200, costMultiplier: 2.2 },
  { slot: 'spoiler', name: 'Rear Spoiler', stylePerLevel: 4, baseCost: 400, costMultiplier: 1.6 },
  { slot: 'underglow', name: 'Underglow', stylePerLevel: 7, baseCost: 600, costMultiplier: 1.5 },
  { slot: 'tint', name: 'Window Tint', stylePerLevel: 3, baseCost: 300, costMultiplier: 1.4 },
  // New cosmetics
  { slot: 'hood', name: 'Carbon Hood', stylePerLevel: 5, baseCost: 700, costMultiplier: 1.7 },
  { slot: 'exhaust_tip', name: 'Exhaust Tip', stylePerLevel: 3, baseCost: 350, costMultiplier: 1.5 },
  { slot: 'decals', name: 'Racing Decals', stylePerLevel: 4, baseCost: 250, costMultiplier: 1.4 },
  { slot: 'mirrors', name: 'Carbon Mirrors', stylePerLevel: 3, baseCost: 400, costMultiplier: 1.5 },
  { slot: 'seats', name: 'Bucket Seats', stylePerLevel: 5, baseCost: 900, costMultiplier: 1.8 },
  { slot: 'roll_bar', name: 'Show Roll Bar', stylePerLevel: 4, baseCost: 600, costMultiplier: 1.6 },
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
