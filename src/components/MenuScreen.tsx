import type { Screen } from '../types'

type MenuScreenProps = {
  onSelect: (screen: Screen) => void
}

export function MenuScreen({ onSelect }: MenuScreenProps) {
  return (
    <section className="screen menu-screen">
      <div className="menu-screen__content">
        <p className="eyebrow">Panel arcade</p>
        <h1 className="display-title">MINI JUEGOS</h1>
        <div className="menu-actions">
          <button
            className="action-button action-button--light menu-button"
            type="button"
            onClick={() => onSelect('simon')}
          >
            SIMON
          </button>
          <button
            className="action-button action-button--light menu-button"
            type="button"
            onClick={() => onSelect('puzzle')}
          >
            PUZZLE
          </button>
        </div>
      </div>
    </section>
  )
}
