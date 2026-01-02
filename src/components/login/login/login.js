import { useContext, useState } from 'react'
import styles from '../login-register.module.css'
import PasswordEye from '../../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../../assets/svg/passwordEyeHidden'
import GoogleIcon from '../../../assets/svg/googleIcon'
import DisplayLoginContext from '../../../context/displayLogin'
import { divClicked,inputBlur,inputFocused } from '../inputActions'
import LoadingIcon from '../../../assets/svg/loadingIcon'
import axios from 'axios'
import ApiAddress from '../../../ApiAddress'
import AccessTokenContext from '../../../context/accessTokenContext'

function Login(props)
{
    const [loginValue,setLoginValue] = useState('')
    const [passwordValue,setPasswordValue] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [error,setError] = useState('')

    const displayLoginContext = useContext(DisplayLoginContext)

    const accessTokenContext = useContext(AccessTokenContext)

    const sendData = async(e) =>
    {
        try
        {
            props.setLoading(true)
            setShowPassword(false)
            const response = await axios.post(`${ApiAddress}/login`,{email:loginValue,password:passwordValue},{withCredentials:true})
            accessTokenContext.setAccessToken(response.data.accessToken)
            console.log("logged")
        }
        catch(ex)
        {
            if(ex?.response?.data?.status === 401)
            {
                setError('Nieprawidłowe dane')
            }
            else
            {
                setError("Wystąpił błąd serwera")
            }
            props.setLoading(false)
        }
    }

    const submit = (e) =>{
        e.preventDefault()
        if(props.loading) return
        setError('')
        if(loginValue && passwordValue)
        {
            sendData()
        }
        else
        {
            setError('Podaj email i hasło')
        }
    }

    const googleLogin = (e) =>
    {
        console.log('googleLogin')
    }

    return(
        <div className={`${styles.loginForm} ${props.display?styles.display:''}`}>

            <h1 className={styles.header}>Logowanie</h1>

            <form className={styles.form} noValidate onSubmit={submit}>

                <div className={`${styles.inputContainer} ${styles.emailInputContainer} ${props.loading?styles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                    <input disabled={props.loading} value={loginValue} onChange={e=>setLoginValue(e.target.value)} type='email' onBlur={inputBlur} onFocus={inputFocused} className={styles.input}></input>
                    <div className={styles.placeholder}>Podaj email</div>
                </div>

                <div className={`${styles.inputContainer} ${props.loading?styles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                    <input disabled={props.loading} value={passwordValue} onChange={e=>setPasswordValue(e.target.value)} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input} ${styles.passwordInput}`}></input>
                    <div className={styles.placeholder}>Podaj hasło</div>
                    <div className={styles.eye} onClick={e=>!props.loading && setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                    </div>
                </div>

                <div className={`${styles.passwordForgotten} ${props.loading?styles.passwordForgottenWhileLoading:''}`} onClick={e=>!props.loading && displayLoginContext.setDisplayLogin('passwordForgotten')}>Nie pamiętasz hasła?</div>

                {error && <div className={styles.error4}>{error}</div>}

                <button className={`${styles.loginBtn} ${styles.loginBtnMargin} ${props.loading?styles.btnLoading:''}`}>{props.loading?<LoadingIcon class={styles.loading}/>:"Zaloguj się"}</button>

            </form>

            <div className={styles.line}></div>

            <button className={`${styles.googleLogin} ${props.loading?styles.googleLoginWhileLoading:''}`} onClick={e=>!props.loading && googleLogin()}>
                <GoogleIcon class={styles.googleSVG}/>
                Zaloguj się przez Google
            </button>

            <div className={styles.bottomLink}>
                Nie masz konta? <span className={`${styles.link} ${props.loading?styles.linkWhileLoading:''}`} onClick={e=>!props.loading && displayLoginContext.setDisplayLogin('register')}>
                    Zarejestruj się!
                </span>
            </div>
        </div>
    )
}

export default Login