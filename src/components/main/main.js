import { useContext, useRef, useState } from 'react'
import Nav from '../nav/nav'
import styles from './main.module.css'
import LoginPage from '../login/loginPage'
import LoginContext from '../../context/loginContext'
import DisplayLoginContext from '../../context/displayLogin'
import NotesMenu from '../notesMenu/notesMenu'

function Header(props)
{
    const btn1HoverRef = useRef()
    const btn2HoverRef = useRef()

    const loginContext = useContext(LoginContext)
    const displayLoginContext = useContext(DisplayLoginContext)

    const [displayNotesMenu,setDisplayNotesMenu] = useState(1)

    const btnHovered = (target) =>{
        target === "1"?btn1HoverRef.current.classList.add(styles.buttonHoverDisplay):btn2HoverRef.current.classList.add(styles.buttonHoverDisplay)
    }

    const btnUnHover = (e) =>{
        btn1HoverRef.current.classList.remove(styles.buttonHoverDisplay)
        btn2HoverRef.current.classList.remove(styles.buttonHoverDisplay)
    }

    const codeClicked = (e) =>
    {
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
        if(loginContext.logged)
        {
            console.log('create')
        }
        else
        {
            displayLoginContext.setDisplayLogin('login')
        }
    }

    return(
        <div className={styles.header}>
            
            <main className={styles.overlay}>

                <LoginPage />

                <Nav />

                <header className={styles.menu}>
                <button className={styles.menuBtn} onMouseEnter={e=>btnHovered('1')} onMouseLeave={btnUnHover} onClick={codeClicked}>
                    <div className={styles.buttonHover} ref={btn1HoverRef}></div>
                    <p>Dołącz za pomocą kodu</p>
                    
                </button>
                <button className={styles.menuBtn} onMouseEnter={e=>btnHovered('2')} onMouseLeave={btnUnHover} onClick={createClicked}>
                    <div className={styles.buttonHover} ref={btn2HoverRef} ></div>
                    <p>Utwórz nową notatkę</p>
                    
                </button>
            </header>

            <NotesMenu display={displayNotesMenu} setDisplayNotesMenu={setDisplayNotesMenu}/>

            </main>

            
        </div>
    )
}

export default Header