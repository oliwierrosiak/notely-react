import styles from './notePassword.module.css'
import ArrowIcon from '../../assets/svg/arrowIcon'
import { useState, useRef, useEffect } from 'react'
import PasswordEye from '../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../assets/svg/passwordEyeHidden'
import LoadingIcon from '../../assets/svg/loadingIcon'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate } from 'react-router-dom'

function NotePassword(props)
{
    const [loading,setLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')

    const input = useRef()
    const fill = useRef()
    const btn = useRef()

    const navigate = useNavigate()

    const overlayClicked = (e) =>
    {
        if(e.target.classList.contains(styles.overlay) && !loading)
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
            const response = await axios.post(`${ApiAddress}/compareNotePassword`,{noteId:props.noteIdMemory,password})
            props.setDisplayRedirectPageAnimation(true)
                setTimeout(()=>{
                    navigate(`/note/${response.data.id}`)
                },1000) 
        }
        catch(ex)
        {
            if(ex?.status === 401)
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
            props.setNoteIdMemory('')
        }
    },[])

    return(
        <div className={styles.overlay} onClick={overlayClicked}>
            <div className={styles.container}>

                <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading && props.setDisplayNotePassword(false)}>
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