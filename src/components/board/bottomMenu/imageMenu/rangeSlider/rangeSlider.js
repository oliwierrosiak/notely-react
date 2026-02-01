import { useEffect, useRef, useState } from 'react'
import styles from './rangeSlider.module.css'

function RangeSlider(props)
{
    const container = useRef()

    const propertySetter = () =>
    {
        const percent = Math.round(props.property/2*100)
        return percent
    }

    const [width,setWidth] = useState(props.numberFormat?props.property:propertySetter())
    const [showLabel,setShowLabel] = useState(false)

    const setPosition = (position) => {
        const percent = Math.round(position/2*100)
        setWidth(percent)
    }

    const  mouseMoveFuncInNumberFormat = (e) =>
    {
        let event = e
        if(e.changedTouches)
        {
            event = e.changedTouches[0]
        }
        const value = ((event.clientX-container.current.getBoundingClientRect().left)/(container.current.clientWidth))
        let valueRound = (Math.round(value*100))
        if(valueRound < 1)
        {
            valueRound = 1
        }
        if(valueRound > 100)
        {
            valueRound = 100
        }
        props.setProperty(valueRound)
        setWidth(valueRound)
    }

    const mouseMoveFunc = (e) =>{
        if(props.numberFormat)
        {
            return mouseMoveFuncInNumberFormat(e)
        }
        let event = e
        if(e.changedTouches)
        {
            event = e.changedTouches[0]
        }
        const value = ((event.clientX-container.current.getBoundingClientRect().left)/(container.current.clientWidth/2))
        let valueRound = (Math.round(value*100)/100)
        if(valueRound < 0)
        {
            valueRound = 0
        }
        if(valueRound > 2)
        {
            valueRound = 2
        }
        props.setProperty(valueRound)
        setPosition(valueRound)
    }

    const setSolidPosition = () =>
    {
        setShowLabel(false)
        window.removeEventListener('mousemove',mouseMoveFunc)
        window.removeEventListener('touchmove',mouseMoveFunc)
    }

    const containerClicked = (e) =>
    {
        setShowLabel(true)
        window.addEventListener('touchmove',mouseMoveFunc)
        window.addEventListener('touchend',setSolidPosition)
        window.addEventListener('mousemove',mouseMoveFunc)
        window.addEventListener('mouseup',setSolidPosition)
    }

    useEffect(()=>{
        return ()=>{
            setShowLabel(false)
            window.removeEventListener('touchmove',mouseMoveFunc)
            window.removeEventListener('mousemove',mouseMoveFunc)
            window.removeEventListener('mouseup',setSolidPosition)
            window.removeEventListener('touchend',setSolidPosition)
        }
    },[])

    const calcWidth = () =>{
        if(width === 50)
        {
            return 0
        }
        if(width < 50)
        {
            return -Math.round((1-width/50)*100)
        }
        else if(width > 50)
        {
            return Math.round((width/50-1)*100)
        }
    }

   

    return(
        <>
        <div className={`${styles.container} range`} ref={container} onMouseDown={containerClicked} onTouchStart={containerClicked} onClick={mouseMoveFunc}>
            <div className={`${styles.fill} range`} style={{'width':`${width}%`}}></div>
            <div className={`${styles.ball} range`} style={{'left':`${width}%`}}>
                <div className={`range ${styles.label} ${showLabel?styles.showLabel:''}`}>{props.numberFormat?width:calcWidth()}{props.numberFormat?"":'%'}</div>
            </div>
        </div>
        </>
    )
}

export default RangeSlider