import styles from '../login-register.module.css'

function Register(props)
{
    return(
        <div className={`${styles.loginForm} ${props.display?styles.display:''}`}>
            <h1>Rejestracja</h1>
        </div>
    )
}

export default Register