import { useContext, useState } from 'react'
import styles from './loginPage.module.css'
import DisplayLoginContext from '../../context/displayLogin'
import ArrowIcon from '../../assets/svg/arrowIcon'
import ImageBackground from '../../assets/svg/loginBackground'
import logo from '../../assets/img/voxalogo1.png'
import Login from './login/login'
import Register from './register/register'
import PasswordForgotten from './passwordForgotten/passwordForgotten'

function LoginPage(props)
{
    const displayLoginContext = useContext(DisplayLoginContext)

    const [loading,setLoading] = useState(false)

    return(
        <article className={`${styles.container} ${displayLoginContext.displayLogin?styles.displayContainer:''}`}>
            <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading && displayLoginContext.setDisplayLogin('')}>
                <ArrowIcon class={styles.backSVG}/>
            </div>

            <img src={logo} className={styles.logo}/>

            <div className={styles.image}>
                <ImageBackground class={styles.backgroundSVG}/>
            </div>

            <Login loading={loading} setLoading={setLoading} display={displayLoginContext.displayLogin === "login"} />
            <Register loading={loading} setLoading={setLoading} display={displayLoginContext.displayLogin === "register"} />
            <PasswordForgotten loading={loading} setLoading={setLoading} display={displayLoginContext.displayLogin === 'passwordForgotten'} />

        </article>
    )
}

export default LoginPage