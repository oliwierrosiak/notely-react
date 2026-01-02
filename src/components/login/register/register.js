import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import styles from '../login-register.module.css'
import PasswordEye from '../../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../../assets/svg/passwordEyeHidden'
import DisplayLoginContext from '../../../context/displayLogin'
import userImg from '../../../assets/img/userDefault.png'
import CameraIcon from '../../../assets/svg/cameraIcon'
import axios from 'axios'
import ApiAddress from '../../../ApiAddress'
import { divClicked,inputBlur,inputFocused } from '../inputActions'
import LoadingIcon from '../../../assets/svg/loadingIcon'

function Register(props)
{
    const [showPage2,setShowPage2] = useState(false)
    const [userImageLink,setUserImageLink] = useState(userImg)
    
    const acceptableImageTypes = ['image/png','image/jpg','image/jpeg','image/pjp','image/jfif','image/jpe','image/pjpeg']

    const displayLoginContext = useContext(DisplayLoginContext)
    
    const fileInputRef = useRef() 
    const nameInputRef = useRef()

    const reducer = (state,action) => {

        const newState = {...state}
        newState[action.type] = action.value
        return newState
    }

    const [showPassword,setShowPassword] = useState(false)
    const [values,dispatch] = useReducer(reducer,{
        name:'',
        email:'',
        password:'',
        passwordRepeat:'',
        img:''
    }) 
    const [errors,setErrors] = useState({
        name:'',
        email:'',
        password:'',
        passwordRepeat:'',
    })


    const sendData = async() =>
    {
        props.setLoading(true)
        const formData = new FormData()
        formData.append('email',values.email)
        formData.append('password',values.password)
        formData.append('name',values.name)
        if(values.img)
        {
            formData.append('img',values.img)
        }

        try
        {
            const response = await axios.post(`${ApiAddress}/register`,formData)
        }
        catch(ex)
        {
            const localErrors = {...errors}
            if(ex.response?.data.errors.email || ex.response?.data.errors.password || ex.response?.data.errors.name)
            {
                localErrors.email = ex.response.data.errors.email
                localErrors.password = ex.response.data.errors.password
                localErrors.name = ex.response.data.errors.name
                setErrors({...localErrors})
                if(localErrors.email || localErrors.password)
                {
                    setShowPage2(false)
                }
            }
            else
            {
                localErrors.name = `Wystąpił błąd serwera`
                setErrors({...localErrors})
                props.setLoading(false)
            }
        }
    }

    const emailRegex = (email) =>
    {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        return regex.test(email)
    }

    const passwordRegex = (passwd) =>
    {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        return regex.test(passwd)
    }

    const validatePage1 = () =>{

        const localErrors = {
        name:'',
        email:'',
        password:'',
        passwordRepeat:''
        }

        if(values.email == '')
        {
            localErrors.email = `Podaj adres email`
        }
        else
        {
            if(!emailRegex(values.email))
            {
                localErrors.email = `Wprowadź prawidłowy adres email`
            }
        }

        if(values.password === '')
        {
            localErrors.password = `Podaj hasło`
        }
        else
        {
            if(!passwordRegex(values.password))
            {
                localErrors.password = 'Hasło jest za słabe'
            }
        }

        if(values.passwordRepeat == '')
        {
            localErrors.passwordRepeat = `Powtórz hasło`
        }
        else
        {
            if(values.passwordRepeat !== values.password)
            {
                localErrors.passwordRepeat = `Hasła nie są identyczne`
            }
        }

        if(!localErrors.email && !localErrors.password && !localErrors.passwordRepeat)
        {
            if(!showPage2)
            {
                setShowPage2(true)
            }
        }

        setErrors({...localErrors})
    }

    const validatePage2 = () =>{
        
        if(props.loading)
        {
            return
        }
        const localErrors = {
        name:'',
        email:'',
        password:'',
        passwordRepeat:'',
        }
        if(values.name === "")
        {
            localErrors.name = `Podaj nazwę`
        }
        else if(values.name.length < 4)
        {
            localErrors.name = `Nazwa jest za krótka`
        }
        setErrors({...localErrors})
        if(!localErrors.name)
        {
            sendData()
        }
    }

    const submit = (e) =>
    {
        e.preventDefault()
        if(!showPage2)
        {
            validatePage1()
        }
        else
        {
            validatePage2()
        }
        
    }

    const fileChosen = (e) =>
    {
        if(e.target.files[0])
        {
            if(acceptableImageTypes.includes(e.target.files[0].type))
            {
                const url = URL.createObjectURL(e.target.files[0])
                setUserImageLink(url)
                dispatch({type:'img',value:e.target.files[0]})
            }
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            setShowPage2(false)
            setErrors({
        name:'',
        email:'',
        password:'',
        passwordRepeat:'',
        img:''
        })
        }, 1000);
    },[props.display])

    useEffect(()=>{
        if(showPage2)
        {
            nameInputRef.current.focus()
            nameInputRef.current.blur()
        }
    },[showPage2])

    return(
        <div className={`${styles.loginForm} ${props.display?styles.display:''}`}>
            <h1 className={styles.header}>Rejestracja</h1>

            <form className={`${styles.form} ${styles.registerForm}`} onSubmit={submit} noValidate>

                <div className={`${styles.page1} ${showPage2?styles.pageHidden:''}`}>

                    <div className={`${styles.inputContainer} ${props.loading?styles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                        <input disabled={props.loading} value={values.email} onChange={e=>dispatch({type:'email',value:e.target.value})} type="email" onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input}`}></input>
                        <div className={styles.placeholder}>Podaj email</div>
                    </div>

                    <div className={styles.error}>{errors.email}</div>

                    <div className={`${styles.inputContainer} ${props.loading?styles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                        <input disabled={props.loading} value={values.password} onChange={e=>dispatch({type:'password',value:e.target.value})} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input} ${styles.passwordInput}`}></input>
                        <div className={styles.placeholder}>Utwórz hasło</div>
                        <div className={styles.eye} onClick={e=>setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                        </div>
                    </div>

                    <div className={styles.error}>{errors.password}</div>

                    <div className={`${styles.inputContainer} ${props.loading?styles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                        <input disabled={props.loading} value={values.passwordRepeat} onChange={e=>dispatch({type:'passwordRepeat',value:e.target.value})} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input} ${styles.passwordInput}`}></input>
                        <div className={styles.placeholder}>Powtórz hasło</div>
                        <div className={styles.eye} onClick={e=>setShowPassword(!showPassword)}>
                            {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                        </div>
                    </div>

                    <div className={styles.error}>{errors.passwordRepeat}</div>

                </div>

                {showPage2 && <div className={styles.page2}>

                    <div className={`${styles.userImg} ${props.loading?styles.userImgWhileLoading:''}`} onClick={e=>fileInputRef.current.click()}>
                        <img src={userImageLink} />
                        <div className={styles.imgOverlay}>
                            <CameraIcon />
                        </div>
                    </div>

                    <button className={`${styles.chooseImg} ${props.loading?styles.chooseImgWhileLoading:''}`} type='button'>
                        <input disabled={props.loading} ref={fileInputRef} type='file' className={styles.fileInput} accept='image/png, image/jpg, image/jpeg' onChange={fileChosen}/>
                        Ustaw Zdjęcie
                    </button>


                    <div className={`${styles.inputContainer} ${props.loading?styles.inputContainerWhileLoading:''}`} onClick={divClicked}>
                        <input disabled={props.loading} ref={nameInputRef} value={values.name} onChange={e=>dispatch({type:"name",value:e.target.value})} type='text' onBlur={inputBlur} onFocus={inputFocused} className={styles.input}></input>
                        <div className={styles.placeholder}>Podaj Nazwę Użytkownika</div>
                    </div>

                    <div className={styles.error3}>{errors.name}</div>

                </div>}

                <button className={`${styles.loginBtn} ${props.loading?styles.btnLoading:''}`}>{showPage2?props.loading?<LoadingIcon class={styles.loading}/>:"Zarejestruj się":"Dalej"}</button>

            </form>

            <div className={styles.bottomLink}>
                Masz już konto? <span className={`${styles.link} ${props.loading?styles.linkWhileLoading:''}`} onClick={e=>!props.loading && displayLoginContext.setDisplayLogin('login')}>
                    Zaloguj się!
                </span>
            </div>

        </div>
    )
}

export default Register