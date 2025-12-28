import { useContext, useEffect, useRef, useState } from 'react'
import styles from './brushMenu.module.css'
import RangeSlider from '../imageMenu/rangeSlider/rangeSlider'
import BgColorMenu from '../textMenu/bgColorMenu'
import LineBrushIcon from '../../../assets/svg/lineBrushIcon'
import EraserIcon from '../../../assets/svg/eraserIcon'
import ArrowIcon from '../../../assets/svg/arrowIcon'
import CanvasHistoryContext from '../../../context/canvasHistory'

function BrushMenu(props)
{
    const [display,setDisplay] = useState()
    const [displayWidth,setDisplayWidth] = useState(false)
    const [lineWidth,setLineWidth] = useState(props.brush.width)
    const [showColorMenu,setShowColorMenu] = useState(false)

    const [undoActive,setUndoActive] = useState(false)
    const [redoActive,setRedoActive] = useState(false)

    const widthPreviewRef = useRef()

    const canvasHistory = useContext(CanvasHistoryContext)

    useEffect(()=>{
        setTimeout(()=>{
            setDisplay(props.display)
        },10)
    },[props.display])

    const changePencil = (params) =>{
        const {type=props.brush.type,color=props.brush.color,width=props.brush.width} = params
        props.setBrush({type,color,width})
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

    const undo = () =>{
        
        if(canvasHistory.undoStack.objects.length!=0)
        {
            const localUndo = {...canvasHistory.undoStack}
            let localRedo = {...canvasHistory.redoStack}
            const localUndoObjects = [...localUndo.objects]
            if(!localRedo.objects)
            {
                localRedo = {...localUndo}
                localRedo.objects = [localUndoObjects.at(-1)]
            }
            else
            {
                const localRedoObject = [...localRedo.objects]
                localRedoObject.push(localUndoObjects.at(-1))
                localRedo.objects = [...localRedoObject]
            }
            localUndoObjects.splice(localUndoObjects.length-1,1)
            localUndo.objects = [...localUndoObjects]
            canvasHistory.setUndoStack(localUndo)
            canvasHistory.setRedoStack(localRedo)
            canvasHistory.setUpdate(!canvasHistory.update)
        }
    }

    const redo = () =>{
        if(canvasHistory.redoStack.objects.length > 0)
        {
            const localRedo = {...canvasHistory.redoStack}
            const localRedoObjects = [...localRedo.objects]
            const localUndo = canvasHistory.undoStack
            const localUndoObjects = [...localUndo.objects]
            localUndoObjects.push(localRedoObjects.at(-1))
            localRedoObjects.splice(localRedoObjects.length-1,1)
            localRedo.objects = [...localRedoObjects]
            localUndo.objects = [...localUndoObjects]
            canvasHistory.setUndoStack(localUndo)
            canvasHistory.setRedoStack(localRedo)
            canvasHistory.setUpdate(!canvasHistory.update)
        }
    }

    useEffect(()=>{
        if(canvasHistory.undoStack?.objects?.length > 0)
        {
            setUndoActive(true)
        }
        else
        {
            setUndoActive(false)
        }
    },[canvasHistory.undoStack])

    useEffect(()=>{
        if(canvasHistory.redoStack?.objects?.length > 0)
        {
            setRedoActive(true)
        }
        else
        {
            setRedoActive(false)
        }
    },[canvasHistory.redoStack])

    return(
        <div className={`${styles.container} ${display?styles.containerDisplay:''}`} onClick={boardEvent}>
            <div className={`${styles.item} ${styles.brushItem} ${props.brush.type === "brush" ? styles.brushSelected:''}`} onClick={e=>pencilChanger(e,{type:'brush'})}>
                <LineBrushIcon class={styles.brushSvg}/>
            </div>
             <div className={`${styles.item} ${styles.brushItem} ${props.brush.type === "eraser" ? styles.brushSelected:''}`} onClick={e=>pencilChanger(e,{type:'eraser'})}>
                <EraserIcon class={styles.brushSvg} />
            </div>

            <div className={styles.line}></div>

            <div className={`${styles.item} ${styles.width}`} onClick={e=>setDisplayWidth(!displayWidth)}>
                <div className={styles.widthPreview} ref={widthPreviewRef}>
                </div>
                {displayWidth && <div className={styles.filterMenu} ><RangeSlider property={lineWidth} numberFormat={true} setProperty={setLineWidth}/></div>}    
            </div>
            <div className={`${styles.item} ${styles.bgColorItem}`} onClick={e=>setShowColorMenu(!showColorMenu)}>
                <div className={`${styles.bgColorPreview} ${props.brush.color}`}></div>
                {showColorMenu && <BgColorMenu withoutTransparent={true} brush={true} color={props.brush.color} changeBgColor={changePencil}/>}
            </div>

            <div className={styles.line}></div>

            <div className={`${styles.item} ${undoActive?"":styles.itemHoverDisabled}`} onClick={undo}>
                <ArrowIcon class={`${styles.arrow} ${undoActive?"":styles.arrowDisabled}`}/>
            </div>
            <div className={`${styles.item} ${redoActive?"":styles.itemHoverDisabled}`} onClick={redo}>
                <ArrowIcon class={`${styles.arrowRotated} ${redoActive?"":styles.arrowDisabled}`}/>
            </div>
            <div className={styles.item} onClick={e=>{!props.brush.type && props.brushMenuClosed();changePencil({type:'',color:props.brush.color,width:props.brush.width})}}>
                <div className={`${styles.closeElement} ${props.brush.type?styles.closeElementDisplay:''}`}>OK</div>
                <div className={`${styles.closeElement} ${!props.brush.type?styles.closeElementDisplay:''}`}><ArrowIcon class={styles.bottomArrow}/></div>
            </div>
        </div>
    )
}

export default BrushMenu