import { useGameStore } from './store'
import { CARS, PARTS, COSMETICS, CREW, GARAGE_SLOT_COSTS, getPartCost, getCosmeticCost, getUnlockedTier, tierRank } from './data'
import type { PartSlot, CosmeticSlot } from './types'
import './Shop.css'

export function Shop() {
  const {
    cars, selectedCarUid, cash, rep, garageSlots, crewMembers,
    upgradePart, upgradeCosmetic, buyCar, buyGarageSlot, buyCrewMember,
  } = useGameStore()

  const selectedCar = cars.find(c => c.uid === selectedCarUid)
  const currentTier = getUnlockedTier(rep)
  const ownedCarIds = new Set(cars.map(c => c.carId))

  return (
    <div className="shop">
      {selectedCar && (
        <section className="shop-section">
          <h3 className="shop-heading">UPGRADES — {CARS.find(c => c.id === selectedCar.carId)!.name}</h3>
          <div className="upgrade-grid">
            <div className="upgrade-column">
              <h4 className="upgrade-subhead">PERFORMANCE</h4>
              {PARTS.map(part => {
                const level = selectedCar.parts[part.slot]
                const maxed = level >= 5
                const cost = maxed ? 0 : getPartCost(part, level + 1)
                const canAfford = cash >= cost
                return (
                  <div key={part.slot} className="upgrade-card">
                    <div className="upgrade-info">
                      <span className="upgrade-name">{part.name}</span>
                      <div className="upgrade-pips">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`pip ${i < level ? 'filled' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <button
                      className={`upgrade-btn ${maxed ? 'maxed' : canAfford ? '' : 'cant-afford'}`}
                      onClick={() => upgradePart(selectedCar.uid, part.slot as PartSlot)}
                      disabled={maxed || !canAfford}
                    >
                      {maxed ? 'MAX' : `$${cost.toLocaleString()}`}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="upgrade-column">
              <h4 className="upgrade-subhead">COSMETICS</h4>
              {COSMETICS.map(cosmetic => {
                const level = selectedCar.cosmetics[cosmetic.slot]
                const maxed = level >= 5
                const cost = maxed ? 0 : getCosmeticCost(cosmetic, level + 1)
                const canAfford = cash >= cost
                return (
                  <div key={cosmetic.slot} className="upgrade-card">
                    <div className="upgrade-info">
                      <span className="upgrade-name">{cosmetic.name}</span>
                      <div className="upgrade-pips">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`pip ${i < level ? 'filled' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <button
                      className={`upgrade-btn ${maxed ? 'maxed' : canAfford ? '' : 'cant-afford'}`}
                      onClick={() => upgradeCosmetic(selectedCar.uid, cosmetic.slot as CosmeticSlot)}
                      disabled={maxed || !canAfford}
                    >
                      {maxed ? 'MAX' : `$${cost.toLocaleString()}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="shop-section">
        <h3 className="shop-heading">BUY CARS</h3>
        <div className="car-shop-grid">
          {CARS.filter(c => tierRank(currentTier) >= tierRank(c.tier)).map(carDef => {
            const owned = ownedCarIds.has(carDef.id)
            const canAfford = cash >= carDef.price
            const garageFull = cars.length >= garageSlots
            return (
              <div key={carDef.id} className={`car-shop-card ${owned ? 'owned' : ''}`}>
                <div className="car-shop-tier">TIER {carDef.tier}</div>
                <div className="car-shop-name">{carDef.name}</div>
                <div className="car-shop-year">{carDef.year}</div>
                {owned ? (
                  <div className="car-shop-owned">OWNED</div>
                ) : (
                  <button
                    className={`buy-car-btn ${!canAfford || garageFull ? 'cant-afford' : ''}`}
                    onClick={() => buyCar(carDef.id)}
                    disabled={!canAfford || garageFull}
                  >
                    {garageFull ? 'GARAGE FULL' : carDef.price === 0 ? 'FREE' : `$${carDef.price.toLocaleString()}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {garageSlots < 12 && (
        <section className="shop-section">
          <h3 className="shop-heading">GARAGE SLOT</h3>
          <p className="shop-desc">{garageSlots}/12 slots</p>
          <button
            className={`buy-slot-btn ${cash < (GARAGE_SLOT_COSTS[garageSlots] ?? 10_000_000) ? 'cant-afford' : ''}`}
            onClick={buyGarageSlot}
            disabled={cash < (GARAGE_SLOT_COSTS[garageSlots] ?? 10_000_000)}
          >
            BUY SLOT — ${(GARAGE_SLOT_COSTS[garageSlots] ?? 10_000_000).toLocaleString()}
          </button>
        </section>
      )}

      <section className="shop-section">
        <h3 className="shop-heading">CREW</h3>
        <div className="crew-grid">
          {CREW.map(crew => {
            const owned = crewMembers.includes(crew.id)
            const canAfford = cash >= crew.cost
            return (
              <div key={crew.id} className={`crew-card ${owned ? 'owned' : ''}`}>
                <div className="crew-name">{crew.name}</div>
                <div className="crew-income">+${crew.cashPerSecond}/s</div>
                {owned ? (
                  <div className="crew-hired">HIRED</div>
                ) : (
                  <button
                    className={`hire-btn ${!canAfford ? 'cant-afford' : ''}`}
                    onClick={() => buyCrewMember(crew.id)}
                    disabled={!canAfford}
                  >
                    ${crew.cost.toLocaleString()}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
