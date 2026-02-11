import { useNavigate } from 'react-router-dom'
import Icon404 from '../../assets/svg/404Icon'
import styles from './404.module.css'

function Page404()
{
    const navigate = useNavigate()

    return(
        <div className={styles.container}>

            <h1 className={styles.header}>404</h1>

            <Icon404 class={styles.icon}/>

            <button onClick={e=>navigate('/')} className={styles.btn}>Wróć do Strony Głównej</button>

        </div>
    )
}

export default Page404