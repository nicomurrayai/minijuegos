export type SimonTileId = 'flamingo' | 'runner' | 'cat' | 'icecream'

export type SimonPhase = 'idle' | 'showing' | 'input' | 'failed'

export type SimonTile = {
  colorClass: string
  icon: string
  id: SimonTileId
  label: string
}

export const SIMON_TILES: SimonTile[] = [
  {
    colorClass: 'green',
    icon: '🦩',
    id: 'flamingo',
    label: 'Flamenco',
  },
  {
    colorClass: 'red',
    icon: '🏃',
    id: 'runner',
    label: 'Corredor',
  },
  {
    colorClass: 'yellow',
    icon: '🐈',
    id: 'cat',
    label: 'Gato',
  },
  {
    colorClass: 'blue',
    icon: '🍦',
    id: 'icecream',
    label: 'Helado',
  },
]

export function getRandomSimonTileId() {
  return SIMON_TILES[Math.floor(Math.random() * SIMON_TILES.length)].id
}
