import { useContext, useState } from 'react'
import styles from '../login-register.module.css'
import PasswordEye from '../../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../../assets/svg/passwordEyeHiden'
import GoogleIcon from '../../../assets/svg/googleIcon'
import DisplayLoginContext from '../../../context/displayLogin'

function Login(props)
{
    const [loginValue,setLoginValue] = useState('')
    const [passwordValue,setPasswordValue] = useState('')
    const [showPassword,setShowPassword] = useState(false)

    const displayLoginContext = useContext(DisplayLoginContext)

    const divClicked = (e) =>{
        const input = e.target.closest(`.${styles.inputContainer}`).children[0]
        input.focus()
    }

    const inputFocused = (e) =>{
        const div = e.target.closest(`.${styles.inputContainer}`)
        div.classList.add(styles.containerFocused)
        div.children[0].classList.add(styles.inputFocused)
        div.children[1].classList.add(styles.placeholderFocused)
        div.children[1].classList.add(styles.placeholderColorWhileFocused)
    }

    const inputBlur = (e) =>{
        const div = e.target.closest(`.${styles.inputContainer}`)
        div.classList.remove(styles.containerFocused)
         div.children[0].classList.remove(styles.inputFocused)
        div.children[1].classList.remove(styles.placeholderColorWhileFocused)
        if(e.target.classList.contains(styles.passwordInput))
        {
            if(passwordValue.trim() === '')
            {
                div.children[1].classList.remove(styles.placeholderFocused)
            }
        }
        else
        {
            if(loginValue.trim() === '')
            {
                div.children[1].classList.remove(styles.placeholderFocused)
            }
        }

    }

    return(
        <div className={`${styles.loginForm} ${props.display?styles.display:''}`}>
            <h1 className={styles.header}>Logowanie</h1>
            <form className={styles.form}>

                <div className={styles.inputContainer} onClick={divClicked}>
                    <input value={loginValue} onChange={e=>setLoginValue(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} className={styles.input}></input>
                    <div className={styles.placeholder}>Podaj email</div>
                </div>

                <div className={styles.inputContainer} onClick={divClicked}>
                    <input value={passwordValue} onChange={e=>setPasswordValue(e.target.value)} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input} ${styles.passwordInput}`}></input>
                    <div className={styles.placeholder}>Podaj hasło</div>
                    <div className={styles.eye} onClick={e=>setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                    </div>
                </div>

                <button className={styles.loginBtn}>Zaloguj się</button>

            </form>

            <div className={styles.line}></div>

            <button className={styles.googleLogin}>
                <GoogleIcon class={styles.googleSVG}/>
                Zaloguj się przez Google
            </button>

            <div className={styles.bottomLink}>
                Nie masz konta? <span className={styles.link} onClick={e=>displayLoginContext.setDisplayLogin('register')}>
                    Zarejestruj się!
                </span>
            </div>
        </div>
    )
}

export default Login