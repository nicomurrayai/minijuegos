import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { BackButton } from '../../components/BackButton'
import {
  createSlotRound,
  SLOT_CONFIG,
  SLOT_INITIAL_RESULTS,
  SLOT_REEL_COUNT,
  SLOT_SERVICE_ICONS,
  type SlotOutcome,
  type SlotServiceIcon,
} from './slotMachineConfig'

type SlotMachineScreenProps = {
  onBack: () => void
}

type ReelProps = {
  icon: SlotServiceIcon
  isSpinning: boolean
}

const LIGHTS = Array.from({ length: 6 }, (_, index) => index)
const REEL_INDEXES = Array.from({ length: SLOT_REEL_COUNT }, (_, index) => index)
const OUTCOME_MODAL_AUTO_CLOSE = 3200
const CONFETTI_PIECES = [
  { left: '8%', color: '#ff5f45', delay: '0s', duration: '2.7s', rotation: '-16deg' },
  { left: '18%', color: '#ffd166', delay: '0.2s', duration: '3s', rotation: '12deg' },
  { left: '26%', color: '#fff3d6', delay: '0.05s', duration: '2.4s', rotation: '-10deg' },
  { left: '34%', color: '#ff8c69', delay: '0.35s', duration: '2.9s', rotation: '18deg' },
  { left: '42%', color: '#ffe39a', delay: '0.15s', duration: '2.6s', rotation: '-22deg' },
  { left: '50%', color: '#ffffff', delay: '0.4s', duration: '3.1s', rotation: '10deg' },
  { left: '58%', color: '#ff5f45', delay: '0.1s', duration: '2.5s', rotation: '-14deg' },
  { left: '66%', color: '#ffd166', delay: '0.3s', duration: '3s', rotation: '20deg' },
  { left: '74%', color: '#fff3d6', delay: '0.12s', duration: '2.8s', rotation: '-18deg' },
  { left: '82%', color: '#ff8c69', delay: '0.45s', duration: '2.7s', rotation: '16deg' },
  { left: '90%', color: '#ffe39a', delay: '0.22s', duration: '3.05s', rotation: '-12deg' },
] as const

type ConfettiStyle = CSSProperties & {
  '--confetti-color': string
  '--confetti-delay': string
  '--confetti-duration': string
  '--confetti-left': string
  '--confetti-rotation': string
}

function getConfettiStyle(piece: (typeof CONFETTI_PIECES)[number]): ConfettiStyle {
  return {
    '--confetti-color': piece.color,
    '--confetti-delay': piece.delay,
    '--confetti-duration': piece.duration,
    '--confetti-left': piece.left,
    '--confetti-rotation': piece.rotation,
  }
}

function Reel({ icon, isSpinning }: ReelProps) {
  return (
    <div className="slot-machine-ref__reel">
      <div className="slot-machine-ref__reel-core">
        {isSpinning ? (
          <div className="slot-machine-ref__reel-strip">
            {SLOT_SERVICE_ICONS.map((item) => (
              <div key={item.id} className="slot-machine-ref__reel-item">
                <img
                  className="slot-machine-ref__reel-image"
                  src={item.image}
                  alt={item.label}
                  loading="eager"
                />
              </div>
            ))}
            {SLOT_SERVICE_ICONS.map((item) => (
              <div key={`${item.id}-dup`} className="slot-machine-ref__reel-item">
                <img
                  className="slot-machine-ref__reel-image"
                  src={item.image}
                  alt={item.label}
                  loading="eager"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="slot-machine-ref__reel-result">
            <img
              className="slot-machine-ref__reel-image slot-machine-ref__reel-image--result"
              src={icon.image}
              alt={icon.label}
              loading="eager"
            />
            <span className="slot-machine-ref__reel-label">{icon.label}</span>
          </div>
        )}
      </div>

      <div className="slot-machine-ref__reel-overlay slot-machine-ref__reel-overlay--vertical" />
      <div className="slot-machine-ref__reel-overlay slot-machine-ref__reel-overlay--horizontal" />
    </div>
  )
}

export function SlotMachineScreen({ onBack }: SlotMachineScreenProps) {
  const [spinning, setSpinning] = useState<boolean[]>(() => new Array(SLOT_REEL_COUNT).fill(false))
  const [results, setResults] = useState<SlotServiceIcon[]>(() => [...SLOT_INITIAL_RESULTS])
  const [hasStarted, setHasStarted] = useState(false)
  const [isLeverPulled, setIsLeverPulled] = useState(false)
  const [gameResult, setGameResult] = useState<SlotOutcome | null>(null)
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false)
  const timeoutIdsRef = useRef<number[]>([])

  const clearTimeouts = () => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId)
    })
    timeoutIdsRef.current = []
  }

  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [])

  const isSpinning = spinning.some(Boolean)
  const outcomeTitle = gameResult?.isWinner ? 'Ganaste' : 'Segui intentando'
  const outcomeMessage = gameResult?.isWinner
    ? 'Tu giro termino con una combinacion ganadora.'
    : 'Esta vez no hubo combinacion ganadora.'

  const closeOutcomeModal = () => {
    setIsOutcomeModalOpen(false)
  }

  const startSpin = () => {
    if (isSpinning) {
      return
    }

    clearTimeouts()

    const round = createSlotRound()

    setIsLeverPulled(true)
    timeoutIdsRef.current.push(
      window.setTimeout(() => {
        setIsLeverPulled(false)
      }, SLOT_CONFIG.LEVER_RESET_DELAY),
    )

    setHasStarted(true)
    setGameResult(null)
    setIsOutcomeModalOpen(false)
    setSpinning(new Array(SLOT_REEL_COUNT).fill(true))

    REEL_INDEXES.forEach((reelIndex) => {
      timeoutIdsRef.current.push(
        window.setTimeout(() => {
          setSpinning((currentState) =>
            currentState.map((value, index) => (index === reelIndex ? false : value)),
          )
          setResults((currentResults) =>
            currentResults.map((icon, index) => (index === reelIndex ? round.icons[reelIndex] : icon)),
          )

          if (reelIndex === SLOT_REEL_COUNT - 1) {
            setGameResult(round.outcome)
            setIsOutcomeModalOpen(true)
            timeoutIdsRef.current.push(
              window.setTimeout(() => {
                setIsOutcomeModalOpen(false)
              }, OUTCOME_MODAL_AUTO_CLOSE),
            )
          }
        }, SLOT_CONFIG.SPIN_DURATION + reelIndex * SLOT_CONFIG.REEL_DELAY),
      )
    })
  }

  return (
    <section className="screen screen--game">
      <div className="screen-toolbar">
        <BackButton onClick={onBack} />
      </div>

      <div className="game-shell game-shell--slot slot-machine-ref">
        <header className="section-copy slot-machine-ref__header">
          <p className="eyebrow">Panel arcade</p>
          <h1 className="section-title">Slot Machine</h1>
        </header>

        <div className="slot-machine-ref__machine-wrap">
          <button
            className={`slot-machine-ref__lever${
              isLeverPulled ? ' slot-machine-ref__lever--pulled' : ''
            }${isSpinning ? ' slot-machine-ref__lever--disabled' : ''}`}
            type="button"
            onClick={startSpin}
            disabled={isSpinning}
            aria-label={isSpinning ? 'La palanca esta ocupada' : 'Tirar de la palanca'}
          >
            <span aria-hidden="true" className="slot-machine-ref__lever-support" />
            <span aria-hidden="true" className="slot-machine-ref__lever-body">
              <span className="slot-machine-ref__lever-stem" />
              <span className="slot-machine-ref__lever-knob" />
            </span>
            <span aria-hidden="true" className="slot-machine-ref__lever-hub">
              <span className="slot-machine-ref__lever-hub-core" />
            </span>
          </button>

          <div
            className={`slot-machine-ref__machine${
              hasStarted ? ' slot-machine-ref__machine--active' : ''
            }${gameResult?.isWinner ? ' slot-machine-ref__machine--winner' : ''}`}
          >
            <div className="slot-machine-ref__lights slot-machine-ref__lights--left" aria-hidden="true">
              {LIGHTS.map((lightIndex) => (
                <span key={`left-${lightIndex}`} className="slot-machine-ref__light" />
              ))}
            </div>

            <div className="slot-machine-ref__lights slot-machine-ref__lights--right" aria-hidden="true">
              {LIGHTS.map((lightIndex) => (
                <span key={`right-${lightIndex}`} className="slot-machine-ref__light" />
              ))}
            </div>

            <div className="slot-machine-ref__window">
              <div className="slot-machine-ref__reels" role="img" aria-label="Tragamonedas con tres rodillos">
                {REEL_INDEXES.map((reelIndex) => (
                  <Reel key={reelIndex} isSpinning={spinning[reelIndex]} icon={results[reelIndex]} />
                ))}
              </div>
            </div>
          </div>

          {gameResult && isOutcomeModalOpen ? (
            <div className="slot-machine-ref__modal-backdrop" role="presentation">
              <div
                className={`slot-machine-ref__modal${
                  gameResult.isWinner ? ' slot-machine-ref__modal--winner' : ''
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="slot-machine-result-title"
              >
                {gameResult.isWinner ? (
                  <div className="slot-machine-ref__confetti" aria-hidden="true">
                    {CONFETTI_PIECES.map((piece, index) => (
                      <span
                        key={`${piece.left}-${index}`}
                        className="slot-machine-ref__confetti-piece"
                        style={getConfettiStyle(piece)}
                      />
                    ))}
                  </div>
                ) : null}

                <div className="slot-machine-ref__modal-copy">
                  <p className="slot-machine-ref__modal-eyebrow">
                    {gameResult.isWinner ? 'Resultado ganador' : 'Resultado del giro'}
                  </p>
                  <h2 id="slot-machine-result-title" className="slot-machine-ref__modal-title">
                    {outcomeTitle}
                  </h2>
                  <p className="slot-machine-ref__modal-text">{outcomeMessage}</p>
                </div>

                <button
                  className="slot-machine-ref__modal-close"
                  type="button"
                  onClick={closeOutcomeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
