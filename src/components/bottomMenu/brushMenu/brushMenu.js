import { useEffect, useRef, useState } from 'react'
import styles from './brushMenu.module.css'
import RangeSlider from '../imageMenu/rangeSlider/rangeSlider'
import BgColorMenu from '../textMenu/bgColorMenu'
import LineBrushIcon from '../../../assets/svg/lineBrushIcon'
import SprayBrushIcon from '../../../assets/svg/sprayBrushIcon'
import CircleBrushIcon from '../../../assets/svg/circleBrushIcon'
import EraserIcon from '../../../assets/svg/eraserIcon'
import ArrowIcon from '../../../assets/svg/arrowIcon'

function BrushMenu(props)
{
    const [display,setDisplay] = useState()
    const [brush,setBrush] = useState(props.brush)
    const [displayWidth,setDisplayWidth] = useState(false)
    const [lineWidth,setLineWidth] = useState(props.brush.width)
    const [showColorMenu,setShowColorMenu] = useState(false)

    const widthPreviewRef = useRef()

    useEffect(()=>{
        setTimeout(()=>{
            setDisplay(props.display)
        },10)
    },[props.display])

    const changePencil = (params) =>{
        const {type=brush.type,color=brush.color,width=brush.width} = params
        props.setBrush({type,color,width})
        setBrush({type,color,width})
    }

    const setWidthPreviewSizes = () =>
    {
        const value = 1.2 * (lineWidth / 100) + 0.7
        widthPreviewRef.current.style.width = `${value}rem`
        widthPreviewRef.current.style.height = `${value}rem`
    }

    useEffect(()=>{
        // if(brush.type)
        // {
            changePencil({width:lineWidth})
            setWidthPreviewSizes()
        // }
    },[lineWidth])


    const boardEvent = (e) =>{
        const target = e.target.closest(`.${styles.item}`)
        if(!target)
        {
            return;
        }
        if(!target.classList.contains(styles.width))
        {
            setDisplayWidth(false)
        }
        if(!target.classList.contains(styles.bgColorItem))
        {
            setShowColorMenu(false)
        }
    }

    const pencilChanger = (e,target) =>{
        if(e.target.closest(`.${styles.item}`).classList.contains(styles.brushSelected))
        {
            changePencil({type:''})
        }
        else
        {
            changePencil(target)

        }
    }

    return(
        <div className={`${styles.container} ${display?styles.containerDisplay:''}`} onClick={boardEvent}>
            <div className={`${styles.item} ${styles.brushItem} ${brush.type === "brush" ? styles.brushSelected:''}`} onClick={e=>pencilChanger(e,{type:'brush'})}>
                <LineBrushIcon class={styles.brushSvg}/>
            </div>
            <div className={`${styles.item} ${styles.brushItem} ${brush.type === "spray" ? styles.brushSelected:''}`} onClick={e=>pencilChanger(e,{type:'spray'})}>
                <SprayBrushIcon class={styles.brushSvg}/>
            </div>
            <div className={`${styles.item} ${styles.brushItem} ${brush.type === "circle" ? styles.brushSelected:''}`} onClick={e=>pencilChanger(e,{type:'circle'})}>
                <CircleBrushIcon class={styles.brushSvg} />
            </div>
             <div className={`${styles.item} ${styles.brushItem} ${brush.type === "eraser" ? styles.brushSelected:''}`} onClick={e=>pencilChanger(e,{type:'eraser'})}>
                <EraserIcon class={styles.brushSvg} />
            </div>

            <div className={styles.line}></div>

            <div className={`${styles.item} ${styles.width}`} onClick={e=>setDisplayWidth(!displayWidth)}>
                <div className={styles.widthPreview} ref={widthPreviewRef}>
                </div>
                {displayWidth && <div className={styles.filterMenu} ><RangeSlider property={lineWidth} numberFormat={true} setProperty={setLineWidth}/></div>}    
            </div>
            <div className={`${styles.item} ${styles.bgColorItem}`} onClick={e=>setShowColorMenu(!showColorMenu)}>
                <div className={`${styles.bgColorPreview} ${brush.color}`}></div>
                {showColorMenu && <BgColorMenu brush={true} color={brush.color} changeBgColor={changePencil}/>}
            </div>

            <div className={styles.line}></div>

            <div className={styles.item}>
                <ArrowIcon class={styles.arrow}/>
            </div>
            <div className={styles.item}>
                <ArrowIcon class={styles.arrowRotated}/>
            </div>
            <div className={styles.item} onClick={e=>{!brush.type && props.brushMenuClosed();changePencil({type:'',color:brush.color,width:brush.width})}}>
                <div className={`${styles.closeElement} ${brush.type?styles.closeElementDisplay:''}`}>OK</div>
                <div className={`${styles.closeElement} ${!brush.type?styles.closeElementDisplay:''}`}><ArrowIcon class={styles.bottomArrow}/></div>
            </div>
        </div>
    )
}

export default BrushMenu