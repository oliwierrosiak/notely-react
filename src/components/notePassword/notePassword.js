import styles from './notePassword.module.css'
import ArrowIcon from '../../assets/svg/arrowIcon'
import { useState, useRef, useEffect, useContext } from 'react'
import PasswordEye from '../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../assets/svg/passwordEyeHidden'
import LoadingIcon from '../../assets/svg/loadingIcon'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate } from 'react-router-dom'
import LoginContext from '../../context/loginContext'
import DisplayLoginContext from '../../context/displayLogin'
import refreshToken from '../auth/refreshToken'
import AccessTokenContext from '../../context/accessTokenContext'

function NotePassword(props)
{
    const [loading,setLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')

    const input = useRef()
    const fill = useRef()
    const btn = useRef()

    const loginContext = useContext(LoginContext)
    const displayLoginContext = useContext(DisplayLoginContext)
    const accessTokenContext = useContext(AccessTokenContext)

    const navigate = useNavigate()

    const overlayClicked = (e) =>
    {
        if(e.target.classList.contains(styles.overlay) && !loading && !props.boardPassword)
        {
            props.setDisplayNotePassword(false)
        }
    }

    const containerClicked = (e) =>
    {
        input.current.focus()
    }

    const inputFocused = (e) =>
    {
        e.target.placeholder = ``
        fill.current.classList.add(styles.borderBottomFilled)
    }
    
    const inputBlurred = (e) =>
    {
        e.target.placeholder = `Podaj hasło...`
        fill.current.classList.remove(styles.borderBottomFilled)

    }

    const sendData = async()=>{
        setError('')
        setShowPassword(false)
        setLoading(true)
        
        try
        {
            if(!props.noteIdMemory)
            {
                throw new Error()
            }
            const token = await refreshToken()
            const response = await axios.post(`${ApiAddress}/compareNotePassword`,{noteId:props.noteIdMemory,password},{headers:{"Authorization":`Bearer ${token}`}})
            accessTokenContext.setAccessToken(token)
            const authorizedNotes = JSON.parse(sessionStorage.getItem('authorizedNotes')) || []
            authorizedNotes.push(props.noteIdMemory)
            sessionStorage.setItem('authorizedNotes',JSON.stringify(authorizedNotes))
            if(props.boardPassword)
            {
                props.setDisplayNotePassword(false)
            }
            else
            {
                props.setDisplayRedirectPageAnimation(true)
                setTimeout(()=>{
                    navigate(`/note/${response.data.id}`)
                },1000) 
            }
            
        }
        catch(ex)
        {
            console.log(ex)
            if(ex.status === 401)
            {
                
                props.setDisplayNotePassword(false)
                if(props.boardPassword)
                {
                    navigate('/')   
                }
                loginContext.logout()
                displayLoginContext.setDisplayLogin('login')
            }
            if(ex?.status === 403)
            {
                setError('Błędne hasło')
            }
            else
            {
                setError('Wystąpił błąd serwera')

            }
            setLoading(false)
        }
    }

    const validate = () =>{
        if(loading) return;
        if(password === "")
        {
            setError('Wprowadź hasło')
        }
        else
        {
            sendData()
        }
    }

    const windowEvent = (e) =>{
        if(e.key === "Enter")
        {
            btn.current.click()
        }
    }

    useEffect(()=>{
        window.addEventListener("keydown",windowEvent)
        return()=>{
            window.removeEventListener("keydown",windowEvent)
            if(!props.boardPassword)
            {
                props.setNoteIdMemory('')

            }
        }
    },[])

    const backClicked = (e) =>
    {
        if(!loading)
        {
            if(props.boardPassword)
            {
                navigate('/')
            }
            else
            {
                props.setDisplayNotePassword(false)
            }
        }
    }

    return(
        <div className={styles.overlay} onClick={overlayClicked}>
            <div className={styles.container}>

                <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={backClicked}>
                    <ArrowIcon class={styles.backSVG}/>
                </div>

                <h2 className={styles.header}>Aby dołączyć do tej notatki wymagane jest hasło</h2>

                <div className={`${styles.inputContainer} ${loading?styles.inputContainerWhileLoading:''}`} onClick={containerClicked}>
                    <input disabled={loading} value={password} onChange={e=>setPassword(e.target.value)} ref={input} onFocus={inputFocused} onBlur={inputBlurred} type={showPassword?'text':'password'} placeholder='Podaj hasło...' className={`${styles.input} ${loading?styles.inputWhileLoading:''}`}/>
                    <div className={styles.inputBorder}>
                        <div ref={fill} className={styles.inputBorderFill}></div>
                    </div>

                    <div className={`${styles.eye} ${loading?styles.eyeWhileLoading:''}`} onClick={e=>!loading && setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                    </div>

                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button ref={btn} className={`${styles.btn} ${loading?styles.btnWhileLoading:''}`} onClick={validate}>
                    {loading?<LoadingIcon class={styles.loadingIcon}/>:"Dołącz"}
                </button>

            </div>
        </div>
    )
}

export default NotePassword