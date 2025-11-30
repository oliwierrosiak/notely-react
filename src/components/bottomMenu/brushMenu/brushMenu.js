import { useEffect, useState } from 'react'
import styles from './brushMenu.module.css'

function BrushMenu(props)
{
    const [display,setDisplay] = useState()
    const [brush,setBrush] = useState(props.brush)

    useEffect(()=>{
        setTimeout(()=>{
            setDisplay(props.display)
        },10)
    },[props.display])

    const changePencil = (params) =>{
        const {type,color="black",width=1} = params
        props.setBrush({type,color,width})
    }

    return(
        <div className={`${styles.container} ${display?styles.containerDisplay:''}`}>
            <div className={styles.item} onClick={e=>changePencil({type:'brush'})}>linia</div>
            <div className={styles.item} onClick={e=>changePencil({type:'pattern'})}>przer</div>
            <div className={styles.item} onClick={e=>changePencil({type:'spray'})}>spary</div>
            <div className={styles.item} onClick={e=>changePencil({type:'circle'})}>circle</div>
            <div className={styles.item}>4</div>
            <div className={styles.item}>5</div>
            <div className={styles.item} onClick={e=>{props.brushMenuClosed();changePencil({type:''})}}>close</div>
        </div>
    )
}

export default BrushMenu