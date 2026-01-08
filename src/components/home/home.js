import { useState } from 'react'
import Header from '../header/header'
import styles from './home.module.css'
import JoinWithCode from '../joinWithCode/joinWithCode'
import NotePassword from '../notePassword/notePassword'

function Home()
{
    
    const [displayJoinWithCode,setDisplayJoinWithCode] = useState(false)
    const [displayRedirectPageAnimation,setDisplayRedirectPageAnimation] = useState(false)
    const [displayNotePassword,setDisplayNotePassword] = useState(false)
    const [noteIdMemory,setNoteIdMemory] = useState('')

    return(
        <div className={styles.container}>

                <Header setDisplayJoinWithCode={setDisplayJoinWithCode}/>

                {displayJoinWithCode && <JoinWithCode setDisplayJoinWithCode={setDisplayJoinWithCode} setDisplayRedirectPageAnimation={setDisplayRedirectPageAnimation} setDisplayNotePassword={setDisplayNotePassword} setNoteIdMemory={setNoteIdMemory}/>}

                {displayNotePassword && <NotePassword setDisplayNotePassword={setDisplayNotePassword} noteIdMemory={noteIdMemory} setDisplayRedirectPageAnimation={setDisplayRedirectPageAnimation} setNoteIdMemory={setNoteIdMemory}/>}

                <div className={`${styles.redirectPage} ${displayRedirectPageAnimation?styles.redirectPageDisplay:''}`}></div>

        </div>
    )
}
export default Home