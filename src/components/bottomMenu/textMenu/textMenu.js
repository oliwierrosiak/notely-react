import { useEffect, useState } from 'react'
import styles from './textMenu.module.css'
import ColorMenu from './colorMenu'
import BgColorMenu from './bgColorMenu'

function TextMenu(props)
{

    const fontSizeSetter = () =>{
        if(props.element.class)
        {
            const font = props.element.class.find(x=>x.includes('fontSize'))
            if(font)
            {
                const value = font.split("fontSize")[1]
                return value

            }
            else{
                return 18
            }

        }
        else
        {
            return 18
        }
    }

    const alignSetter = () =>{
        if(props.element.class)
        {
            const align = props.element.class.find(x=>x.includes('align'))
            const direction = align.split('align')[1].toLowerCase()
            return direction
        }
        else
        {
            return "left"
        }
    }

    const colorSetter = () =>{
        if(props.element.class)
        {
            const colorClass = props.element.class.find(x=>x.includes('color'))
            const color = colorClass.split('color')[1].toLowerCase()
            return color
        }   
        else
        {
            return 'black'
        }
    }

    const bgColorSetter = () =>{
        if(props.element.class)
        {
            const colorClass = props.element.class.find(x=>x.includes('bg'))
            return colorClass
        }
        else
        {
            return "bgYellow6"
        }
    }

    const [fontSize,setFontSize] = useState(fontSizeSetter())
    const [state,setState] = useState(true)
    const [showFontMenu,setShowFontMenu] = useState(false)
    const [align,setAlign] = useState(alignSetter())
    const [showAlignMenu,setShowAlignMenu] = useState(false)
    const [showColorMenu,setShowColorMenu] = useState(false)
    const [color,setColor] = useState(colorSetter())
    const [bgColor,setBgColor] = useState(bgColorSetter())
    const [showBgColorMenu,setShowBgColorMenu] = useState(false)


    const boldHandle = () => {
        if(props.element.class.includes('bold'))
        {
            props.element.removeClass('bold')
        }
        else
        {
            props.element.addClass('bold')
        }
        setState(!state)
        props.setEditUpdate(!props.editUpdate)
    }



    const changeFontSize = (val) =>{
        props.element.removeClass(`fontSize${fontSize}`)
        setFontSize(val)
        setShowFontMenu(false)
        props.element.addClass(`fontSize${val}`)
        setState(!state)
        props.setEditUpdate(!props.editUpdate)
    }

    const italicHandle = () =>{
        if(props.element.class.includes('italic'))
        {
            props.element.removeClass('italic')
        }
        else
        {
            props.element.addClass('italic')
        }
        setState(!state)
        props.setEditUpdate(!props.editUpdate)
    }

    const alignHandle = (arg) =>{
        switch(arg)
        {
            case "left":
                props.element.addClass('alignLeft')
                props.element.removeClass('alignCenter')
                props.element.removeClass('alignRight')
                props.element.removeClass('alignJustify')
                setAlign('left')
                break;
            case "center":
                props.element.addClass('alignCenter')
                props.element.removeClass('alignLeft')
                props.element.removeClass('alignRight')
                props.element.removeClass('alignJustify')
                setAlign('center')
                break;
            case "right":
                props.element.addClass('alignRight')
                props.element.removeClass('alignLeft')
                props.element.removeClass('alignCenter')
                props.element.removeClass('alignJustify')
                setAlign('right')
                break
            case "justify":
                props.element.addClass('alignJustify')
                props.element.removeClass('alignLeft')
                props.element.removeClass('alignCenter')
                props.element.removeClass('alignRight')
                setAlign('justify')
                break
        }
        setState(!state)
        props.setEditUpdate(!props.editUpdate)
        setShowAlignMenu(false)
    }

    const boardEvent = (e) =>{
        if(!e.target.classList.contains(styles.fontSizeItem) && !e.target.classList.contains(styles.option))
        {
            setShowFontMenu(false)
        }
        if(!e.target.classList.contains(styles.alignItem) && !e.target.classList.contains(styles.align))
        {
            setShowAlignMenu(false)
        }
        if(!e.target.classList.contains(styles.colorItem) && !e.target.classList.contains(styles.color))
        {
            setShowColorMenu(false)
        }
        if(!e.target.classList.contains(styles.bgColorItem) && !e.target.classList.contains(styles.colorPreview) && !e.target.classList.contains(styles.bgColorItem))
        {
            setShowBgColorMenu(false)
        }
    }

    const changeColor = (color) =>{
        setColor(color)
        setState(!state)
        props.setEditUpdate(!props.editUpdate)
    }

    const changeBgColor = (color) =>{
        setBgColor(color)
        setState(!state)
        props.setEditUpdate(!props.editUpdate)
    }

    const getColorClass = () =>{
        return styles[color]
    }

    useEffect(()=>{
        window.addEventListener('click',boardEvent)
        return () =>{
            window.removeEventListener('click',boardEvent)
        }
    },[])

    useEffect(()=>{
        setAlign(alignSetter())
        setFontSize(fontSizeSetter())
        setColor(colorSetter())
        setBgColor(bgColorSetter())
    },[props.element])

    return(
        <div className={`${styles.container} ${props.display?styles.display:''}`}>

            <div className={`${styles.menuItem} ${styles.fontSizeItem}`} onClick={e=>e.target.classList.contains(styles.menuItem) && setShowFontMenu(!showFontMenu)}>
                {fontSize}
                {showFontMenu &&
                <div className={`${styles.fontSizeMenu}`}>
                    <div className={`${styles.option} ${fontSize === 32?styles.selected:''}`} onClick={e=>changeFontSize(32)}>32</div>
                    <div className={`${styles.option} ${fontSize === 28?styles.selected:''}`} onClick={e=>changeFontSize(28)}>28</div>
                    <div className={`${styles.option} ${fontSize === 24?styles.selected:''}`} onClick={e=>changeFontSize(24)}>24</div>
                    <div className={`${styles.option} ${fontSize === 20?styles.selected:''}`} onClick={e=>changeFontSize(20)}>20</div>
                    <div className={`${styles.option} ${fontSize === 18?styles.selected:''}`} onClick={e=>changeFontSize(18)}>18</div>
                    <div className={`${styles.option} ${fontSize === 16?styles.selected:''}`} onClick={e=>changeFontSize(16)}>16</div>
                    <div className={`${styles.option} ${fontSize === 14?styles.selected:''}`} onClick={e=>changeFontSize(14)}>14</div>
                    <div className={`${styles.option} ${fontSize === 12?styles.selected:''}`} onClick={e=>changeFontSize(12)}>12</div>
                    <div className={`${styles.option} ${fontSize === 10?styles.selected:''}`} onClick={e=>changeFontSize(10)}>10</div>
                </div> }
            </div>

            <div className={`${styles.menuItem} ${props.element.class?.includes('bold')?styles.marked:''}`} onClick={boldHandle}>B</div>

            <div className={`${styles.menuItem} ${styles.italic} ${props.element.class?.includes('italic')?styles.marked:''}`} onClick={italicHandle}>I</div>

            <div className={`${styles.menuItem} ${styles.align}`} onClick={e=>e.target.classList.contains(styles.menuItem) && setShowAlignMenu(!showAlignMenu)}>
                align
                {showAlignMenu &&
                <div className={styles.alignMenu}>
                    <div className={`${styles.alignItem} ${align === "left"?styles.selected:''}`} onClick={e=>alignHandle('left')}>left</div>
                    <div  className={`${styles.alignItem} ${align === "center"?styles.selected:''}`} onClick={e=>alignHandle('center')}>center</div>
                    <div  className={`${styles.alignItem} ${align === "right"?styles.selected:''}`} onClick={e=>alignHandle('right')}>right</div>
                    <div  className={`${styles.alignItem} ${align === "justify"?styles.selected:''}`} onClick={e=>alignHandle('justify')}>justify</div>
                </div>}

            </div>

            <div className={`${styles.menuItem} ${styles.color} ${getColorClass()}`} onClick={e=>setShowColorMenu(!showColorMenu)}>
                T
                {showColorMenu &&
                <ColorMenu color={color} changeColor={changeColor} item={props.element}/>}
            </div>

            <div className={`${styles.menuItem} ${styles.bgColorItem}`} onClick={e=>setShowBgColorMenu(!showBgColorMenu)}>
                <div className={`${styles.colorPreview} ${bgColor}`} onClick={e=>setShowBgColorMenu(!showBgColorMenu)}></div>

                {showBgColorMenu &&
                <BgColorMenu item={props.element} changeBgColor={changeBgColor} color={bgColor}/>}
            </div>

            <div className={styles.menuItem}></div>

        </div>
    )
}

export default TextMenu