import { useEffect, useRef, useContext } from 'react'
import styles from './shapeElement.module.css'
import ClearElementEditContext from '../../context/clearEdit'
import SquareIcon from '../../assets/svg/shapes/square'
import Square2 from '../../assets/svg/shapes/square2'
import Circle from '../../assets/svg/shapes/circle'
import Triangle from '../../assets/svg/shapes/triangle'
import Rectangle from '../../assets/svg/shapes/rectangle'
import Decagon from '../../assets/svg/shapes/decagon'
import Pentagon from '../../assets/svg/shapes/pentagon'
import Hexagon from '../../assets/svg/shapes/hexagon'
import Octagon from '../../assets/svg/shapes/octagon'
import Heart from '../../assets/svg/shapes/heart'
import Plus1 from '../../assets/svg/shapes/plus1'
import Plus2 from '../../assets/svg/shapes/plus2'
import X from '../../assets/svg/shapes/x'
import HalfTriangle from '../../assets/svg/shapes/halfTriangle'
import Diamond from '../../assets/svg/shapes/diamond'
import Oval from '../../assets/svg/shapes/oval'
import Eye from '../../assets/svg/shapes/eye'
import Oval2 from '../../assets/svg/shapes/oval2'
import Leaf from '../../assets/svg/shapes/leaf'
import SquareDiamond from '../../assets/svg/shapes/squareDiamond'
import Plus3 from '../../assets/svg/shapes/plus3'
import Hash from '../../assets/svg/shapes/hash'
import X2 from '../../assets/svg/shapes/x2'
import X3 from '../../assets/svg/shapes/x3'
import Arrow from '../../assets/svg/shapes/arrow'
import Diamond2 from '../../assets/svg/shapes/diamond2'
import Diamond3 from '../../assets/svg/shapes/diamond3'
import Diamond4 from '../../assets/svg/shapes/diamond4'
import Star1 from '../../assets/svg/shapes/star1'
import Star2 from '../../assets/svg/shapes/star2'
import Star3 from '../../assets/svg/shapes/star3'
import Star4 from '../../assets/svg/shapes/star4'
import Star5 from '../../assets/svg/shapes/star5'
import Star6 from '../../assets/svg/shapes/star6'
import Flower1 from '../../assets/svg/shapes/flower1'
import Donut from '../../assets/svg/shapes/donut'
import Moon from '../../assets/svg/shapes/moon'
import Flower2 from '../../assets/svg/shapes/flower2'
import Flower3 from '../../assets/svg/shapes/flower3'
import Flower4 from '../../assets/svg/shapes/flower4'
import Rack1 from '../../assets/svg/shapes/rack1'
import Rack2 from '../../assets/svg/shapes/rack2'
import Other1 from '../../assets/svg/shapes/other1'
import Other2 from '../../assets/svg/shapes/other2'
import Other3 from '../../assets/svg/shapes/other3'

function ShapeElement(props)
{

    const clearEdit = useContext(ClearElementEditContext)

    const containerRef = useRef()

    const changePosition = (e)=>{
        props.movingLocked.current = true
        props.item.changePosition(e,props.board,props.movingLocked,containerRef.current)
    } 

    const setSolidPosition = (e) =>{
        props.item.setSolidPosition(props.board,props.movingLocked)
    }

    const checkEditMode = (e) =>{
        const div = e.closest('.element')
        props.item.checkEditMode(div,clearEdit,props.setEdit,props.item)
    }

    const resizeElement = () =>{
        props.item.resizeElement(props.board,containerRef.current,props.movingLocked)
    }

    useEffect(()=>{
        if(!props.item.left && !props.item.top)
        {
            props.item.setPositionRelativeToScreen()
            const {left,top} = props.item.getStyles()
            containerRef.current.style.left = left
            containerRef.current.style.top = top
        }
        else
        {
            clearEdit()
        }
    },[])

    return(
        <div className={`element editOn ${styles.element}`} style={props.item.getStyles()} onMouseDown={e=>changePosition(e.target.closest('div'))} onMouseUp={setSolidPosition} onClick={e=>checkEditMode(e.target)} ref={containerRef}>

            {props.item.item === "square" && <SquareIcon class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "square2" && <Square2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "circle" && <Circle class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "triangle" && <Triangle class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "rectangle" && <Rectangle class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "decagon" && <Decagon class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "pentagon" && <Pentagon class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "hexagon" && <Hexagon class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "octagon" && <Octagon class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "heart" && <Heart class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "plus1" && <Plus1 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "plus2" && <Plus2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "x" && <X class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "halfTriangle" && <HalfTriangle class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "diamond" && <Diamond class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "oval" && <Oval class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "eye" && <Eye class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "oval2" && <Oval2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "leaf" && <Leaf class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "squareDiamond" && <SquareDiamond class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "plus3" && <Plus3 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "hash" && <Hash class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "x2" && <X2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "x3" && <X3 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "arrow" && <Arrow class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "diamond2" && <Diamond2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "diamond3" && <Diamond3 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "diamond4" && <Diamond4 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "star1" && <Star1 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "star2" && <Star2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "star3" && <Star3 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "star4" && <Star4 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "star5" && <Star5 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "star6" && <Star6 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "flower1" && <Flower1 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "donut" && <Donut class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "moon" && <Moon class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "flower2" && <Flower2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "flower3" && <Flower3 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "flower4" && <Flower4 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "rack1" && <Rack1 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "rack2" && <Rack2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "other1" && <Other1 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "other2" && <Other2 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            {props.item.item === "other3" && <Other3 class={`${styles.svg} ${props.item.getClass()}`} style={props.item.getRotate()}/>}
            
            

            <div className={styles.resize} onMouseDown={resizeElement}></div>

        </div>
    )
}

export default ShapeElement