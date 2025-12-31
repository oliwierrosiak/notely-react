import { useContext, useReducer, useState } from 'react'
import styles from '../login-register.module.css'
import PasswordEye from '../../../assets/svg/passwordEye'
import PasswordEyeHidden from '../../../assets/svg/passwordEyeHidden'
import DisplayLoginContext from '../../../context/displayLogin'
import userImg from '../../../assets/img/userDefault.png'

function Register(props)
{
    const [showPage2,setShowPage2] = useState(false)

    const displayLoginContext = useContext(DisplayLoginContext)

    const reducer = (state,action) =>{
        switch(action.action)
        {
            case 'name':
                return {name:action.value}
            case 'email':
                return {email:action.email}
            case 'password':
                return {password:action.password}
            case 'passwordRepeat':
                return {passwordRepeat:action.passwordRepeat}
        }
    }

    const [showPassword,setShowPassword] = useState(false)
    const [values,dispatch] = useReducer(reducer,{
        name:'',
        email:'',
        password:'',
        passwordRepeat:''
    }) 

    const divClicked = (e) =>{
        const input = e.target.closest(`.${styles.inputContainer}`).children[0]
        input.focus()
    }

    const inputFocused = (e) =>{
        const div = e.target.closest(`.${styles.inputContainer}`)
        div.classList.add(styles.containerFocused)
        div.children[0].classList.add(styles.inputFocused)
        div.children[1].classList.add(styles.placeholderFocused)
        div.children[1].classList.add(styles.placeholderColorWhileFocused)
    }

    const inputBlur = (e) =>{
        const div = e.target.closest(`.${styles.inputContainer}`)
        div.classList.remove(styles.containerFocused)
         div.children[0].classList.remove(styles.inputFocused)
        div.children[1].classList.remove(styles.placeholderColorWhileFocused)
        if(e.target.value.trim() === "")
        {
            div.children[1].classList.remove(styles.placeholderFocused)
        }

    }

    const submit = (e) =>
    {
        e.preventDefault()
        if(!showPage2)
        {
            setShowPage2(true)
        }
    }

    return(
        <div className={`${styles.loginForm} ${props.display?styles.display:''}`}>
            <h1 className={styles.header}>Rejestracja</h1>

            <form className={styles.form} onSubmit={submit}>

                <div className={styles.page1}>

                    <div className={styles.inputContainer} onClick={divClicked}>
                        <input value={values.email} onChange={e=>dispatch({action:'email',value:e.target.value})} type="text" onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input}`}></input>
                        <div className={styles.placeholder}>Podaj email</div>
                    </div>

                    <div className={styles.inputContainer} onClick={divClicked}>
                        <input value={values.password} onChange={e=>dispatch({action:'password',value:e.target.value})} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input} ${styles.passwordInput}`}></input>
                        <div className={styles.placeholder}>Utwórz hasło</div>
                        <div className={styles.eye} onClick={e=>setShowPassword(!showPassword)}>
                        {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                        </div>
                    </div>

                    <div className={styles.inputContainer} onClick={divClicked}>
                        <input value={values.passwordRepeat} onChange={e=>dispatch({action:'passwordRepeat',value:e.target.value})} type={showPassword?'text':'password'} onBlur={inputBlur} onFocus={inputFocused} className={`${styles.input} ${styles.passwordInput}`}></input>
                        <div className={styles.placeholder}>Powtórz hasło</div>
                        <div className={styles.eye} onClick={e=>setShowPassword(!showPassword)}>
                            {showPassword?<PasswordEye />:<PasswordEyeHidden />}
                        </div>
                    </div>

                </div>

                {showPage2 && <div className={styles.page2}>

                    <div className={styles.userImg}>
                        <img src={userImg} />
                    </div>

                    <button className={styles.chooseImg} type='button'>Ustaw Zdjęcie</button>

                    <div className={styles.inputContainer} onClick={divClicked}>
                        <input value={values.name} onChange={e=>dispatch({action:"name",value:e.target.value})} type='text' onBlur={inputBlur} onFocus={inputFocused} className={styles.input}></input>
                        <div className={styles.placeholder}>Podaj Nazwę Użytkownika</div>
                    </div>

                </div>}

                <button className={styles.loginBtn}>{showPage2?"Zarejestruj się":"Dalej"}</button>

            </form>

            <div className={styles.bottomLink}>
                Masz już konto? <span className={styles.link} onClick={e=>displayLoginContext.setDisplayLogin('login')}>
                    Zaloguj się!
                </span>
            </div>

        </div>
    )
}

export default Register