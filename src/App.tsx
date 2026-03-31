import { startTransition, useState } from 'react'
import { MenuScreen } from './components/MenuScreen'
import { PuzzleScreen } from './features/puzzle/PuzzleScreen'
import { SimonScreen } from './features/simon/SimonScreen'
import { SlotMachineScreen } from './features/slotMachine/SlotMachineScreen'
import type { Screen } from './types'

function App() {
  const [screen, setScreen] = useState<Screen>('menu')

  const navigate = (nextScreen: Screen) => {
    startTransition(() => {
      setScreen(nextScreen)
    })
  }

  const renderScreen = () => {
    switch (screen) {
      case 'slot-machine':
        return <SlotMachineScreen onBack={() => navigate('menu')} />
      case 'simon':
        return <SimonScreen onBack={() => navigate('menu')} />
      case 'puzzle':
        return <PuzzleScreen onBack={() => navigate('menu')} />
      case 'menu':
      default:
        return <MenuScreen onSelect={navigate} />
    }
  }

  return (
    <main className={`app-shell app-shell--${screen}`}>
      <div className="app-shell__glow app-shell__glow--left" />
      <div className="app-shell__glow app-shell__glow--right" />
      {renderScreen()}
    </main>
  )
}

export default App
