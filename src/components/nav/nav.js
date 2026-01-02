import { useContext } from 'react'
import styles from './nav.module.css'
import DisplayLoginContext from '../../context/displayLogin'
import LoginContext from '../../context/loginContext'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'

function Nav(props)
{
    const displayLoginContext = useContext(DisplayLoginContext)

    const loginContext = useContext(LoginContext)

    return(
        <nav className={styles.nav}>
            <div className={styles.logo}></div>
            <div className={styles.loginMenu}>
                {loginContext.loginLoading?
                <ImgLoadingIcon class={styles.loginLoading}/>
                :
                loginContext.logged?<div className={styles.loggedMenu} onClick={loginContext.logout}>logged</div>:
                <>
                <button className={`${styles.loginMenuBtn} ${styles.loginBtn}`} onClick={e=>displayLoginContext.setDisplayLogin("login")}>Logowanie</button>
                <div className={styles.line}></div>
                <button className={`${styles.loginMenuBtn} ${styles.registerBtn}`} onClick={e=>displayLoginContext.setDisplayLogin("register")}>Rejestracja</button>
                </>}
            </div>
        </nav>
    )
}

export default Nav