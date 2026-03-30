import { useEffect, useRef, useState } from 'react'
import { BackButton } from '../../components/BackButton'
import {
  getRandomSimonTileId,
  SIMON_TILES,
  type SimonPhase,
  type SimonTileId,
} from './simonConfig'

type SimonScreenProps = {
  onBack: () => void
}

export function SimonScreen({ onBack }: SimonScreenProps) {
  const [sequence, setSequence] = useState<SimonTileId[]>([])
  const [phase, setPhase] = useState<SimonPhase>('idle')
  const [score, setScore] = useState(0)
  const [inputIndex, setInputIndex] = useState(0)
  const [activeTile, setActiveTile] = useState<SimonTileId | null>(null)
  const timeoutIdsRef = useRef<number[]>([])

  const clearTimeouts = () => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId)
    })
    timeoutIdsRef.current = []
  }

  const playSequence = (nextSequence: SimonTileId[]) => {
    clearTimeouts()
    setPhase('showing')
    setInputIndex(0)
    setActiveTile(null)

    nextSequence.forEach((tileId, index) => {
      const startDelay = index * 680
      timeoutIdsRef.current.push(
        window.setTimeout(() => {
          setActiveTile(tileId)
        }, startDelay + 220),
      )
      timeoutIdsRef.current.push(
        window.setTimeout(() => {
          setActiveTile(null)
        }, startDelay + 540),
      )
    })

    timeoutIdsRef.current.push(
      window.setTimeout(
        () => {
          setActiveTile(null)
          setPhase('input')
        },
        nextSequence.length * 680 + 140,
      ),
    )
  }

  const startGame = () => {
    clearTimeouts()
    const openingSequence = [getRandomSimonTileId()]
    setSequence(openingSequence)
    setScore(0)
    setInputIndex(0)
    playSequence(openingSequence)
  }

  const flashInput = (tileId: SimonTileId) => {
    setActiveTile(tileId)
    timeoutIdsRef.current.push(
      window.setTimeout(() => {
        setActiveTile((currentTile) => (currentTile === tileId ? null : currentTile))
      }, 180),
    )
  }

  const handleTileClick = (tileId: SimonTileId) => {
    if (phase !== 'input') {
      return
    }

    flashInput(tileId)

    if (tileId !== sequence[inputIndex]) {
      clearTimeouts()
      setPhase('failed')
      setScore(0)
      setSequence([])
      setInputIndex(0)
      timeoutIdsRef.current.push(
        window.setTimeout(() => {
          setActiveTile(null)
        }, 320),
      )
      return
    }

    const nextInputIndex = inputIndex + 1

    if (nextInputIndex === sequence.length) {
      const nextScore = sequence.length
      const extendedSequence = [...sequence, getRandomSimonTileId()]

      setScore(nextScore)
      setSequence(extendedSequence)
      setPhase('showing')
      setInputIndex(0)
      timeoutIdsRef.current.push(
        window.setTimeout(() => {
          playSequence(extendedSequence)
        }, 720),
      )
      return
    }

    setInputIndex(nextInputIndex)
  }

  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [])

  const statusCopy =
    phase === 'idle'
      ? 'Observa la secuencia y repitela en el mismo orden.'
      : phase === 'showing'
        ? 'Memoriza la combinacion.'
        : phase === 'input'
          ? `Tu turno: paso ${inputIndex + 1} de ${sequence.length}.`
          : 'Fallaste la secuencia. Reinicia para volver a jugar.'

  const actionLabel =
    phase === 'idle' ? 'Comenzar' : phase === 'failed' ? 'Reintentar' : 'Reiniciar'

  return (
    <section className="screen screen--game">
      <div className="screen-toolbar">
        <BackButton onClick={onBack} />
      </div>

      <div className="game-shell">
        <header className="score-stack">
          <span className="metric-label">PUNTAJE</span>
          <strong className="score-value">{score}</strong>
        </header>

        <div className="simon-board" role="group" aria-label="Tablero Simon">
          <div className="simon-grid">
            {SIMON_TILES.map((tile) => (
              <button
                key={tile.id}
                className={`simon-pad simon-pad--${tile.colorClass}${
                  activeTile === tile.id ? ' simon-pad--active' : ''
                }`}
                type="button"
                onClick={() => handleTileClick(tile.id)}
                aria-pressed={activeTile === tile.id}
              >
                <span aria-hidden="true" className="simon-pad__icon">
                  {tile.icon}
                </span>
                <span className="visually-hidden">{tile.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="status-copy">{statusCopy}</p>

        <button
          className="action-button action-button--light simon-cta"
          type="button"
          onClick={startGame}
        >
          <span aria-hidden="true" className="play-glyph" />
          {actionLabel}
        </button>
      </div>
    </section>
  )
}
