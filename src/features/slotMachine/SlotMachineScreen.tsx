import { useEffect, useRef, useState } from 'react'
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
        </div>
      </div>
    </section>
  )
}
