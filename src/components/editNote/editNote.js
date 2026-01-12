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
import LoginContext from '../../context/loginContext'
import DisplayLoginContext from '../../context/displayLogin'

function EditNote(props)
{
    const [loading,setLoading] = useState(false)
    const [title,setTitle] = useState(props.note.title)
    const [passwordExist,setPasswordExist] = useState(props.note.notePassword?true:false)
    const [password,setPassword] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [error,setError] = useState('')

    const loginContext = useContext(LoginContext)
    const displayLoginContext = useContext(DisplayLoginContext)

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

    const formatCode = (code) =>
    {
        const newCode = []
        const localCode = String(code).split('')
        localCode.forEach((x,idx)=>{
            if(idx === 3)
            {
                newCode.push('-')
            }
            newCode.push(x)
        })
        return newCode.join('')
    }

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
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                loginContext.logout()
                displayLoginContext.setDisplayLogin('login')
                props.setDisplayNoteEdit(false)
            }
            else
            {
                setError("Wystąpił błąd serwera")
                setLoading(false)

            }
        }
    }

    const validate = () =>{
        setError('')
        if(title === '')
        {
            setError("wpisz nazwę")
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
        <div className={styles.overlay} onClick={overlayClicked}>
            <article className={styles.container}>

                <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading && props.setDisplayNoteEdit(false)}>
                    <ArrowIcon class={styles.backSVG}/>
                </div>

                <header className={styles.header}>
                    <h1 className={styles.h1}>Edycja Notatki</h1>
                    <h2 className={styles.code}>{formatCode(props.note.code)}</h2>
                </header>

                <div className={`${inputStyles.inputContainer} ${styles.inputContainer} ${inputStyles.emailInputContainer} ${loading?inputStyles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                    <input ref={inputRef} disabled={loading} value={title} onChange={e=>setTitle(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} className={inputStyles.input}></input>
                    <div className={inputStyles.placeholder}>Edytuj nazwę</div>
                </div>

                <div className={styles.passwordContainer}>
                    <div onClick={e=>!loading && setPasswordExist(!passwordExist)} className={`${styles.checkbox} ${passwordExist?styles.checkboxChecked:''}`}></div>
                    <p onClick={e=>!loading && setPasswordExist(!passwordExist)} className={styles.checkboxDescription}>Notatka zabezpieczona hasłem</p>

                    <div className={`${inputStyles.inputContainer} ${loading?inputStyles.inputContainerWhileLoading:''} ${passwordExist?"":styles.inputContainerDisabled}`} onClick={divClicked}>
                        <input disabled={loading || !passwordExist} value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${inputStyles.input} ${inputStyles.passwordInput} ${!passwordExist?styles.passwordDisabled:''}`}></input>
                        <div style={passwordExist?{}:{cursor:'default',color:'grey'}} className={`${inputStyles.placeholder} `}>Nowe hasło notatki</div>
                        <div className={`${inputStyles.eye} ${!passwordExist?styles.eyeDisabled:''}`} onClick={e=>!loading && passwordExist && setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                    </div>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                 <button ref={btnRef} onClick={validate} className={`${styles.edit} ${loading?styles.btnLoading:''}`}>{loading?<LoadingIcon class={inputStyles.loading} />:"Zapisz Edycję"}</button>

            </article>
        </div>
    )
}

export default EditNote