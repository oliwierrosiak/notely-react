import { Canvas, CircleBrush, PatternBrush, PencilBrush, SprayBrush, version, Path } from 'fabric'
import { useContext, useEffect, useRef, useState } from 'react'
import brushColors from './brushColors'
import cursor from '../../assets/img/cursor.png'
import EraserBrush from './eraser'
import CanvasHistoryContext from '../../context/canvasHistory'

function CanvasElement(props)
{
    const canvasRef = useRef()
    const canvasObj = useRef()

    const canvasHistory = useContext(CanvasHistoryContext)

    const getBrushWidth = () =>{
        return 0.2*props.brush.width
    }

    const getBrushColor = () =>
    {
        return brushColors[props.brush.color]
    }

    function pointsToPath(points)
    {
        let d = `M ${points[0][0]} ${points[0][1]}`
        for (let i = 1;i < points.length;i++)
        {
            d += ` L ${points[i][0]} ${points[i][1]}`
        }
        return d
    }

    function pathToPoints(path)
    {
        return path.filter(cmd => cmd[0] !== 'M').map(cmd => [cmd[1], cmd[2]])
    }
    

    const objectAddedToCanvas = (e) =>{
        const p = e.target

        const serialized = {
            points: pathToPoints(p.path),
            color: p.stroke,
            width: p.strokeWidth,
            type:p.globalCompositeOperation === 'destination-out'?'eraser':'draw'
        }

        props.item.content.push(serialized)
    }

    const createCanvas = () =>
    {
        const canvas = new Canvas(canvasRef.current,{
            isDrawingMode:props.drawing
        })
        canvas.freeDrawingCursor = `url(${cursor}) 16 16, auto`;
        canvas.backgroundColor = "transparent"

        canvas.setWidth(2500)
        canvas.setHeight(2500)
        canvasObj.current = canvas
        canvas.renderOnAddRemove = false
        canvas.selection = false
        canvas.skipTargetFind = true
        canvas.preserveObjectStacking = true

        props.item.content.forEach(data => {
            const path = new Path(pointsToPath(data.points), {
                stroke: data.color,
                strokeWidth: data.width,
                fill: null,
                selectable: false,
                evented: false
            })

            if (data.type === 'eraser')
            {
                path.globalCompositeOperation = 'destination-out'
            }

            canvas.add(path)
        })

        canvas.on('object:added',objectAddedToCanvas)

        canvas.renderOnAddRemove = true
        canvas.renderAll()
        

        
    }

    useEffect(()=>{
        createCanvas()
        return () => {
            canvasObj.current.dispose();
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
            case 'eraser':
                return new EraserBrush(canvasObj.current)
        }
    }

    useEffect(()=>{
        if(canvasObj.current)
        {
            canvasObj.current.freeDrawingBrush = getBrushType()
            if(props.brush.type === "eraser")
            {
                canvasObj.current.freeDrawingBrush.width = getBrushWidth()
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
            if(canvasObj.current.freeDrawingBrush)
            {
                canvasObj.current.freeDrawingBrush.decimate = 12

            }
        }
    },[props.brush])


    useEffect(()=>{
        if(canvasHistory.undoStack?.objects?.length>-1)
        {
            canvasObj.current.clear();
            canvasObj.current.loadFromJSON(canvasHistory.undoStack)
            canvasObj.current.requestRenderAll();
        }

    },[canvasHistory.update])

    return(
        <canvas ref={canvasRef} className={`canvas`}></canvas>
    )
}

export default CanvasElement