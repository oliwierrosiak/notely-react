import { useContext } from 'react'
import styles from './loginPage.module.css'
import DisplayLoginContext from '../../context/displayLogin'
import ArrowIcon from '../../assets/svg/arrowIcon'
import ImageBackground from '../../assets/svg/loginBackground'
import logo from '../../assets/img/voxalogo1.png'
import Login from './login/login'
import Register from './register/register'

function LoginPage(props)
{
    const displayLoginContext = useContext(DisplayLoginContext)

    return(
        <div className={`${styles.container} ${displayLoginContext.displayLogin?styles.displayContainer:''}`}>
            <div className={styles.back} onClick={e=>displayLoginContext.setDisplayLogin('')}>
                <ArrowIcon class={styles.backSVG}/>
            </div>

            <img src={logo} className={styles.logo}/>

            <div className={styles.image}>
                <ImageBackground class={styles.backgroundSVG}/>
            </div>

            <Login display={displayLoginContext.displayLogin === "login"} />
            <Register display={displayLoginContext.displayLogin === "register"} />

        </div>
    )
}

export default LoginPage