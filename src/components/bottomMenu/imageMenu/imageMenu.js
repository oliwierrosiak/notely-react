import { useEffect, useState } from 'react'
import styles from './imageMenu.module.css'
import DeleteIcon from '../../../assets/svg/deleteIcon'
import BgColorMenu from '../textMenu/bgColorMenu'
import borderColors from './borderMenuColors.module.css'
import CornerMenu from './cornerMenu/cornerMenu'
import BorderRadius from './cornerMenu/borderRadius1'

function ImageMenu(props)
{

    const borderColorSetter = ()=>{
        if(props.element.class)
        {
            const borderColor = props.element.class.find(x=>x.includes('borderBg'))
            return borderColor || 'borderBgBlack6'
        }
        else
        {
            return 'borderBgBlack6'
        }
    }

    const borderWidthSetter = () =>{
        if(props.element.class)
        {
            const borderWidth = props.element.class.find(x=>x.includes('borderWidth'))
            return borderWidth || 'borderWidth1'
        }
        else
        {
            return 'borderWidth1'
        }
    }

    const borderRadiusSetter = () =>{
        if(props.element.class)
        {
            const borderRadius = props.element.class.find(x=>x.includes('borderRadius'))
            return borderRadius || 'borderRadius1'
        }
        else
        {
            return 'borderRadius1'
        }
    }

    const [display,setDisplay] = useState(false)
    const [displayColorMenu,setDisplayColorMenu] = useState(false)
    const [borderColor,setBorderColor] = useState(borderColorSetter())
    const [displayBorderWidthMenu,setDisplayBorderWidthMenu] = useState(false)
    const [borderWidth,setBorderWidth] = useState(borderWidthSetter())
    const [displayCornerMenu,setDisplayCornerMenu] = useState(false)
    const [borderRadius,setBorderRadius] = useState(borderRadiusSetter())

   useEffect(()=>{
        setTimeout(()=>{
            setDisplay(props.display)
        },10)
    },[props.display])

    const setBorderColorFunc = (color) =>{
        if(borderWidth === "borderWidth1")
        {
            props.element.removeClass("borderWidth1")
            props.element.addClass(`borderWidth3`)
        }
        setBorderWidth(`borderWidth3`)
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

    const borderWidthClicked = (width) =>
    {
        const classes = props.element.class
        const filtered = classes.filter(x => x.includes('borderWidth'))
        filtered.forEach(x => {
            props.element.removeClass(x)
        });
        const newClass = `borderWidth${width}`
        props.element.addClass(newClass)
        setBorderWidth(newClass)
        props.setEditUpdate(!props.editUpdate)
    }

    const cornerItemClicked = (cut) =>{
        const classes = props.element.class
        const filtered = classes.filter(x => x.includes('borderRadius'))
        filtered.forEach(x => {
            props.element.removeClass(x)
        });
        const newClass = `borderRadius${cut}`
        props.element.addClass(newClass)
        setBorderRadius(newClass)
        props.setEditUpdate(!props.editUpdate)
    }

    const boardEvent = (e) =>{
        if(!e.target.classList.contains(styles.borderColor) && !e.target.classList.contains(styles.colorPreview))
        {
            setDisplayColorMenu(false)
        }
        if(!e.target.classList.contains(styles.borderWidth) && !e.target.classList.contains(styles.borderWidthPreview))
        {
            setDisplayBorderWidthMenu(false)
        }
        if(!e.target.classList.contains(styles.cornerItem) && !e.target.classList.contains('borderRadiusComponent'))
        {
            setDisplayCornerMenu(false)
        }
    }

    useEffect(()=>{
        setBorderColor(borderColorSetter())
        setBorderWidth(borderWidthSetter())
        setBorderRadius(borderRadiusSetter())
    },[props.element])

    useEffect(()=>{
        window.addEventListener('click',boardEvent)
        return () =>{
            window.removeEventListener('click',boardEvent)
        }
    },[])

    return (
        <div className={`${styles.container} ${display?styles.display:''}`}>
            <div className={`${styles.item} ${styles.borderColor}`} onClick={e=>setDisplayColorMenu(!displayColorMenu)}>
                <div className={`${styles.colorPreview} ${borderColors[borderColor]}`}></div>
                {displayColorMenu && <BgColorMenu changeBgColor={setBorderColorFunc} border={true} color={colorSetter()} item={props.element}/>}
            </div>
            <div className={`${styles.item} ${styles.borderWidth}`} onClick={e=>setDisplayBorderWidthMenu(!displayBorderWidthMenu)}>
                <div className={styles.borderWidthPreview}></div>
                {displayBorderWidthMenu && <ul className={styles.widthMenu}>
                    <li className={`${styles.borderWidthOption} ${borderWidth==="borderWidth6"?styles.selected:''}`} onClick={e=>borderWidthClicked(6)}>
                        <div className={styles.width6}></div>
                    </li>
                    <li className={`${styles.borderWidthOption} ${borderWidth==="borderWidth5"?styles.selected:''}`} onClick={e=>borderWidthClicked(5)}>
                        <div className={styles.width5}></div>
                    </li>
                    <li className={`${styles.borderWidthOption} ${borderWidth==="borderWidth4"?styles.selected:''}`} onClick={e=>borderWidthClicked(4)}>
                        <div className={styles.width4}></div>
                    </li>
                    <li className={`${styles.borderWidthOption} ${borderWidth==="borderWidth3"?styles.selected:''}`} onClick={e=>borderWidthClicked(3)}>
                        <div className={styles.width3}></div>
                    </li>
                    <li className={`${styles.borderWidthOption} ${borderWidth==="borderWidth2"?styles.selected:''}`} onClick={e=>borderWidthClicked(2)}>
                        <div className={styles.width2}></div>
                    </li>
                    <li className={`${styles.borderWidthOption} ${borderWidth==="borderWidth1"?styles.selected:''}`} onClick={e=>borderWidthClicked(1)}>
                        <p>Brak</p>
                    </li>
                </ul>}
            </div>
            <div className={`${styles.item} ${styles.cornerItem}`} onClick={e=>setDisplayCornerMenu(!displayCornerMenu)}>
                <div className={styles.borderRadiusPreview}>
                    <BorderRadius borderRadius={borderRadius} bgColor={styles.borderRadiusIconsColor}/>
                </div>
                {displayCornerMenu && <CornerMenu borderRadius={borderRadius} cornerItemClicked={cornerItemClicked}/>}
            </div>
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