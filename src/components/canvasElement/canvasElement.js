import { Canvas, CircleBrush, PatternBrush, PencilBrush, SprayBrush } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import styles from './canvasElement.module.css'
import brushColors from './brushColors'

function CanvasElement(props)
{
    const canvasRef = useRef()
    const canvasObj = useRef()

    const brushInitialWidth = window.innerWidth/20000

    const getBrushWidth = () =>{
        return brushInitialWidth * props.brush.width
    }

    const getBrushColor = () =>
    {
        return brushColors[props.brush.color]
    }

    const resize = () =>{
        const width = document.documentElement.clientWidth
        const height = document.documentElement.clientHeight
        canvasObj.current.setWidth(width)
        canvasObj.current.setHeight(height)
        console.log('resize')
        if(canvasObj.current.freeDrawingBrush)
        {
            canvasObj.current.freeDrawingBrush.width = getBrushWidth();
        }

        // canvasObj.current.getObjects().forEach(obj=>{
        //     console.log(obj)
        // })
    }

    const objectAddedToCanvas = (e) =>{
        const obj = e.target
        obj.selectable = false
        obj.evented = false
    }

    useEffect(()=>{
       const canvas = new Canvas(canvasRef.current,{
            isDrawingMode:props.drawing
        })


        canvas.selection = false
        canvas.skipTargetFind = false

        canvas.on('object:added',objectAddedToCanvas)

        canvasObj.current = canvas
        resize()

        window.addEventListener("resize",resize)

         return () => {
            canvas.dispose();
            window.removeEventListener("resize",resize)
        };
    },[])

    useEffect(()=>{
        if(canvasObj.current)
        {
            canvasObj.current.isDrawingMode = props.drawing
        }
    },[props.drawing])

    const getBrushType = () =>{
        switch(props.brush.type)
        {
            case "":
                return ""
            case 'brush':
                return new PencilBrush(canvasObj.current)
            case 'spray':
                return new SprayBrush(canvasObj.current)
            case 'circle':
                return new CircleBrush(canvasObj.current)
        }
    }

    useEffect(()=>{
        if(canvasObj.current)
        {
            canvasObj.current.freeDrawingBrush = getBrushType()
            if(props.brush.type)
            {
                canvasObj.current.freeDrawingBrush.width = getBrushWidth()
            }
            if(props.brush.color &&  canvasObj.current.freeDrawingBrush)
            {
                canvasObj.current.freeDrawingBrush.color = getBrushColor()

            }
        }
    },[props.brush])

    return(
        <canvas ref={canvasRef} className={`${styles.container} canvas`}></canvas>
    )
}

export default CanvasElement