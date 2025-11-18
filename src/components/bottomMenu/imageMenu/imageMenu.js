import { useEffect, useState } from 'react'
import styles from './imageMenu.module.css'
import DeleteIcon from '../../../assets/svg/deleteIcon'

function ImageMenu(props)
{
    const [display,setDisplay] = useState(false)

   useEffect(()=>{
        setTimeout(()=>{
            setDisplay(props.display)
        },10)
    },[props.display])

    return (
        <div className={`${styles.container} ${display?styles.display:''}`}>
            <div className={styles.item}>Ramka Kolor</div>
            <div className={styles.item}>Ramka grubość</div>
            <div className={styles.item}>ścięcia narożników</div>
            <div className={styles.item}>jasność</div>
            <div className={styles.item}>Kontrast</div>

            <div className={styles.line}></div>

            <div className={`${styles.item} ${styles.deleteItem}`} onClick={e=>props.deleteItem(props.element.id)}>
                <DeleteIcon class={styles.deleteSVG}/>
            </div>
            
        </div>
    )
}

export default ImageMenu