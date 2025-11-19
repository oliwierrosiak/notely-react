import { useEffect, useState } from 'react'
import styles from './imageMenu.module.css'
import DeleteIcon from '../../../assets/svg/deleteIcon'
import BgColorMenu from '../textMenu/bgColorMenu'
import borderColors from './borderMenuColors.module.css'

function ImageMenu(props)
{

    const borderColorSetter = ()=>{
        if(props.element.class)
        {
            const borderColor = props.element.class.find(x=>x.includes('border'))
            return borderColor || 'borderBgBlack6'
        }
        else
        {
            return 'borderBgBlack6'
        }
    }

    const [display,setDisplay] = useState(false)
    const [displayColorMenu,setDisplayColorMenu] = useState(false)
    const [borderColor,setBorderColor] = useState(borderColorSetter())
    const [displayBorderWidthMenu,setDisplayBorderWidthMenu] = useState(false)
    const [borderWidth,setBorderWidth] = useState()

   useEffect(()=>{
        setTimeout(()=>{
            setDisplay(props.display)
        },10)
    },[props.display])

    const setBorderColorFunc = (color) =>{
        setBorderColor(color)
        props.setEditUpdate(!props.editUpdate)
    }

    const colorSetter = () =>{
        const color = borderColor.split('border')[1]
        if(!color)
        {
            return 'borderBgBlack6'
        }
        const array = color.split('')
        array.splice(0,1,array[0].toLowerCase())
        return array.join('')
    }

    useEffect(()=>{
        setBorderColor(borderColorSetter())
    },[props.element])

    return (
        <div className={`${styles.container} ${display?styles.display:''}`}>
            <div className={styles.item} onClick={e=>setDisplayColorMenu(!displayColorMenu)}>
                <div className={`${styles.colorPreview} ${borderColors[borderColor]}`}></div>
                {displayColorMenu && <BgColorMenu changeBgColor={setBorderColorFunc} border={true} color={colorSetter()} item={props.element}/>}
            </div>
            <div className={styles.item} onClick={e=>setDisplayBorderWidthMenu(!displayBorderWidthMenu)}>
                {displayBorderWidthMenu && <ul className={styles.widthMenu}>
                    <li>test</li>
                </ul>}
            </div>
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