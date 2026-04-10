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
