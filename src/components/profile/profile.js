import { useContext, useEffect, useRef, useState } from 'react'
import styles from './profile.module.css'
import LoginContext from '../../context/loginContext'
import { useNavigate } from 'react-router-dom'
import inputStyles from '../login/login-register.module.css'
import userDefaultImg from '../../assets/img/userDefault.png'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'
import CameraIcon from '../../assets/svg/cameraIcon'
import { divClicked, inputBlur, inputFocused } from '../login/inputActions'
import CheckMarkIcon from '../../assets/svg/checkmarkIcon'
import LogoutIcon from '../../assets/svg/logoutIcon'

function Profile()
{
    const loginContext = useContext(LoginContext)

    const navigate = useNavigate('')

    const [userPhoto,setUserPhoto] = useState()
    const [userPhotoLoaded,setUserPhotoLoaded] = useState()
    const [name,setName] = useState('')

    const fileInputRef = useRef()
    const nameInputRef = useRef()

    useEffect(()=>{
        if(!loginContext.logged && !loginContext.loginLoading)
        {
            navigate('/')
        }
        if(loginContext.loggedUser && !loginContext.loginLoading)
        {
            setUserPhoto(loginContext.loggedUser.img||userDefaultImg)
            setName(loginContext.loggedUser.name)
            setTimeout(() => {
                nameInputRef.current.focus()
                nameInputRef.current.blur()
                
            }, 50);
        }
    },[loginContext.loginLoading])

    const logout = (e) =>{
        navigate('/')
        loginContext.logout()
    }

    return(
        <div className={styles.container}>
            <main className={styles.main}>
                    <div className={styles.logo}></div>

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

                            {/* <div className={styles.error}>Niewłaściwy typ pliku</div> */}

                            <button className={styles.changePhoto}>
                                <input type='file' ref={fileInputRef} className={styles.inputFile}/>
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
            </main>
        </div>
        
    )
}

export default Profile