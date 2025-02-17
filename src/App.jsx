import { useState } from 'react'
import './App.css'
import Spotifyapi from './components/Spotifyapi'
import FetchGame from './components/FetchGame'
import Calculator from './components/Calculator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Spotifyapi/>
    // <FetchGame/>
    // <Calculator/>
  )
}

export default App
