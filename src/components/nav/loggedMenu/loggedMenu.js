import { useContext, useEffect, useState } from 'react'
import styles from './loggedMenu.module.css'
import ImgLoadingIcon from '../../../assets/svg/imgLoadingIcon'
import LoginContext from '../../../context/loginContext'
import defaultImg from '../../../assets/img/userDefault.png'
import ProfileIcon from '../../../assets/svg/profileIcon'
import LogoutIcon from '../../../assets/svg/logoutIcon'
import { useNavigate } from 'react-router-dom'

function LoggedMenu(props)
{

    const [imgLoading,setImgLoading] = useState(true)

    const loginContext = useContext(LoginContext)

    const [img,setImg] = useState(loginContext.loggedUser.img||defaultImg)
    const [displayMenu,setDisplayMenu] = useState(false)

    const navigate = useNavigate()

    const windowResize = (e) =>
    {
        setDisplayMenu(false)
    }

    const windowTouchStart = (e) =>
    {
        if(e.target.closest(`.${styles.container}`))
        {
            if(!e.target.closest(`.${styles.menuContainer}`))
            {
                setDisplayMenu(prev=>!prev)
            }
        }
        else
        {
            setDisplayMenu(false)
        }
    }

    useEffect(()=>{
        window.addEventListener("resize",windowResize)
        window.addEventListener('touchstart',windowTouchStart)
        return()=>
        {
            window.removeEventListener("resize",windowResize)
            window.removeEventListener('touchstart',windowTouchStart)
        }
    },[])

    return(
        <div className={`${styles.container} ${props.boardStyle?styles.boardContainer:''}`}>

            <div className={`${styles.menuContainer} ${displayMenu?styles.displayMenu:''}`}>
                <div className={styles.menu}>

                <div className={`${styles.imgContainer} ${styles.imgContainer2}`}>
                    <img src={img} onLoad={e=>setImgLoading(false)} onError={e=>{e.target.src=defaultImg}}/>
                    <div className={`${styles.imgLoadingOverlay} ${imgLoading?styles.displayImgOverlay:''}`}><ImgLoadingIcon class={styles.loadingSVG}/></div>
                </div>

                <div className={styles.name}>
                    {loginContext.loggedUser.name}
                </div>

                    <button className={styles.menuBtn} onClick={e=>navigate(`/profile/${loginContext.loggedUser.id}`)}>
                        <ProfileIcon class={styles.profileSVG} />
                        Profil
                    </button>


                    <button className={styles.logoutBtn} onClick={e=>{loginContext.logout() && navigate('/')}}>
                        <LogoutIcon class={styles.logoutIcon}/>
                        Wyloguj się
                    </button>

                </div>
            </div>

            <div className={styles.imgContainer}>
                <img src={img} onLoad={e=>setImgLoading(false)} onError={e=>{e.target.src=defaultImg}}/>
                <div className={`${styles.imgLoadingOverlay} ${imgLoading?styles.displayImgOverlay:''}`}><ImgLoadingIcon class={styles.loadingSVG}/></div>
            </div>

            

        </div>
    )
}

export default LoggedMenu