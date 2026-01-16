import { useContext, useEffect, useState } from 'react'
import styles from '../login-register.module.css'
import {divClicked,inputBlur,inputFocused} from '../inputActions'
import LoadingIcon from '../../../assets/svg/loadingIcon'
import axios from 'axios'
import ApiAddress from '../../../ApiAddress'
import DisplayLoginContext from '../../../context/displayLogin'

function PasswordForgotten(props)
{
    const [inputValue,setInputValue] = useState('')
    const [error,setError] = useState('')
    const [sent,setSent] = useState(false)

    const displayLoginContext = useContext(DisplayLoginContext)

    const send = async() =>{
        try
        {
            const response = await axios.post(`${ApiAddress}/resetPassword`,{email:inputValue})
            setSent(true)
            props.setLoading(false)
        }
        catch(ex)
        {
            if(ex?.response?.data?.status === 404)
            {
                props.setLoading(false)
                setError('Nie znaleziono adresu w bazie')
            }
            else
            {
                props.setLoading(false)
                setError('Wystąpił błąd serwera')
            }
        }
    }

    const validate = (e) =>{
        e.preventDefault()
        if(props.loading) return
        setError('')
        if(inputValue.trim() === '')
        {
            setError('Podaj adres email')
        }
        else
        {
            props.setLoading(true)
            send()
        }
    }

    useEffect(()=>{
        setError('')
        setInputValue('')
        setTimeout(() => {
            setSent(false)
        }, 500);
    },[props.display])

    return(
        <form className={`${styles.loginForm} ${styles.loginForm2} ${props.display?styles.display:''}`} onSubmit={validate}>
            <h1 className={`${styles.header} ${styles.headerMargin}`}>Odzyskiwanie konta</h1>

            {sent?<div className={styles.passwordResetInfo}>
                <p>Na twoją skrzynkę odbiorczą, została wysłana wiadomość email dotycząca resetowania hasła. Kliknij znajdujący się tam przycisk aby zresetować swoje hasło.</p><p> Jeżeli nie otrzymałeś wiadomości w ciągu kilku minut sprawdź spam lub kosz. Postępuj dalej zgodnie z informacjami w wiadmości.</p>
            </div>
            :
            <div className={`${styles.inputContainer} ${props.loading?styles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                    <input disabled={props.loading} value={inputValue} onChange={e=>setInputValue(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} className={styles.input}></input>
                    <div className={styles.placeholder}>Podaj swój adres email</div>
            </div>}

            <div className={styles.error2}>{error}</div>
            
            {sent?<button className={styles.loginBtn} type='button' onClick={e=>displayLoginContext.setDisplayLogin('')}>Wróc do strony głównej</button>
            :
            <button className={`${styles.loginBtn} ${props.loading?styles.btnLoading:''}`}>{props.loading?<LoadingIcon class={styles.loading}/>:'Resetuj hasło'}</button>}

        </form>
    )
}

export default PasswordForgotten