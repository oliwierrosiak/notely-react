import { useState } from 'react'
import Header from '../main/main'
import styles from './home.module.css'
import JoinWithCode from '../joinWithCode/joinWithCode'
import NotePassword from '../notePassword/notePassword'
import AddingNote from '../addingNote/addingNote'

function Home()
{
    
    const [displayJoinWithCode,setDisplayJoinWithCode] = useState(false)
    const [displayRedirectPageAnimation,setDisplayRedirectPageAnimation] = useState(false)
    const [displayNotePassword,setDisplayNotePassword] = useState(false)
    const [noteIdMemory,setNoteIdMemory] = useState('')
    const [displayAddingNote,setDisplayAddingNote] = useState(false)

    return(
        <div className={styles.container}>

                <Header setDisplayJoinWithCode={setDisplayJoinWithCode} setDisplayAddingNote={setDisplayAddingNote}/>

                {displayJoinWithCode && <JoinWithCode setDisplayJoinWithCode={setDisplayJoinWithCode} setDisplayRedirectPageAnimation={setDisplayRedirectPageAnimation} setDisplayNotePassword={setDisplayNotePassword} setNoteIdMemory={setNoteIdMemory}/>}

                {displayNotePassword && <NotePassword notePassword={false} setDisplayNotePassword={setDisplayNotePassword} noteIdMemory={noteIdMemory} setDisplayRedirectPageAnimation={setDisplayRedirectPageAnimation} setNoteIdMemory={setNoteIdMemory}/>}

                {displayAddingNote && <AddingNote setDisplayAddingNote={setDisplayAddingNote} setDisplayRedirectPageAnimation={setDisplayRedirectPageAnimation}/>}

                <div className={`${styles.redirectPage} ${displayRedirectPageAnimation?styles.redirectPageDisplay:''}`}></div>

        </div>
    )
}
export default Home