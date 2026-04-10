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
