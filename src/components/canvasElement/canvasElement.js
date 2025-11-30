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
        if( canvasObj.current.freeDrawingBrush)
        {
            canvasObj.current.freeDrawingBrush.width = window.innerWidth/1000;

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
        // canvas.freeDrawingBrush = new PencilBrush(canvas);
        if(canvas.freeDrawingBrush)
        {
            canvas.freeDrawingBrush.width = window.innerWidth/1000;
            canvas.freeDrawingBrush.color = "red";

        }

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

    const getBrushMode = () =>{
        switch(props.brush.type)
        {
            case "":
                return ""
            case 'brush':
                return new PencilBrush(canvasObj.current)
            case 'pattern':
                return new PatternBrush(canvasObj.current)
            case 'spray':
                return new SprayBrush(canvasObj.current)
            case 'circle':
                return new CircleBrush(canvasObj.current)
        }
    }

    useEffect(()=>{
        if(canvasObj.current)
        {
            canvasObj.current.freeDrawingBrush = getBrushMode()
        }
    },[props.brush])

    return(
        <canvas ref={canvasRef} className={`${styles.container} canvas`}></canvas>
    )
}

export default CanvasElement