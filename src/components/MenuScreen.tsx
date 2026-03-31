import type { Screen } from '../types'

type MenuScreenProps = {
  onSelect: (screen: Screen) => void
}

const MENU_GAMES: Array<{
  accentClass: string
  description: string
  metric: string
  screen: Exclude<Screen, 'menu'>
  title: string
  type: string
}> = [
  {
    accentClass: 'simon',
    description:
      'Juego de memoria ideal para dinamicas de recordacion, velocidad y participacion inmediata.',
    metric: '4 pads',
    screen: 'simon',
    title: 'SIMON',
    type: 'Memoria',
  },
  {
    accentClass: 'puzzle',
    description:
      'Propuesta visual pensada para campañas donde la marca, el producto o la imagen final son protagonistas.',
    metric: '3x3',
    screen: 'puzzle',
    title: 'PUZZLE',
    type: 'Logica',
  },
  {
    accentClass: 'slot',
    description:
      'Tragamonedas promocional con alto impacto visual, ideal para premios, sorteos y acciones de captura.',
    metric: '3 reels',
    screen: 'slot-machine',
    title: 'SLOT MACHINE',
    type: 'Azar',
  },
]

export function MenuScreen({ onSelect }: MenuScreenProps) {
  return (
    <section className="screen menu-screen">
      <div className="menu-screen__orb menu-screen__orb--left" aria-hidden="true" />
      <div className="menu-screen__orb menu-screen__orb--right" aria-hidden="true" />

      <div className="menu-screen__content">
        <div className="menu-screen__hero">
          <div className="menu-screen__intro">
            <p className="eyebrow">Experiencias interactivas para marcas</p>
            <h1 className="display-title menu-screen__title">MINIJUEGOS</h1>
            <p className="menu-screen__summary">
              Una seleccion de minijuegos listos para activaciones, campañas y
              eventos. Disenados para captar atencion, generar participacion y
              adaptarse a distintas marcas.
            </p>

            <div className="menu-screen__tags" aria-label="Caracteristicas del panel">
              <span className="menu-screen__tag">Activaciones</span>
              <span className="menu-screen__tag">Campañas</span>
              <span className="menu-screen__tag">Eventos</span>
            </div>
          </div>
        </div>

        <div className="menu-screen__grid">
          {MENU_GAMES.map((game, index) => (
            <button
              key={game.screen}
              className={`menu-game-card menu-game-card--${game.accentClass}`}
              type="button"
              onClick={() => onSelect(game.screen)}
            >
              <div className="menu-game-card__top">
                <span className="menu-game-card__index">{`0${index + 1}`}</span>
                <span className="menu-game-card__type">{game.type}</span>
              </div>

              <div className="menu-game-card__copy">
                <h2 className="menu-game-card__title">{game.title}</h2>
                <p className="menu-game-card__description">{game.description}</p>
              </div>

              <div className="menu-game-card__bottom">
                <span className="menu-game-card__metric">{game.metric}</span>
                <span className="menu-game-card__cta">Ver juego</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
