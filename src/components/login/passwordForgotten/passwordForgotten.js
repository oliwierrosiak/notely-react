import { useEffect, useState } from 'react'
import styles from '../login-register.module.css'
import {divClicked,inputBlur,inputFocused} from '../inputActions'

function PasswordForgotten(props)
{
    const [inputValue,setInputValue] = useState('')
    const [error,setError] = useState('')

    const validate = (e) =>{
        setError('')
        if(inputValue.trim() === '')
        {
            setError('Podaj adres email')
        }
        else
        {
            console.log("wyślij")
        }
    }

    useEffect(()=>{
        setError('')
    },[props.display])

    return(
        <div className={`${styles.loginForm} ${styles.loginForm2} ${props.display?styles.display:''}`}>
            <h1 className={`${styles.header} ${styles.headerMargin}`}>Odzyskiwanie konta</h1>

            <div className={`${styles.inputContainer}`} onClick={divClicked}>
                    <input value={inputValue} onChange={e=>setInputValue(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} className={styles.input}></input>
                    <div className={styles.placeholder}>Podaj swój adres email</div>
            </div>

            <div className={styles.error2}>{error}</div>

            <button className={styles.loginBtn} onClick={validate}>Odzyskaj hasło</button>

        </div>
    )
}

export default PasswordForgotten