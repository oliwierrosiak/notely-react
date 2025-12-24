import { useEffect, useRef, useState } from 'react'
import DeleteIcon from '../../../assets/svg/deleteIcon'
import styles from './shapeBottomMenu.module.css'
import BgColorMenu from '../textMenu/bgColorMenu'

function ShapeBottomMenu(props)
{
    const colorSetter = () =>{
        if(props.element.class)
        {
            const colorClass = props.element.class.find(x=>x.includes('fill'))
            return colorClass || "fillBlack4"
        }
        else
        {
            return "fillBlack4"
        }
    }

    const rotateSetter = () =>{
        if(props.element.rotate)
        {
            return props.element.rotate
        }
        else
        {
            return 0
        }
    }

    const [color,setColor] = useState(colorSetter())

    const colorNameSetter = () =>{
        const array = color.split('fill')[1]
        return `bg${array}`
    }

    const [state,setState] = useState(false)
    const [rotate,setRotate] = useState(rotateSetter())
    const [showColorMenu,setShowColorMenu] = useState(false)
    const [colorName,setColorName] = useState(colorNameSetter())


    const inputRef = useRef()

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
            setRotate(rotateSetter())
        }
    },[props.element])

    useEffect(()=>{
        setColorName(colorNameSetter())
    },[color])

    const setRotateValue = (e) =>
    {
        const nextValue = e.target.value;
        const nextValueArray = e.target.value.split('')
        if (/^\d{0,3}$/.test(nextValue)) {
            for(let i = 0;i<nextValueArray.length;i++)
            {
                
                if(nextValueArray[i] == "0" && nextValueArray.length > 1)
                {
                    nextValueArray.splice(i,1)
                }
                else
                {
                    break
                }
            }
            if(nextValueArray.length)
            {
                props.element.setRotate(nextValueArray.join(''))
                props.setShapeUpdater(!props.shapeUpdater)
            }
            else
            {
                props.element.setRotate(0)
                props.setShapeUpdater(!props.shapeUpdater)
            }
            setRotate(nextValueArray.join(''));
        }
        
    }

    const checkValue = () =>{
        if(rotate === '')
        {
            setRotate(0)
        }
    }

    

    return(
        <div className={`${styles.container} ${props.display?styles.containerDisplay:''}`}>

            <div className={styles.itemRotate} onClick={e=>inputRef.current.focus()}>
                <input ref={inputRef} type='text' inputMode='numeric' value={rotate} onChange={setRotateValue} className={styles.input} onBlur={checkValue}/>
                <p className={styles.degrees}>&deg;</p>
            </div>

            <div className={`${styles.item} ${styles.colorItem}`} onClick={e=>setShowColorMenu(!showColorMenu)}>
                <div className={`${styles.bgColorPreview} ${colorName}`}></div>
                {showColorMenu && <BgColorMenu shapes={true} withoutTransparent={true} item={props.element} changeBgColor={changeColor} color={colorName}/>}
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