import styles from './App.module.scss'
import { CharacterInfo } from './components/characterInfo/CharacterInfo'
import { Sidebar } from './components/sidebar/Sidebar'

function App() {

  return (
    <div className={styles.content}>
      <div className={styles.navbar}>RAVN Rick and Morty Register</div>
      <div className={styles.container}>
        <Sidebar/>
        <CharacterInfo/>
      </div>
    </div>
    
  )
}

export default App
