import { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../nav/nav'
import styles from './main.module.css'
import LoginPage from '../login/loginPage'
import LoginContext from '../../context/loginContext'
import DisplayLoginContext from '../../context/displayLogin'
import NotesMenu from '../notesMenu/notesMenu'

function Main(props)
{
    const btn1HoverRef = useRef()
    const btn2HoverRef = useRef()

    let touchStartPositionY = 0
    let touchStartPositionX = 0

    const loginContext = useContext(LoginContext)
    const displayLoginContext = useContext(DisplayLoginContext)

    const [displayNotesMenu,setDisplayNotesMenu] = useState(false)
    const [displayColdStartInfo,setDisplayColdStartInfo] = useState(false)

    const btnHovered = (target) =>{
        target === "1"?btn1HoverRef.current.classList.add(styles.buttonHoverDisplay):btn2HoverRef.current.classList.add(styles.buttonHoverDisplay)
    }

    const btnUnHover = (e) =>{
        btn1HoverRef.current.classList.remove(styles.buttonHoverDisplay)
        btn2HoverRef.current.classList.remove(styles.buttonHoverDisplay)
    }

    const codeClicked = (e) =>
    {
        if(loginContext.loginLoading)
        {
            return  
        }
        if(loginContext.logged)
        {
            props.setDisplayJoinWithCode(true)
        }
        else
        {
            displayLoginContext.setDisplayLogin('login')
        }
    }

    const createClicked = (e) =>
    {
        if(loginContext.loginLoading)
        {
            return  
        }
        if(loginContext.logged)
        {
            props.setDisplayAddingNote(true)
        }
        else
        {
            displayLoginContext.setDisplayLogin('login')
        }
    }

    useEffect(()=>{
        if(loginContext.logged && window.innerWidth > 450)
        {
            setDisplayNotesMenu(true)
            
        }
        else
        {
            setDisplayNotesMenu(false)
            
        }
    },[loginContext.logged])

    const touchStart = (e) =>
    {
        touchStartPositionY = e.touches[0].clientY
        touchStartPositionX = e.touches[0].clientX
    }

    const touchEnd = (e) =>
    {
        if(window.innerWidth > 450)
        {
            const end = e.changedTouches[0].clientY
            if(e.target.closest('article')?.classList.contains('notesMenu') || loginContext.logged === false) return
            if(Math.abs(end - touchStartPositionY) < window.innerHeight*0.3) return

            setDisplayNotesMenu(end-touchStartPositionY < 0)
        }
        else
        {
            const end = e.changedTouches[0].clientX
            if(e.target.closest('article')?.classList.contains('notesMenu') || loginContext.logged === false) return
            if(Math.abs(end - touchStartPositionX) < window.innerWidth*0.6) return

            if(end-touchStartPositionX > 0)
            {
                setDisplayNotesMenu(true)

            }
        }
       
    }

    const displayColdStartInfoTimeout = useRef()

    useEffect(()=>{
        if(loginContext.loginLoading)
        {
            displayColdStartInfoTimeout.current = setTimeout(()=>{
                setDisplayColdStartInfo(true)
            },2500)
        }
        else
        {
            clearTimeout(displayColdStartInfoTimeout.current)
            setDisplayColdStartInfo(false)
        }
    },[loginContext.loginLoading])

    return(
        <main className={styles.main}>
            
            <div className={styles.overlay} onTouchStart={touchStart} onTouchEnd={touchEnd}>

                <LoginPage />

                <Nav displayNotesMenu={displayNotesMenu} setDisplayNotesMenu={setDisplayNotesMenu}/>

                <header className={`${styles.menu} ${displayNotesMenu?styles.menuWhileMenuIsDisplaying:''}`}>
                <button className={`${styles.menuBtn} ${displayNotesMenu?styles.btnWhileMenuIsDisplaying:''}`} onMouseEnter={e=>btnHovered('1')} onMouseLeave={btnUnHover} onClick={codeClicked}>
                    <div className={`${styles.buttonHover} ${displayNotesMenu?styles.buttonHoverWhileMenuIsDisplaying:''}`} ref={btn1HoverRef}></div>
                    <p>Dołącz za pomocą kodu</p>
                    
                </button>
                <button className={`${styles.menuBtn} ${displayNotesMenu?styles.btnWhileMenuIsDisplaying:''}`} onMouseEnter={e=>btnHovered('2')} onMouseLeave={btnUnHover} onClick={createClicked}>
                    <div className={`${styles.buttonHover} ${displayNotesMenu?styles.buttonHoverWhileMenuIsDisplaying:''}`} ref={btn2HoverRef} ></div>
                    <p>Utwórz nową notatkę</p>
                    
                </button>
            </header>

            {loginContext.logged && <NotesMenu notesUpdater={props.notesUpdater} setDisplayPageRedirectionAnimation={props.setDisplayRedirectPageAnimation} setDisplayNoteEdit={props.setDisplayNoteEdit} display={displayNotesMenu} setDisplayNotesMenu={setDisplayNotesMenu}/>}

            <h1 className={`${styles.coldStartServerInfo} ${displayColdStartInfo?styles.coldStartServerInfoDisplay:''}`}>Ładowanie zajmuje chwilę dłużej ze względu na start serwera. Prosimy o cieprliwość.</h1>

            </div>

            
        </main>
    )
}

export default Main