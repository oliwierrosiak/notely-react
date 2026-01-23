import { useContext, useRef, useState } from 'react'
import styles from './deletingAccountConfirm.module.css'
import ArrowIcon from '../../../assets/svg/arrowIcon'
import LoadingIcon from '../../../assets/svg/loadingIcon'
import refreshToken from '../../auth/refreshToken'
import axios from 'axios'
import ApiAddress from '../../../ApiAddress'
import { useNavigate } from 'react-router-dom'
import LoginContext from '../../../context/loginContext'

function DeletingAccountConfirm(props)
{

    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')

    const borderFillRef = useRef()
    const inputRef = useRef()

    const navigate = useNavigate()
    const loginContext = useContext(LoginContext)


    const overlayClicked = (e) =>{
        if(e.target.classList.contains(styles.overlay) && !loading)
        {
            props.setDisplay(false)
        }
    }

    const cancelClicked = (e) =>
    {
        if(!loading)
        {
            props.setDisplay(false)

        }
    }

    const inputFocused = (e) =>{
        borderFillRef.current.classList.add(styles.borderFilled)
    }

    const inputBlurred = (e) =>
    {
        borderFillRef.current.classList.remove(styles.borderFilled)
    }

    const containerClicked = (e) =>
    {
        inputRef.current.focus()
    }

    const send = async()=>
    {
        try
        {
            setLoading(true)
            const token = await refreshToken()
            const response = await axios.post(`${ApiAddress}/deleteAccount`,{password},{headers:{"Authorization":`Bearer ${token}`}})
            loginContext.logout()
            navigate('/')
        }
        catch(ex)
        {
            if(ex.status === 403)
            {
                setError("Błędne hasło")
                setLoading(false)
            }
            else
            {
                setError("Wystąpił błąd serwera")
                setLoading(false)
            }
        }
    }

    const validate = () =>
    {
        if(loading) return
        setError('')
        if(password === '')
        {
            setError("Wprowadź hasło")
        }
        else
        {
            send()
        }
    }

    return(
        <div className={styles.overlay} onClick={overlayClicked}>
            <div className={styles.container}>

                <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading &&  props.setDisplay(false)}>
                <ArrowIcon class={styles.backSVG}/>
                </div>

                <h1 className={styles.header}>Usuwanie Konta</h1>
                <p className={styles.description}>Aby ukończyć proces usuwania konta wymagane jest podanie hasła. Po podaniu hasła i kliknięciu przycisku "Usuń Konto", twoje konto zostanie usunięte z naszego serwisu. Ta operacja jest <mark className={styles.mark}>nieodwracalna!</mark></p>


                {loading?<div className={styles.loadingContainer}>
                    <LoadingIcon class={styles.loading}/>
                </div>:
                <div className={styles.inputContainer} onClick={containerClicked}>
                    <input ref={inputRef} onBlur={inputBlurred} onFocus={inputFocused} placeholder='Wprowadź hasło' value={password}
                    onChange={e=>setPassword(e.target.value)} type='password' className={styles.input}/>
                    <div className={styles.border}>
                        <div ref={borderFillRef} className={styles.borderFill}></div>
                    </div>
                </div>}

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.btnContainer}>
                    <button onClick={cancelClicked} className={`${styles.btn} ${styles.cancel} ${loading?styles.btnLoading:''}`}>Anuluj</button>
                    <button onClick={validate} className={`${styles.btn} ${styles.delete} ${loading?styles.btnLoading:''}`}>Usuń Konto</button>
                </div>

            </div>
        </div>
    )
}

export default DeletingAccountConfirm