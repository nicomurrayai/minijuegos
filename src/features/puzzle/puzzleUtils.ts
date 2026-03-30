export const GRID_SIZE = 3
const EMPTY_TILE_INDEX = GRID_SIZE * GRID_SIZE - 1

export type PuzzleBoard = Array<number | null>

export function createSolvedBoard(): PuzzleBoard {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) =>
    index === EMPTY_TILE_INDEX ? null : index,
  )
}

export function isBoardSolved(board: PuzzleBoard) {
  return board.every((tile, index) => {
    if (index === EMPTY_TILE_INDEX) {
      return tile === null
    }

    return tile === index
  })
}

function indexToPoint(index: number) {
  return {
    column: index % GRID_SIZE,
    row: Math.floor(index / GRID_SIZE),
  }
}

export function getSolvedTilePosition(tile: number) {
  return indexToPoint(tile)
}

export function getNeighborIndices(index: number) {
  const { column, row } = indexToPoint(index)
  const neighbors: number[] = []

  if (column > 0) {
    neighbors.push(index - 1)
  }
  if (column < GRID_SIZE - 1) {
    neighbors.push(index + 1)
  }
  if (row > 0) {
    neighbors.push(index - GRID_SIZE)
  }
  if (row < GRID_SIZE - 1) {
    neighbors.push(index + GRID_SIZE)
  }

  return neighbors
}

function swapPositions(board: PuzzleBoard, leftIndex: number, rightIndex: number) {
  const nextBoard = [...board]
  ;[nextBoard[leftIndex], nextBoard[rightIndex]] = [
    nextBoard[rightIndex],
    nextBoard[leftIndex],
  ]
  return nextBoard
}

export function canMoveTile(board: PuzzleBoard, tileIndex: number) {
  const emptyIndex = board.indexOf(null)
  return getNeighborIndices(emptyIndex).includes(tileIndex)
}

export function moveTile(board: PuzzleBoard, tileIndex: number) {
  if (!canMoveTile(board, tileIndex)) {
    return board
  }

  const emptyIndex = board.indexOf(null)
  return swapPositions(board, emptyIndex, tileIndex)
}

export function createShuffledBoard(steps = 96): PuzzleBoard {
  let board = createSolvedBoard()
  let emptyIndex = board.indexOf(null)
  let previousEmptyIndex = -1

  for (let step = 0; step < steps; step += 1) {
    const neighborOptions = getNeighborIndices(emptyIndex).filter(
      (candidate) => candidate !== previousEmptyIndex,
    )
    const validOptions =
      neighborOptions.length > 0 ? neighborOptions : getNeighborIndices(emptyIndex)
    const nextIndex =
      validOptions[Math.floor(Math.random() * validOptions.length)] ?? validOptions[0]

    board = swapPositions(board, emptyIndex, nextIndex)
    previousEmptyIndex = emptyIndex
    emptyIndex = nextIndex
  }

  return isBoardSolved(board) ? createShuffledBoard(steps + 12) : board
}
