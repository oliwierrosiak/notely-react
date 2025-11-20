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
            test
        </div>
    )
}

export default BrushMenu