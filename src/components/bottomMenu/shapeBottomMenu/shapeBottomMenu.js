import { useEffect, useState } from 'react'
import DeleteIcon from '../../../assets/svg/deleteIcon'
import styles from './shapeBottomMenu.module.css'
import BgColorMenu from '../textMenu/bgColorMenu'

function ShapeBottomMenu(props)
{
    const [state,setState] = useState(false)
    const colorSetter = () =>{
        if(props.element.class)
        {
            const colorClass = props.element.class.find(x=>x.includes('bg'))
            return colorClass || "bgBlack4"
        }
        else
        {
            return "bgBlack4"
        }
    }

    const [showColorMenu,setShowColorMenu] = useState(false)
    const [color,setColor] = useState(colorSetter())

    const changeColor = (color) =>{
        setColor(color)
        setState(!state)
        props.setEditUpdate(!props.editUpdate)
    }

    const windowEvent = (e) =>{
        if(!e.target.classList.contains(styles.bgColorPreview) && !e.target.classList.contains(styles.colorItem))
        {
            setShowColorMenu(false)
        }
    }

    useEffect(()=>{
        window.addEventListener("click",windowEvent)
        return()=>{
            window.removeEventListener('click',windowEvent)
        }
    },[])

    useEffect(()=>{
        if(props.element)
        {
            setColor(colorSetter())
        }
    },[props.element])

    return(
        <div className={`${styles.container} ${props.display?styles.containerDisplay:''}`}>
            <div className={`${styles.item} ${styles.colorItem}`} onClick={e=>setShowColorMenu(!showColorMenu)}>
                <div className={`${styles.bgColorPreview} ${color}`}></div>
                {showColorMenu && <BgColorMenu withoutTransparent={true} item={props.element} changeBgColor={changeColor} color={color}/>}
            </div>

            <div className={styles.line}>

            </div>

            <div className={styles.item} onClick={e=>props.deleteItem(props.element.id)}>
                <DeleteIcon class={styles.deleteSVG} />
            </div>
        </div>
    )
}

export default ShapeBottomMenu