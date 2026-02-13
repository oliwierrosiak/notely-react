import { useContext, useEffect, useRef, useState } from 'react'
import styles from './editNote.module.css'
import ArrowIcon from '../../assets/svg/arrowIcon'
import inputStyles from '../login/login-register.module.css'
import { divClicked,inputBlur,inputFocused } from '../login/inputActions'
import PasswordEye from '../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../assets/svg/passwordEyeHidden'
import LoadingIcon from '../../assets/svg/loadingIcon'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import refreshToken from '../auth/refreshToken'
import formatNoteCode from '../helpers/formatNoteCode'
import UnauthorizedActionContext from '../../context/unauthorizedActionContext'

function EditNote(props)
{
    const [loading,setLoading] = useState(false)
    const [title,setTitle] = useState(props.note.title)
    const [passwordExist,setPasswordExist] = useState(props.note.notePassword?true:false)
    const [password,setPassword] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [error,setError] = useState('')

    const unauthorizedActionContext = useContext(UnauthorizedActionContext)

    const inputRef = useRef()
    const btnRef = useRef()

    const overlayClicked = (e) =>{
        if(e.target.classList.contains(styles.overlay) && !loading)
        {
            props.setDisplayNoteEdit(false)
        }
    }

    const windowEvent = (e) =>{
        if(e.key === "Enter" && !loading)
        {
            btnRef.current.click()
        }
    }

    useEffect(()=>{
        window.addEventListener("keydown",windowEvent)
        inputRef.current.focus()
        inputRef.current.blur()
        return()=>{
            window.removeEventListener("keydown",windowEvent)
        }
    },[])

    const sendData = async()=>{
        try
        {
            setLoading(true)
            const requestBody = {
                title:title,
                passwordChanged:Boolean(password) || passwordExist != Boolean(props.note.notePassword),
                password:passwordExist?password:null,
            }
            const token = await refreshToken()
            await axios.put(`${ApiAddress}/updateNote/${props.note._id}`,{...requestBody},{headers:{'Authorization':`Bearer ${token}`}})
            props.setNotesUpdater(Math.random())
            props.setDisplayNoteEdit(false)
            const authorizedNotes = JSON.parse(sessionStorage.getItem('authorizedNotes')) || []
            passwordExist && password && authorizedNotes.push(props.note._id)
            sessionStorage.setItem('authorizedNotes',JSON.stringify(authorizedNotes))
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                props.setDisplayNoteEdit(false)
                unauthorizedActionContext()
            }
            else
            {
                setError("Wystąpił błąd serwera")
                setLoading(false)

            }
        }
    }

    const validate = (e) =>{
        e.preventDefault()
        setError('')
        if(title === '')
        {
            setError("Wpisz Nazwę")
        }
        else if(passwordExist && passwordExist != Boolean(props.note.notePassword) && password==='')
        {
            setError("Utwórz hasło")
        }
        else
        {
            sendData()
        }
        
    }

    return(
        <article className={styles.overlay} onClick={overlayClicked}>
            <form className={styles.container} onSubmit={validate}>

                <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading && props.setDisplayNoteEdit(false)}>
                    <ArrowIcon class={styles.backSVG}/>
                </div>

                <header className={styles.header}>
                    <h1 className={styles.h1}>Edycja Notatki</h1>
                    {props.note.visibility === 'public' && <h2 className={styles.code}>{formatNoteCode(props.note.code)}</h2>}
                    {props.note.visibility === 'private' && <div className={styles.privateNoteButton}>Notatka Prywatna</div>}
                </header>

                <div className={`${inputStyles.inputContainer} ${styles.inputContainer} ${inputStyles.emailInputContainer} ${loading?inputStyles.inputContainerWhileLoading:''} ${props.note.visibility === "private"?styles.privateNoteMargin:''}`} onClick={divClicked}>
                    <input autoComplete='off' spellCheck='false' autoCorrect='off' ref={inputRef} disabled={loading} value={title} onChange={e=>setTitle(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} className={inputStyles.input}></input>
                    <div className={inputStyles.placeholder}>Edytuj nazwę</div>
                </div>

                {props.note.visibility === "public" && <div className={styles.passwordContainer}>
                    <div onClick={e=>!loading && props.note.visibility !== "private" && setPasswordExist(!passwordExist)} className={`${styles.checkbox} ${passwordExist?styles.checkboxChecked:''}`}></div>
                    <p onClick={e=>!loading && props.note.visibility !== "private" && setPasswordExist(!passwordExist)} className={styles.checkboxDescription}>Notatka zabezpieczona hasłem</p>

                    <div className={`${inputStyles.inputContainer} ${loading?inputStyles.inputContainerWhileLoading:''} ${passwordExist?"":styles.inputContainerDisabled}`} onClick={divClicked}>
                        <input autoComplete='off' spellCheck='false' autoCorrect='off' disabled={loading || !passwordExist} value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${inputStyles.input} ${inputStyles.passwordInput} ${!passwordExist?styles.passwordDisabled:''}`}></input>
                        <div style={passwordExist?{}:{cursor:'default',color:'grey'}} className={`${inputStyles.placeholder} `}>Nowe hasło notatki</div>
                        <div className={`${inputStyles.eye} ${!passwordExist?styles.eyeDisabled:''}`} onClick={e=>!loading && passwordExist && setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                    </div>
                    </div>
                </div>}

                {error && <div className={styles.error}>{error}</div>}

                 <button ref={btnRef} className={`${styles.edit} ${loading?styles.btnLoading:''}`}>{loading?<LoadingIcon class={inputStyles.loading} />:"Zapisz Edycję"}</button>

            </form>
        </article>
    )
}

export default EditNote