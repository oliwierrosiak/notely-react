import { useEffect, useState } from 'react'
import styles from './brushMenu.module.css'

function BrushMenu(props)
{
    const [display,setDisplay] = useState()

    useEffect(()=>{
        setTimeout(()=>{
            setDisplay(props.display)
        },10)
    },[props.display])

    return(
        <div className={`${styles.container} ${display?styles.containerDisplay:''}`}>
            <div className={styles.item}>0</div>
            <div className={styles.item}>1</div>
            <div className={styles.item}>2</div>
            <div className={styles.item}>3</div>
            <div className={styles.item}>4</div>
            <div className={styles.item}>5</div>
            <div className={styles.item} onClick={props.brushMenuClosed}>close</div>
        </div>
    )
}

export default BrushMenu