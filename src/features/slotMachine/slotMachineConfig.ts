export type SlotServiceIconId = 'sos' | 'grua' | 'moto' | 'moura' | 'lusqtoff'

export type SlotServiceIcon = {
  color: string
  id: SlotServiceIconId
  image: string
  label: string
}

export type SlotOutcome = {
  isWinner: boolean
  prize?: null | string
  winningIcon?: null | SlotServiceIcon
}

export const SLOT_REEL_COUNT = 3

export const SLOT_SERVICE_ICONS: SlotServiceIcon[] = [
  { id: 'sos', image: '/slot-machine/sos-logo.png', label: 'SOS', color: '#ff4020' },
  { id: 'grua', image: '/slot-machine/camion.png', label: 'Grua', color: '#f5a623' },
  { id: 'moto', image: '/slot-machine/moto.png', label: 'Moto', color: '#4a90e2' },
  {
    id: 'moura',
    image: '/slot-machine/moura-logo.png',
    label: 'Moura',
    color: '#113c70',
  },
  {
    id: 'lusqtoff',
    image: '/slot-machine/lusqtoff.png',
    label: 'Lusqtoff',
    color: '#ff6f00',
  },
]

export const SLOT_INITIAL_RESULTS = SLOT_SERVICE_ICONS.slice(0, SLOT_REEL_COUNT)

export const SLOT_CONFIG = {
  LEVER_RESET_DELAY: 500,
  REEL_DELAY: 2500,
  SPIN_DURATION: 2000,
  WIN_PROBABILITY: 0.15,
}

function getRandomServiceIcon() {
  return SLOT_SERVICE_ICONS[Math.floor(Math.random() * SLOT_SERVICE_ICONS.length)]
}

function createLosingIcons() {
  const icons: SlotServiceIcon[] = []

  while (icons.length < SLOT_REEL_COUNT) {
    icons.push(getRandomServiceIcon())
  }

  const allEqual = icons.every((icon) => icon.id === icons[0].id)

  if (!allEqual) {
    return icons
  }

  const otherIcons = SLOT_SERVICE_ICONS.filter((icon) => icon.id !== icons[0].id)
  icons[SLOT_REEL_COUNT - 1] =
    otherIcons[Math.floor(Math.random() * otherIcons.length)] ?? otherIcons[0]

  return icons
}

export function createSlotRound() {
  if (Math.random() < SLOT_CONFIG.WIN_PROBABILITY) {
    const winningIcon = getRandomServiceIcon()

    return {
      icons: Array.from({ length: SLOT_REEL_COUNT }, () => winningIcon),
      outcome: {
        isWinner: true,
        prize: winningIcon.label,
        winningIcon,
      } satisfies SlotOutcome,
    }
  }

  return {
    icons: createLosingIcons(),
    outcome: {
      isWinner: false,
      prize: null,
      winningIcon: null,
    } satisfies SlotOutcome,
  }
}
