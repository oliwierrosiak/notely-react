import styles from './bottomMenu.module.css'
import AddingImgForm from '../addingImgForm/addingImgForm'
import { useContext, useEffect, useState } from 'react'
import ClearElementEditContext from '../../../context/clearEdit'
import ZoomInIcon from '../../../assets/svg/zoomInIcon'
import ZoomOutIcon from '../../../assets/svg/zoomOutIcon'
import NoteIcon from '../../../assets/svg/noteIcon'
import BrushIcon from '../../../assets/svg/lineBrushIcon'
import ImageIcon from '../../../assets/svg/imageIcon'
import ShapesIcon from '../../../assets/svg/shapesIcon'
import ShapesMenu from './shapesMenu/shapesMenu'
import BgColorMenu from './textMenu/bgColorMenu'
import imgTemplatePreview from '../../../assets/img/preview.png'
import BackgroundTemplateMenu from './backgroundTemplateMenu'

function BottomMenu(props)
{
    const [showShapesMenu,setShowShapesMenu] = useState(false)
    const [showBoardColorMenu,setShowBoardColorMenu] = useState(false)
    const [displayBackgroundTemplateMenu,setDisplayBackgroundTemplateMenu] = useState(false)
    
    const clearElementEdit = useContext(ClearElementEditContext)

    const textClicked = () =>{
        clearElementEdit()
        props.addTextItem()
        props.setShowAddingImgForm(false)
    }

    const imgClicked = () =>{

        clearElementEdit()
        props.setShowAddingImgForm(!props.showAddingImgForm)
    }

    useEffect(()=>{
        props.setShowAddingImgForm(false)
        setShowShapesMenu(false)
    },[props.display])

    const brushClicked = () =>{
        clearElementEdit()
        props.setShowAddingImgForm(false)
        props.brushClicked()
    }

    useEffect(()=>{
        if(showShapesMenu)
        {
            props.setShowAddingImgForm(false)

        }
    },[showShapesMenu])

    const windowClick = (e) =>{
        const div = e.target.closest(`div`)
        if(div && !div.classList.contains(styles.bgColor) && !div.classList.contains(styles.templatePreview))
        {
            setDisplayBackgroundTemplateMenu(false)
        }
        if(div && !div.classList.contains(styles.bgColor) && !div.classList.contains(styles.colorPreview))
        {
            setShowBoardColorMenu(false)
        }
        if(div && !div.classList.contains(styles.shapesItem))
        {
            setShowShapesMenu(false)
        }
        if(div && !div.classList.contains('addingImgForm') && !div.classList.contains(styles.imageItem))
        {
            props.setShowAddingImgForm(false)
        }
    }

    const touchClick = (e)=>
    {
        if(e.target.classList.contains('canvas'))
        {
            windowClick(e)
        }
    }

    useEffect(()=>{
        window.addEventListener('click',windowClick)
        window.addEventListener('touchstart',touchClick)
        return()=>{
            window.removeEventListener("click",windowClick)
            window.removeEventListener('touchstart',touchClick)
        }
    },[])

    return(
        <div className={`${styles.menu} ${props.display?styles.display:''}`}>

            <AddingImgForm display={props.showAddingImgForm} setShowAddingImgForm={props.setShowAddingImgForm} addImg={props.addImg}/>

            <div className={styles.item} onClick={textClicked}>
                <NoteIcon class={styles.icon} />
            </div>
            <div className={`${styles.item} ${styles.imageItem}`} onClick={imgClicked}>
                <ImageIcon class={styles.icon} />
            </div>

            <div className={styles.item} onClick={brushClicked}>
                <BrushIcon class={styles.icon} />
            </div>
            
            <div className={`${styles.item} ${styles.shapesItem}`} onClick={e=>setShowShapesMenu(!showShapesMenu)}>
                <ShapesIcon class={styles.icon} />
                <ShapesMenu display={showShapesMenu} addShape={props.addShape}/>
            </div>

            <div className={styles.line}></div>

            <div className={`${styles.item} ${styles.bgColor}`} onClick={e=>setShowBoardColorMenu(!showBoardColorMenu)}>
                <div className={`${styles.colorPreview} ${props.boardColor}`}></div>
                {showBoardColorMenu && <BgColorMenu withoutTransparent={true} board={true} changeBgColor={props.setBoardColor} color={props.boardColor}/>}
            </div>

            <div className={`${styles.item} ${styles.bgTemplate}`} onClick={e=>setDisplayBackgroundTemplateMenu(!displayBackgroundTemplateMenu)}>
                <div className={`${styles.templatePreview}`}>
                    <img src={imgTemplatePreview} className={styles.img}/>
                </div>
                {displayBackgroundTemplateMenu && <BackgroundTemplateMenu template={props.backgroundTemplate} setTemplate={props.setBackgroundTemplate}/>}
            </div>

            <div className={styles.line}></div>

            <div className={`${styles.item} zoomItem`} onClick={e=>props.zoomBtn(-100)}>
                <ZoomInIcon class={styles.zoomIcon}/>
            </div>
            <div className={`${styles.item} zoomItem`} onClick={e=>props.zoomBtn(100)}>
                <ZoomOutIcon class={styles.zoomIcon} />
            </div>
        </div>
    )
}

export default BottomMenu