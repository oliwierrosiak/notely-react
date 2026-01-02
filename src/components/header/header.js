import { useContext, useRef } from 'react'
import Nav from '../nav/nav'
import styles from './header.module.css'
import LoginPage from '../login/loginPage'

function Header(props)
{
    const btn1HoverRef = useRef()
    const btn2HoverRef = useRef()

    const btnHovered = (target) =>{
        target === "1"?btn1HoverRef.current.classList.add(styles.buttonHoverDisplay):btn2HoverRef.current.classList.add(styles.buttonHoverDisplay)
    }

    const btnUnHover = (e) =>{
        btn1HoverRef.current.classList.remove(styles.buttonHoverDisplay)
        btn2HoverRef.current.classList.remove(styles.buttonHoverDisplay)
    }

    return(
        <header className={styles.header}>
            
            <div className={styles.overlay}>

                <LoginPage />

                <Nav />

                <div className={styles.menu}>
                <button className={styles.menuBtn} onMouseEnter={e=>btnHovered('1')} onMouseLeave={btnUnHover}>
                    <div className={styles.buttonHover} ref={btn1HoverRef}></div>
                    <p>Dołącz za pomocą kodu</p>
                    
                </button>
                <button className={styles.menuBtn} onMouseEnter={e=>btnHovered('2')} onMouseLeave={btnUnHover}>
                    <div className={styles.buttonHover} ref={btn2HoverRef}></div>
                    <p>Utwórz nową notatkę</p>
                    
                </button>
            </div>
            </div>

            
        </header>
    )
}

export default Header