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

function Profile()
{
    const loginContext = useContext(LoginContext)
    const displayLogin = useContext(DisplayLoginContext)

    const navigate = useNavigate('')

    const [userPhoto,setUserPhoto] = useState()
    const [userPhotoLoaded,setUserPhotoLoaded] = useState()
    const [name,setName] = useState('')
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [photoError,setPhotoError] = useState('')

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

    const logout = (e) =>{
        navigate('/')
        loginContext.logout()
    }

    useEffect(()=>{
        getData()
    },[])

    return(
        <div className={styles.container}>
            <main className={styles.main}>
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
                        
                        <div className={`${inputStyles.inputContainer} ${styles.inputContainerDisabled}`}>
                            <input disabled={true} value={loginContext.loggedUser.email} type='text' className={`${inputStyles.input} ${styles.inputDisabled}`}></input>
                            <div className={`${inputStyles.placeholder} ${styles.placeholderDisabled}`}>Adres Email</div>
                        </div>

                    </div>

                    <div className={styles.section}>


                        <div className={styles.nameContainer}>
                            <div className={`${inputStyles.inputContainer} ${styles.nameInputContainer}`} onClick={divClicked}>
                                <input value={name} onChange={e=>setName(e.target.value)} type='text' onBlur={inputBlur} onFocus={inputFocused} ref={nameInputRef} className={inputStyles.input}></input>
                                <div className={inputStyles.placeholder}>Zmień Nazwę</div>
                            </div>
                            <div className={styles.confirm}>
                                <CheckMarkIcon class={styles.checkMarkIcon} />
                            </div>

                            {/* <div className={styles.error}>Podaj nazwę</div> */}
                        </div>

                        

                        <button className={`${styles.btn} ${styles.resetBtn}`}>Resetuj Hasło</button>

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