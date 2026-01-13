import { useContext, useEffect, useRef, useState } from 'react'
import styles from './profile.module.css'
import LoginContext from '../../context/loginContext'
import { Form, useNavigate } from 'react-router-dom'
import inputStyles from '../login/login-register.module.css'
import userDefaultImg from '../../assets/img/userDefault.png'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'
import CameraIcon from '../../assets/svg/cameraIcon'
import { divClicked, inputBlur, inputFocused } from '../login/inputActions'
import CheckMarkIcon from '../../assets/svg/checkmarkIcon'
import LogoutIcon from '../../assets/svg/logoutIcon'
import refreshToken from '../auth/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import LoadingIcon from '../../assets/svg/loadingIcon'
import ErrorIcon from '../../assets/svg/errorIcon'
import DisplayLoginContext from '../../context/displayLogin'
import ArrowIcon from '../../assets/svg/arrowIcon'
import InfoIcon from '../../assets/svg/infoIcon'
import CloseIcon from '../../assets/svg/closeIcon'

function Profile()
{
    const loginContext = useContext(LoginContext)
    const displayLogin = useContext(DisplayLoginContext)

    const navigate = useNavigate('')

    const [userPhoto,setUserPhoto] = useState('')
    const [userPhotoLoaded,setUserPhotoLoaded] = useState(false)
    const [name,setName] = useState('')
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [photoError,setPhotoError] = useState('')
    const [nameLoading,setNameLoading] = useState(false)
    const [nameError,setNameError] = useState('')

    const [message,setMessage] = useState({type:'',text:''})
    const [displayMessage,setDisplayMessage] = useState(false)

    const fileInputRef = useRef()
    const nameInputRef = useRef()

    const acceptableImageTypes = ['image/png','image/jpg','image/jpeg','image/pjp','image/jfif','image/jpe','image/pjpeg']

    const getData = async()=>{
        try
        {
            const token = await refreshToken()
            const response = await axios.get(`${ApiAddress}/getUserData`,{headers:{Authorization:`Bearer ${token}`}})
            setUserPhoto(response.data.img || userDefaultImg)
            setName(response.data.name)
            setLoading(false)
            setTimeout(() => {
                nameInputRef.current.focus()
                nameInputRef.current.blur()
            }, 50);
        }   
        catch(ex)
        {
            if(ex.status === 401)
            {
                navigate('/')
                displayLogin.setDisplayLogin('login')
            }
            else
            {
                setError(true)
            }
        }
    }

    const sendNewPhoto = async(file)=>{
        try
        {
            const formData = new FormData()
            formData.append('photo',file)
            const token = await refreshToken()
            const response = await axios.put(`${ApiAddress}/updateUserPhoto`,formData,{headers:{"Authorization":`Bearer ${token}`}})
            setLoading(true)
            getData()
        }
        catch(ex)
        {
            setUserPhotoLoaded(true)
            setPhotoError("Błąd aktualizacji zdjęcia")
        }
    }

    const photoChanged = (e) =>{
        setPhotoError('')
        if(e.target.files[0])
        {
            if(acceptableImageTypes.includes(e.target.files[0].type))
            {
                setUserPhotoLoaded(false)
                sendNewPhoto(e.target.files[0])
            }
            else
            {
                setPhotoError('Niewłaściwy typ pliku')
            }
        }
        
    }

    const updateName = async()=>{
        try
        {
            setNameLoading(true)
            const token = await refreshToken()
            const response = await axios.put(`${ApiAddress}/updateUserName`,{name:name},{headers:{"Authorization":`Bearer ${token}`}})
            setLoading(true)
            getData()
            setNameLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 400 && ex.response?.data?.errors?.name)
            {
                setNameError(ex.response.data.errors.name)
            }
            else
            {
                setNameError("Błąd aktualizacji nazwy")

            }
            setNameLoading(false)
        }
    }

    const validName = () =>
    {
        setNameError('')
        if(name === '')
        {
            setNameError("Podaj nazwę")
        }
        else
        {
            updateName()
        }
    }

    const logout = (e) =>{
        navigate('/')
        loginContext.logout()
    }

    useEffect(()=>{
        getData()
    },[])

    const closeMessage = () =>{
        setDisplayMessage(false)
         setTimeout(() => {
           setMessage({text:'',type:''})
        }, 300);
    }

    const addMessage = (type,text) =>{
        setMessage({type,text})
        setDisplayMessage(true)
        setTimeout(() => {
                setDisplayMessage(false)

                setTimeout(() => {
                    setMessage({type:'',text:''})
                }, 300);
            }, 3500);
        
    }

    const passwordReset = async() =>{
        if(displayMessage) return
        try
        {
            const token = await refreshToken()
            const response = await axios.get(`${ApiAddress}/sendResetPasswordLink`,{headers:{"Authorization":`Bearer ${token}`}})
        }
        catch(ex)
        {
            addMessage('error','Nie udało się zresetować hasła')
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.messageContainer}>
                <div className={`${styles.message} ${displayMessage?styles.displayMessage:''}`}>
                    <div className={styles.icon}>
                        {message.type === "info" && <InfoIcon />}
                        {message.type === "error" && <ErrorIcon />}
                    </div>
                    <div className={styles.text}>
                        {message.text}
                    </div>
                    <div className={styles.close} onClick={closeMessage}>
                        <CloseIcon />
                    </div>
                    <div className={styles.progress}>
                        <div className={`${styles.progressFill} ${displayMessage?styles.progressFilled:''}`}></div>
                    </div>
                </div>

            </div>

            <main className={styles.main}>

                

                <div className={`${styles.back} ${nameLoading || !userPhotoLoaded?styles.backWhileLoading:''}`} onClick={e=>!nameLoading && userPhotoLoaded && navigate('/')}>
                <ArrowIcon class={styles.backSVG}/>
                </div>

                    <div className={styles.logo}></div>
                    {loading?<div className={styles.loadingContainer}>
                        {error?
                        <>
                            <ErrorIcon class={styles.errorIcon}/>
                            <h2 className={styles.errorHeader}>Wystąpił błąd ładowania</h2>
                        </>
                        :
                        <LoadingIcon class={styles.pageLoading}/>}
                    </div>:<>

                    <div className={styles.section}>
                        
                        <div className={styles.photoContainer}>
                            <div className={styles.userImgContainer} onClick={e=>fileInputRef.current.click()}>
                                <img src={userPhoto} onLoad={e=>setUserPhotoLoaded(true)} onError={e=>setUserPhoto(userDefaultImg)}/>
                                <div className={styles.imageOverlay}>
                                    <CameraIcon/>
                                </div>
                                <div className={`${styles.imageLoading} ${userPhotoLoaded?styles.imageLoadingHidden:''}`}>
                                    <ImgLoadingIcon class={styles.loadingIcon}/>    
                                </div>
                            </div>

                            {photoError && <div className={styles.error}>{photoError}</div>}

                            <button className={styles.changePhoto}>
                                <input disabled={!userPhotoLoaded} onChange={photoChanged} type='file' ref={fileInputRef} className={styles.inputFile} accept='image/png, image/jpg, image/jpeg'/>
                                Zmień Zdjęcie
                            </button>

                            
                        </div>
                        
                        <div className={styles.email}>
                            {loginContext.loggedUser.email}
                        </div>

                    </div>

                    <div className={styles.section}>


                        <div className={styles.nameContainer}>
                            <div className={`${inputStyles.inputContainer} ${styles.nameInputContainer} ${nameLoading?inputStyles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                                <input disabled={nameLoading} value={name} onChange={e=>setName(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} ref={nameInputRef} className={inputStyles.input}></input>
                                <div className={inputStyles.placeholder}>Zmień Nazwę</div>
                            </div>
                            <div onClick={e=>!nameLoading && validName()} className={`${styles.confirm} ${nameLoading?styles.confirmWhileLoading:''}`}>
                                {nameLoading?<ImgLoadingIcon class={styles.checkMarkLoading}/>:
                                <CheckMarkIcon class={styles.checkMarkIcon} />}
                            </div>

                            {nameError && <div className={styles.error}>{nameError}</div>}
                        </div>

                        

                        <button onClick={passwordReset} className={`${styles.btn} ${styles.resetBtn}`}>Resetuj Hasło</button>

                        <button className={`${styles.btn} ${styles.logoutBtn}`} onClick={logout}>
                            <LogoutIcon class={styles.logoutIcon}/>
                            Wyloguj Się
                        </button>

                        <button className={`${styles.btn} ${styles.deleteBtn}`}>Usuń Konto</button>

                    </div>

                    </>}
            </main>

        </div>
        
    )
}

export default Profile