import styles from './boardUsers.module.css'
import userDefaultImg from '../../../assets/img/userDefault.png'
import { useEffect, useState } from 'react'
import ImgLoadingIcon from '../../../assets/svg/imgLoadingIcon'

function UserItem(props)
{
    const [userImg,setUserImg] = useState(props.img||userDefaultImg)
    const [loading,setLoading] = useState(true)

    return(
        <div className={styles.item}>
            <div className={styles.imgContainer}>
                <img src={userImg} className={styles.img} onLoad={e=>setLoading(false)} onError={e=>{setUserImg(userDefaultImg);setLoading(false)}}/>
                <div className={`${styles.loading} ${loading?styles.loadingDisplay:''}`}>
                    <ImgLoadingIcon class={styles.loadingIcon}/>
                </div>
            </div>
            <p className={styles.username}>{props.name}</p>
        </div>
    )
}

export default UserItem