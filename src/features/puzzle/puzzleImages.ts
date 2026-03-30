import bridgeImage from '../../assets/puzzle-bridge.svg'
import sunsetImage from '../../assets/puzzle-sunset.svg'

export type PuzzleImage = {
  accent: string
  fallbackSrc: string
  name: string
  src: string
}

export const PUZZLE_IMAGES: PuzzleImage[] = [
  {
    accent: '#77b9ff',
    fallbackSrc: bridgeImage,
    name: 'Costa turquesa',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=1200&q=80',
  },
  {
    accent: '#7ed3a8',
    fallbackSrc: sunsetImage,
    name: 'Lago alpino',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=1200&q=80',
  },
  {
    accent: '#f4a259',
    fallbackSrc: bridgeImage,
    name: 'Dunas doradas',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=1200&q=80',
  },
  {
    accent: '#a18bff',
    fallbackSrc: sunsetImage,
    name: 'Ciudad nocturna',
    src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&h=1200&q=80',
  },
]
