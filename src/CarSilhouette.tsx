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
