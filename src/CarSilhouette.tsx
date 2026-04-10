import type { OwnedCar } from './types'
export function CarSilhouette(_props: { car: OwnedCar; width?: number; glowing?: boolean }) {
  return <svg width={200} height={80}><rect fill="#333" width="200" height="80" rx="8" /></svg>
}
