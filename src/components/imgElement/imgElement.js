import { useContext, useEffect, useRef, useState } from 'react'
import styles from './imgElement.module.css'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'
import ImgErrorIcon from '../../assets/svg/imgErrorIcon'
import ClearElementEditContext from '../../context/clearEdit'

function ImgElement(props)
{
    const clearElementEdit = useContext(ClearElementEditContext)
    
    const containerRef = useRef()
    const [photoLoaded,setPhotoLoaded] = useState(false)
    const [error,setError] = useState(false)

    const changePosition = (e) =>
    {
        props.item.changePosition(e,props.board,props.movingLocked,containerRef.current)
    }

    const setSolidPosition = (e) =>{
        props.item.setSolidPosition(props.board,props.movingLocked)
    }

    const checkEditMode = (e) =>{
        props.item.checkEditMode(e,clearElementEdit,props.setEdit,props.item)
    }

    const resizeElement = () =>{
        props.item.resizeElement(props.board,containerRef.current,props.movingLocked)
    }

    useEffect(()=>{
        props.item.setPositionRelativeToScreen()
        const {left,top} = props.item.getStyles()
        containerRef.current.style.left = left
        containerRef.current.style.top = top
    },[])

    return(
       <div className={`element editOn ${styles.element} ${props.item.getClass()}`} style={props.item.getStyles()} onMouseDown={e=>changePosition(e.target)} onMouseUp={setSolidPosition} onClick={e=>checkEditMode(e.target)} ref={containerRef}>

            {props.item.mimetype.includes('image/')?
            <img style={props.item.getBrightnessAndContrast()} src={props.item.link} onLoad={e=>{setPhotoLoaded(true);props.item.setProportion(e.target)}} onError={e=>{setError(true);setPhotoLoaded(true)}} onDragStart={e=>e.preventDefault()} className={styles.img} onClick={e=>checkEditMode(e.target.closest('div'))} onMouseDown={e=>changePosition(e.target.closest('div'))} onMouseUp={setSolidPosition}/>
            :
            <video style={props.item.getBrightnessAndContrast()} src={props.item.link} controls onLoadedData={e=>{setPhotoLoaded(true);props.item.setProportion(e.target)}} onError={e=>{setError(true);setPhotoLoaded(true)}} onDragStart={e=>e.preventDefault()} className={styles.img} onClick={e=>checkEditMode(e.target.closest('div'))} onMouseDown={e=>changePosition(e.target.closest('div'))} onMouseUp={setSolidPosition}></video>
            }

            {!photoLoaded && <div className={styles.loading}>
                <ImgLoadingIcon />
            </div>}

            {error && <div className={styles.error} onClick={e=>checkEditMode(e.target.closest('.element'))} onMouseDown={e=>changePosition(e.target.closest('.element'))} onMouseUp={setSolidPosition}>
                <ImgErrorIcon class={styles.errorSVG}/>
                <h2>Błąd ładowania</h2>
            </div>}

            <div className={styles.resize} onMouseDown={resizeElement}></div>
        
        </div>
    )
}

export default ImgElement