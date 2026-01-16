import styles from './resetPassword.module.css'
import logo from '../../assets/img/notely.png'
import ResetPasswordIcon from '../../assets/svg/resetPasswordIcon'
import inputStyles from '../login/login-register.module.css'
import { useEffect, useState } from 'react'
import { divClicked,inputBlur,inputFocused } from '../login/inputActions'
import PasswordEye from '../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../assets/svg/passwordEyeHidden'
import LoadingIcon from '../../assets/svg/loadingIcon'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate, useParams } from 'react-router-dom'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'
import ErrorIcon from '../../assets/svg/errorIcon'

function ResetPassword()
{
    const [loading,setLoading] = useState(false)
    const [password,setPassword] = useState('')
    const [repeatPassword,setRepeatPassword] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [error,setError] = useState('')
    const [pageLoading,setPageLoading] = useState(true)
    const [pageError,setPageError] = useState(false)

    const params = useParams()
    const navigate = useNavigate()

    const checkPasswordResetTokenValidity = async()=>{
        try
        {
            const response = await axios.get(`${ApiAddress}/checkResetPasswordTokenValidity/${params.id}`)
            if(response.data.tokenValid)
            {
                setPageLoading(false)
            }
            else
            {
                setPageError("Token resetowania hasła wygasł")
                setPageLoading(false)
            }
        }
        catch(ex)
        {
            setPageError("Wystąpił błąd resetowania hasła")
            setPageLoading(false)
        }
    }

    const send = async() =>{
        try
        {
            setLoading(true)
            const id = 1
            const response = await axios.put(`${ApiAddress}/resetPassword/${id}`,{newPassword:password})
            console.log(response.data)
        }
        catch(ex)
        {
            setError('Błąd resetowania hasła')
            setLoading(false)
        }
    }

    const passwordRegex = (passwd) =>
    {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        return regex.test(passwd)
    }

    const validate = (e) =>
    {
        e.preventDefault()
        setError('')
        if(password === '')
        {
            setError('Utwórz hasło')
        }
        else if(repeatPassword === '')
        {
            setError('Powtórz hasło')
        }
        else if(repeatPassword !== password)
        {
            setError("Hasła nie są identyczne")
        }
        else if(!passwordRegex(password))
        {
            setError("Hasło jest za słabe")
        }
        else
        {
            send()
        }
    }

    useEffect(()=>{
        checkPasswordResetTokenValidity()
    },[])

    return(
        <div className={styles.container}>
           
            <main className={styles.main}>

                <img src={logo} className={styles.logo}/>

                <ResetPasswordIcon class={styles.backgroundSVG}/>

                {pageLoading && <div className={styles.pageLoading}>
                    <ImgLoadingIcon class={styles.pageLoadingSVG}/>
                </div>}
                
                {pageError && <div className={styles.pageErrorContainer}>
                    <ErrorIcon class={styles.errorIcon}/>
                    <h2>{pageError}</h2>
                    <button onClick={e=>navigate('/')} className={styles.backBtn}>Wróć do Strony Głównej</button>
                </div>}

                <div className={`${styles.formContainer} ${pageLoading||pageError?styles.formContainerHidden:''}`}>

                    <h1 className={styles.header}>Resetowanie Hasła</h1>

                    <form className={styles.form} onSubmit={validate}>
                        <div className={`${inputStyles.inputContainer} ${loading?inputStyles.inputContainerWhileLoading:''} ${styles.passwordContainer}`} onClick={divClicked}>
                            <input disabled={loading} value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${inputStyles.input} ${inputStyles.passwordInput}`}></input>
                            <div className={inputStyles.placeholder}>Utwórz nowe hasło</div>
                            <div className={inputStyles.eye} onClick={e=>!loading && setShowPassword(!showPassword)}>
                                {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                            </div>
                        </div>

                        <div className={`${inputStyles.inputContainer} ${loading?inputStyles.inputContainerWhileLoading:''} ${styles.resetPassword}`} onClick={divClicked}>
                            <input disabled={loading} value={repeatPassword} onChange={e=>setRepeatPassword(e.target.value)} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${inputStyles.input} ${inputStyles.passwordInput}`}></input>
                            <div className={inputStyles.placeholder}>Powtórz hasło</div>
                            <div className={inputStyles.eye} onClick={e=>!loading && setShowPassword(!showPassword)}>
                                {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                            </div>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <button className={`${inputStyles.loginBtn} ${loading?inputStyles.btnLoading:''} ${styles.btn}`}>{loading?<LoadingIcon class={inputStyles.loading}/>:"Resetuj Hasło"}</button>

                    </form>

                </div>
            </main>
        </div>
    )
}

export default ResetPassword