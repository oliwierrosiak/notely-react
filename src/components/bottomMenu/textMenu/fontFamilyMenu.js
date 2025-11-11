import { useEffect } from 'react'
import styles from './textMenu.module.css'

function FontFamilyMenu(props)
{



    return (
        <div className={styles.fontFamilyMenuContainer}>
            {props.fonts.map(x=><div className={`${styles.fontFamilyMenuItem} ${x.class} ${x.class === props.fontFamily.class?styles.selected:''}`} onClick={e=>props.changeFontFamily(x)}>{x.text}</div>)}
        </div>
    )
}

export default FontFamilyMenu