import Arrow from '../../../../assets/svg/shapes/arrow'
import Circle from '../../../../assets/svg/shapes/circle'
import Decagon from '../../../../assets/svg/shapes/decagon'
import Diamond from '../../../../assets/svg/shapes/diamond'
import Diamond2 from '../../../../assets/svg/shapes/diamond2'
import Diamond3 from '../../../../assets/svg/shapes/diamond3'
import Diamond4 from '../../../../assets/svg/shapes/diamond4'
import Donut from '../../../../assets/svg/shapes/donut'
import Eye from '../../../../assets/svg/shapes/eye'
import Flower1 from '../../../../assets/svg/shapes/flower1'
import Flower2 from '../../../../assets/svg/shapes/flower2'
import Flower3 from '../../../../assets/svg/shapes/flower3'
import Flower4 from '../../../../assets/svg/shapes/flower4'
import HalfTriangle from '../../../../assets/svg/shapes/halfTriangle'
import Hash from '../../../../assets/svg/shapes/hash'
import Heart from '../../../../assets/svg/shapes/heart'
import Hexagon from '../../../../assets/svg/shapes/hexagon'
import Leaf from '../../../../assets/svg/shapes/leaf'
import Moon from '../../../../assets/svg/shapes/moon'
import Octagon from '../../../../assets/svg/shapes/octagon'
import Other1 from '../../../../assets/svg/shapes/other1'
import Other2 from '../../../../assets/svg/shapes/other2'
import Other3 from '../../../../assets/svg/shapes/other3'
import Oval from '../../../../assets/svg/shapes/oval'
import Oval2 from '../../../../assets/svg/shapes/oval2'
import Pentagon from '../../../../assets/svg/shapes/pentagon'
import Plus1 from '../../../../assets/svg/shapes/plus1'
import Plus2 from '../../../../assets/svg/shapes/plus2'
import Plus3 from '../../../../assets/svg/shapes/plus3'
import Rack1 from '../../../../assets/svg/shapes/rack1'
import Rack2 from '../../../../assets/svg/shapes/rack2'
import Rectangle from '../../../../assets/svg/shapes/rectangle'
import SquareIcon from '../../../../assets/svg/shapes/square'
import Square2 from '../../../../assets/svg/shapes/square2'
import SquareDiamond from '../../../../assets/svg/shapes/squareDiamond'
import Star1 from '../../../../assets/svg/shapes/star1'
import Star2 from '../../../../assets/svg/shapes/star2'
import Star3 from '../../../../assets/svg/shapes/star3'
import Star4 from '../../../../assets/svg/shapes/star4'
import Star5 from '../../../../assets/svg/shapes/star5'
import Star6 from '../../../../assets/svg/shapes/star6'
import Triangle from '../../../../assets/svg/shapes/triangle'
import X from '../../../../assets/svg/shapes/x'
import X2 from '../../../../assets/svg/shapes/x2'
import X3 from '../../../../assets/svg/shapes/x3'
import styles from './shapesMenu.module.css'

function ShapesMenu(props)
{
    return(
        <div className={`${styles.container} ${props.display?styles.displayContainer:''}`}>
            <div className={styles.item} onClick={e=>{props.addShape('square')}}>
                <SquareIcon class={styles.svg}/>
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('triangle')}}>
                <Triangle class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('circle')}}>
                <Circle class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('square2')}}>
                <Square2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('rectangle')}}>
                <Rectangle class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('pentagon')}}>
                <Pentagon class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('hexagon')}}>
                <Hexagon class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('octagon')}}>
                <Octagon class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('decagon')}}>
                <Decagon class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('plus1')}}>
                <Plus1 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('plus2')}}>
                <Plus2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('hash')}}>
                <Hash class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('x')}}>
                <X class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('x2')}}>
                <X2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('x3')}}>
                <X3 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('halfTriangle')}}>
                <HalfTriangle class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('heart')}}>
                <Heart class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('donut')}}>
                <Donut class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('leaf')}}>
                <Leaf class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('arrow')}}>
                <Arrow class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('moon')}}>
                <Moon class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('oval')}}>
                <Oval class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('eye')}}>
                <Eye class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('diamond4')}}>
                <Diamond4 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('diamond')}}>
                <Diamond class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('diamond2')}}>
                <Diamond2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('diamond3')}}>
                <Diamond3 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('oval2')}}>
                <Oval2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('plus3')}}>
                <Plus3 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('squareDiamond')}}>
                <SquareDiamond class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('star1')}}>
                <Star1 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('star2')}}>
                <Star2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('star6')}}>
                <Star6 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('star3')}}>
                <Star3 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('star4')}}>
                <Star4 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('star5')}}>
                <Star5 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('flower1')}}>
                <Flower1 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('flower3')}}>
                <Flower3 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('flower4')}}>
                <Flower4 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('flower2')}}>
                <Flower2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('rack1')}}>
                <Rack1 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('rack2')}}>
                <Rack2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('other1')}}>
                <Other1 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('other2')}}>
                <Other2 class={styles.svg} />
            </div>
            <div className={styles.item} onClick={e=>{props.addShape('other3')}}>
                <Other3 class={styles.svg} />
            </div>
        </div>
    )
}

export default ShapesMenu
            
            
            
            