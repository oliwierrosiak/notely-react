import { useContext, useEffect, useState } from 'react'
import styles from './loginPage.module.css'
import DisplayLoginContext from '../../context/displayLogin'
import ArrowIcon from '../../assets/svg/arrowIcon'
import logo from '../../assets/img/notely.png'
import Login from './login/login'
import Register from './register/register'
import PasswordForgotten from './passwordForgotten/passwordForgotten'
import ImageBackground2 from '../../assets/svg/ImageBackground2'
import ImageBackground3 from '../../assets/svg/imageBackground3'
import PasswordForgottenIcon from '../../assets/svg/passwordForgottenIcon'

function LoginPage(props)
{
    const displayLoginContext = useContext(DisplayLoginContext)

    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        console.log(displayLoginContext)
    },[displayLoginContext])

    return(
        <article className={`${styles.container} ${displayLoginContext.displayLogin?styles.displayContainer:''}`}>
            <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading && displayLoginContext.setDisplayLogin('')}>
                <ArrowIcon class={styles.backSVG}/>
            </div>

            <img src={logo} className={styles.logo}/>

            <ImageBackground3 class={`${styles.backgroundSVG} ${displayLoginContext.displayLogin === 'register'?styles.svgDisplay:''}`}/>
            <ImageBackground2 class={`${styles.backgroundSVG} ${displayLoginContext.displayLogin === "login"?styles.svgDisplay:''}`}/>
            <PasswordForgottenIcon class={`${styles.backgroundSVG} ${displayLoginContext.displayLogin === 'passwordForgotten'?styles.svgDisplay:''}`}/>

            <Login loading={loading} setLoading={setLoading} display={displayLoginContext.displayLogin === "login"} />
            <Register loading={loading} setLoading={setLoading} display={displayLoginContext.displayLogin === "register"} />
            <PasswordForgotten loading={loading} setLoading={setLoading} display={displayLoginContext.displayLogin === 'passwordForgotten'} />

        </article>
    )
}

export default LoginPage