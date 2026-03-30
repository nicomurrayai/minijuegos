import bridgeImage from '../../assets/puzzle-bridge.svg'
import sunsetImage from '../../assets/puzzle-sunset.svg'

export type PuzzleImage = {
  accent: string
  name: string
  src: string
}

export const PUZZLE_IMAGES: PuzzleImage[] = [
  {
    accent: '#ff8d56',
    name: 'Costa Roja',
    src: bridgeImage,
  },
  {
    accent: '#7ac6ff',
    name: 'Noche Neon',
    src: sunsetImage,
  },
]
