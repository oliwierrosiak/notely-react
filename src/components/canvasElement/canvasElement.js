import { Canvas, CircleBrush, Pattern, PatternBrush, PencilBrush, SprayBrush } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import styles from './canvasElement.module.css'

function CanvasElement(props)
{
    const canvasRef = useRef()
    const canvasObj = useRef()

    const resize = () =>{
        const width = document.documentElement.clientWidth
        const height = document.documentElement.clientHeight
        canvasObj.current.setWidth(width)
        canvasObj.current.setHeight(height)
        canvasObj.current.freeDrawingBrush.width = window.innerWidth/1000;
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
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        // canvas.freeDrawingBrush = new SprayBrush(canvas)
        // canvas.freeDrawingBrush = new PatternBrush(canvas)
        // canvas.freeDrawingBrush = new CircleBrush(canvas)
        canvas.freeDrawingBrush.width = window.innerWidth/1000;
        canvas.freeDrawingBrush.color = "red";
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


    return(
        <canvas ref={canvasRef} className={`${styles.container} canvas`}></canvas>
    )
}

export default CanvasElement