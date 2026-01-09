import styles from './addingNote.module.css'
import ArrowIcon from '../../assets/svg/arrowIcon'
import { useContext, useEffect, useRef, useState } from 'react'
import inputStyles from '../login/login-register.module.css'
import { divClicked,inputBlur, inputFocused } from '../login/inputActions'
import PasswordEye from '../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../assets/svg/passwordEyeHidden'
import LoadingIcon from '../../assets/svg/loadingIcon'
import ApiAddress from '../../ApiAddress'
import axios from 'axios'
import LoginContext from '../../context/loginContext'
import CopyIcon from '../../assets/svg/copyIcon'
import { useNavigate } from 'react-router-dom'

function AddingNote(props)
{
    const [loading,setLoading] = useState(false)
    const [title,setTitle] = useState('')
    const [visibility,setVisibility] = useState('public')
    const [password,setPassword] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [passwordEnabled,setPasswordEnabled] = useState(false)
    const [error,setError] = useState('')
    const [showNoteCode,setShowNoteCode] = useState(false)
    const [noteCode,setNoteCode] = useState()
    const [noteLink,setNoteLink] = useState('')
    const [showCopyInfo,setShowCopyInfo] = useState(false)
    const [noteId,setNoteId] = useState('')

    const loginContext = useContext(LoginContext)

    const showInfoTimeoutRef = useRef()
    const btnRef = useRef()
    const btn2Ref = useRef()

    const navigate = useNavigate()

    const overlayClicked = (e) =>{
        if(e.target.classList.contains(styles.overlay) && !loading)
        {
            props.setDisplayAddingNote(false)

        }
    }

    useEffect(()=>{
        if(visibility === "private")
        {
            setPasswordEnabled(false)
        }
    },[visibility])

    const sendData = async()=>{
        setError('')
        try
        {
            setLoading(true)
            const requestBody = {
                title,
                visibility,
                password:passwordEnabled?password:null,
                admin:loginContext.loggedUser.email
            }
            const response = await axios.post(`${ApiAddress}/createNote`,requestBody)
            setNoteCode(response.data.code)
            setNoteId(response.data.id)
            setNoteLink(`http://localhost:3000/note/${response.data.id}`)
            setShowNoteCode(true)
            setLoading(false)
        }   
        catch(ex)
        {
            setError('Wystąpił błąd serwera')
            setLoading(false)
        }
    }

    const setPasswordEnabling=()=>{
        if(!loading)
        {
            if(visibility === "public")
            {
                setPasswordEnabled(!passwordEnabled)
            }
        }
    }

    const formatNoteCode = () =>{
        const localCode = []
        const currentCode = String(noteCode).split('')
        currentCode.forEach((x,idx)=>{
            if(idx === 3)
            {
                localCode.push('-')
            }
            localCode.push(x)
        })
        return localCode.join('')
    }

    const copyLink = (e) =>{
        navigator.clipboard.writeText(noteLink)
        setShowCopyInfo(true)
        showInfoTimeoutRef.current = setTimeout(()=>{
            setShowCopyInfo(false)
        },2500)
    }

    const join = async() =>{
        setLoading(true)
        props.setDisplayRedirectPageAnimation(true)
        setTimeout(()=>{
            navigate(`/note/${noteId}`)
        },1000)
    }

    const windowEvent = (e) =>{
        if(e.key === "Enter")
        {
            btnRef.current?.click()
            btn2Ref.current?.click()
        }
    }

    useEffect(()=>{
        window.addEventListener("keydown",windowEvent)
        return()=>{
            window.removeEventListener("keydown",windowEvent)
            clearTimeout(showInfoTimeoutRef.current)
        }
    },[])

    return(
        <article className={styles.overlay} onClick={overlayClicked}>

            <div className={`${styles.container} ${showNoteCode?styles.containerWidth:''}`}>
                <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading && props.setDisplayAddingNote(false)}>
                    <ArrowIcon class={styles.backSVG}/>
                </div>

                {!showNoteCode?<>

                <h1 className={styles.header}>Dodawanie Notatki</h1>

                <div className={`${inputStyles.inputContainer} ${styles.inputContainer} ${inputStyles.emailInputContainer} ${loading?inputStyles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                    <input disabled={loading} value={title} onChange={e=>setTitle(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} className={inputStyles.input}></input>
                    <div className={inputStyles.placeholder}>Uwtórz nazwę</div>
                </div>


                <div className={styles.visibilityContainer}>
                    <h2 className={styles.visibilityHeader}>Widoczność
                        <div className={styles.info}>
                            i
                            <div className={styles.explanationContainer}>
                                <div className={styles.infoContainer}>
                                    Widoczność notatki ustala jej dostępność. W przypadku notatki publicznej każdy zalogowany użytkownik może się do niej dostać poprzez link lub kod. Jeżeli notatka jest prywatna tylko i wyłącznie ty masz do niej dostęp. Hasłem zabezpieczyć możesz tylko notatkę publiczną.
                                </div>
                            </div>
                        </div>
                    </h2>
                    <button disabled={loading} className={`${styles.visibilityBtn} ${visibility === "public"?styles.selectedBtn:''}`} onClick={e=>setVisibility('public')}>Publiczna</button>
                    <button disabled={loading} className={`${styles.visibilityBtn} ${visibility === "private"?styles.selectedBtn:''}`} onClick={e=>setVisibility("private")}>Prywatna</button>
                </div>

                <div className={styles.passwordContainer}>
                    <div onClick={setPasswordEnabling} className={`${styles.checkbox} ${passwordEnabled?styles.checkboxChecked:''}`}></div>
                    <p onClick={setPasswordEnabling} className={styles.checkboxDescription}>Zabezpiecz notatkę hasłem</p>


                    <div className={`${inputStyles.inputContainer} ${loading?inputStyles.inputContainerWhileLoading:''} ${passwordEnabled?"":styles.inputContainerDisabled}`} onClick={divClicked}>
                        <input disabled={loading || !passwordEnabled} value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${inputStyles.input} ${inputStyles.passwordInput} ${!passwordEnabled?styles.passwordDisabled:''}`}></input>
                        <div style={passwordEnabled?{}:{cursor:'default',color:'grey'}} className={`${inputStyles.placeholder} `}>Utwórz hasło</div>
                        <div className={`${inputStyles.eye} ${!passwordEnabled?styles.eyeDisabled:''}`} onClick={e=>!loading && passwordEnabled && setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                    </div>
                </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button ref={btnRef} className={`${styles.create} ${loading?styles.btnLoading:''}`} onClick={sendData}>{loading?<LoadingIcon class={inputStyles.loading} />:"Utwórz Notatkę"}</button>

                </>
                :
                <>
                    <h1 className={styles.header}>Notatka utworzona!</h1>
                    <h2 className={styles.code}>{formatNoteCode()}</h2>
                    <h2 className={styles.link} onClick={copyLink}>
                        {noteLink}
                        <div className={styles.copyContainer}>
                            <CopyIcon class={styles.copyIcon}/>
                            <div className={`${styles.copySuccessInfo} ${showCopyInfo?styles.showCopyInfo:''}`}>
                                <div className={styles.triangle}></div>
                                Skopiowano
                            </div>
                        </div>
                    </h2>

                    <p className={styles.codeDescription}>Oto twój kod i link poprzez, który znajomi mogą dołączyć do twojej notatki. Skopiuj go, roześlij i twórz razem coś kreatywnego!</p>

                    <button ref={btn2Ref} className={styles.joinBtn} onClick={join}>Dołącz do Notatki</button>
                </>}

            </div>

        </article>
    )
}

export default AddingNote