import { Canvas, CircleBrush, PatternBrush, PencilBrush, SprayBrush } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import brushColors from './brushColors'
import cursor from '../../assets/img/cursor.png'

function CanvasElement(props)
{
    const canvasRef = useRef()
    const canvasObj = useRef()
    const currentScale = useRef({x:1,y:1})

    const [brushInitialWidth,setBrushInitialWidth] = useState(window.innerWidth/20000)
    const initialSizes = {width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}

    const getBrushWidth = (width = props.brush.width) =>{
        return brushInitialWidth * width
    }

    const getBrushColor = () =>
    {
        return brushColors[props.brush.color]
    }

    const resize = () =>{
        const width = document.documentElement.clientWidth
        const height = document.documentElement.clientHeight
        // canvasObj.current.setWidth(width)
        // canvasObj.current.setHeight(height)
        canvasObj.current.setWidth(2500)
        canvasObj.current.setHeight(2500)

        setBrushInitialWidth(window.innerWidth/40000)

        // const scaleX = width/initialSizes.width
        // const scaleY = height/initialSizes.height

        // const deltaX = scaleX / currentScale.current.x
        // const deltaY = scaleY / currentScale.current.y

        // canvasObj.current.getObjects().forEach(obj=>{
        //     obj.scaleX *= deltaX
        //     obj.scaleY *= deltaY
        //     obj.left *= deltaX
        //     obj.top *= deltaY
        //     obj.setCoords()
        // })

        // currentScale.current = {x:scaleX,y:scaleY}

        // canvasObj.current.renderAll()
    }

    useEffect(()=>{
        if(canvasObj.current?.freeDrawingBrush)
        {
            canvasObj.current.freeDrawingBrush.width = getBrushWidth();
        }
    },[brushInitialWidth])

    const objectAddedToCanvas = (e) =>{
        const obj = e.target
        obj.selectable = false
        obj.evented = false
    }

    const createCanvas = () =>
    {
        const canvas = new Canvas(canvasRef.current,{
            isDrawingMode:props.drawing
        })
        canvas.preserveObjectStacking = true;
        canvas.backgroundColor = "transparent";
        canvas.renderOnAddRemove = true;
        canvas.selection = false
        canvas.skipTargetFind = false
        canvas.freeDrawingCursor = `url(${cursor}) 16 16, auto`;
        canvas.selection = false;
        canvas.renderOnAddRemove = false;
        canvas.on('object:added',objectAddedToCanvas)

        canvasObj.current = canvas

        resize()
    }

    useEffect(()=>{
       
        createCanvas()
        window.addEventListener("resize",resize)

         return () => {
            canvasObj.current.dispose();
            window.removeEventListener("resize",resize)
        };
    },[])

    useEffect(()=>{
        if(canvasObj.current)
        {
            canvasObj.current.isDrawingMode = props.drawing
        }
        props.movingLocked.current = props.drawing
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
            case 'eraser':
                return new PencilBrush(canvasObj.current)
        }
    }

    useEffect(()=>{
        if(canvasObj.current)
        {
            canvasObj.current.freeDrawingBrush = getBrushType()
            if(props.brush.type === "eraser")
            {
                canvasObj.current.freeDrawingBrush.width = getBrushWidth(180)
                canvasObj.current.freeDrawingBrush.color = `rgb(255,255,255)`
            }
            else
            {
                if(props.brush.type)
                {
                    canvasObj.current.freeDrawingBrush.width = getBrushWidth()
                }
                if(props.brush.color && canvasObj.current.freeDrawingBrush)
                {
                    canvasObj.current.freeDrawingBrush.color = getBrushColor()

                }
            }
           
        }
    },[props.brush])

    return(
        <canvas ref={canvasRef} className={`canvas`}></canvas>
    )
}

export default CanvasElement