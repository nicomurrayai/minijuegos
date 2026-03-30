import { startTransition, useState } from 'react'
import { BackButton } from '../../components/BackButton'
import { PUZZLE_IMAGES } from './puzzleImages'
import {
  canMoveTile,
  createShuffledBoard,
  getSolvedTilePosition,
  GRID_SIZE,
  isBoardSolved,
  moveTile,
  type PuzzleBoard,
} from './puzzleUtils'

type PuzzleScreenProps = {
  onBack: () => void
}

function tileBackgroundPosition(tile: number) {
  const solvedPosition = getSolvedTilePosition(tile)
  const offset = 100 / (GRID_SIZE - 1)

  return `${offset * solvedPosition.column}% ${offset * solvedPosition.row}%`
}

export function PuzzleScreen({ onBack }: PuzzleScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [board, setBoard] = useState<PuzzleBoard>(() => createShuffledBoard())
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [moveCount, setMoveCount] = useState(0)

  const currentImage = PUZZLE_IMAGES[currentImageIndex]
  const usingFallbackImage = failedImages[currentImage.src] ?? false
  const resolvedImageSrc = usingFallbackImage ? currentImage.fallbackSrc : currentImage.src
  const isSolved = isBoardSolved(board)

  const resetGame = () => {
    setBoard(createShuffledBoard())
    setMoveCount(0)
  }

  const changeImage = () => {
    startTransition(() => {
      setCurrentImageIndex((index) => (index + 1) % PUZZLE_IMAGES.length)
      setBoard(createShuffledBoard())
      setMoveCount(0)
    })
  }

  const handleTileClick = (tileIndex: number) => {
    if (isSolved || !canMoveTile(board, tileIndex)) {
      return
    }

    setBoard(moveTile(board, tileIndex))
    setMoveCount((currentCount) => currentCount + 1)
  }

  const handlePreviewError = () => {
    setFailedImages((currentState) => {
      if (currentState[currentImage.src]) {
        return currentState
      }

      return {
        ...currentState,
        [currentImage.src]: true,
      }
    })
  }

  return (
    <section className="screen screen--game">
      <div className="screen-toolbar">
        <BackButton onClick={onBack} />
      </div>

      <div className="game-shell game-shell--puzzle">
        <header className="section-copy">
          <h1 className="section-title">PUZZLE 3X3</h1>
          <p className="section-meta">Movimientos: {moveCount}</p>
          <p className="status-copy">
            {isSolved
              ? 'Perfecto. La imagen ya esta completa.'
              : 'Desliza las piezas hasta igualar la referencia.'}
          </p>
        </header>

        <div className="puzzle-layout">
          <div className="puzzle-column">
            <div className={`puzzle-frame${isSolved ? ' puzzle-frame--solved' : ''}`}>
              <div className="puzzle-grid" role="grid" aria-label="Puzzle deslizante 3 por 3">
                {board.map((tile, index) => {
                  if (tile === null) {
                    return (
                      <div
                        key={index}
                        className="puzzle-tile puzzle-tile--empty"
                        aria-hidden="true"
                      />
                    )
                  }

                  const isMovable = canMoveTile(board, index) && !isSolved

                  return (
                    <button
                      key={index}
                      className={`puzzle-tile${isMovable ? ' puzzle-tile--movable' : ''}`}
                      type="button"
                      onClick={() => handleTileClick(index)}
                      aria-label={`Mover pieza ${tile + 1}`}
                      style={{
                        backgroundColor: currentImage.accent,
                        backgroundImage: `url(${resolvedImageSrc})`,
                        backgroundPosition: tileBackgroundPosition(tile),
                        backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                      }}
                    />
                  )
                })}
              </div>
            </div>

            <div className="puzzle-actions">
              <button
                className="action-button action-button--light"
                type="button"
                onClick={changeImage}
              >
                Cambiar imagen
              </button>
              <button
                className="action-button action-button--ghost"
                type="button"
                onClick={resetGame}
              >
                Reiniciar
              </button>
            </div>
          </div>

          <aside className="preview-card">
            <div className="preview-card__top">
              <span className="metric-label">RESULTADO FINAL</span>
              <span className="preview-chip">{currentImage.name}</span>
            </div>
            <img
              className="preview-card__image"
              src={resolvedImageSrc}
              alt={`Referencia ${currentImage.name}`}
              onError={usingFallbackImage ? undefined : handlePreviewError}
            />
            <p className="preview-card__copy">
              Usa esta imagen para completar el tablero lo mas rapido posible.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
