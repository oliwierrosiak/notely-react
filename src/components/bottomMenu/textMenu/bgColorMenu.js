import transparentImg from '../../../assets/img/transparent.png'
import styles from './textMenu.module.css'

function BgColorMenu(props)
{

    const borderClassNameSetter = (color) =>{
        const array = color.split('')
        array.splice(0,1,array[0].toUpperCase())
        const str = array.join('')
        return str
    }

    const shapesClassNameSetter = (color) =>{
        const value = color.split('bg')[1]
        return `fill${value}`
    }

    const colorClicked = (color) =>{
        if(props.brush)
        {
            return props.changeBgColor({color})
        }

        const classes = props.item.class
        const filtered = classes.filter(x => x.includes('bg') || x.includes('borderBg') || x.includes('fill'))
        filtered.forEach(x => {
            props.item.removeClass(x)
        });
        borderClassNameSetter(color)
        const currentColor = props.border?`border${borderClassNameSetter(color)}`:props.shapes?shapesClassNameSetter(color):color
        props.item.addClass(currentColor)
        props.changeBgColor(currentColor)
    }

    return(
        <div className={styles.bgColorContainer}>
            <div className={`${styles.bgColorMenuItem} bgRed6 ${props.color === "bgRed6"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgRed6')}></div>
            <div className={`${styles.bgColorMenuItem} bgRed5 ${props.color === "bgRed5"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgRed5')}></div>
            <div className={`${styles.bgColorMenuItem} bgRed4 ${props.color === "bgRed4"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgRed4')}></div>
            <div className={`${styles.bgColorMenuItem} bgRed3 ${props.color === "bgRed3"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgRed3')}></div>
            <div className={`${styles.bgColorMenuItem} bgRed2 ${props.color === "bgRed2"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgRed2')}></div>
            <div className={`${styles.bgColorMenuItem} bgRed1 ${props.color === "bgRed1"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgRed1')}></div>
            <div className={`${styles.bgColorMenuItem} bgOrange6 ${props.color === "bgOrange6"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgOrange6')}></div>
            <div className={`${styles.bgColorMenuItem} bgOrange5 ${props.color === "bgOrange5"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgOrange5')}></div>
            <div className={`${styles.bgColorMenuItem} bgOrange4 ${props.color === "bgOrange4"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgOrange4')}></div>
            <div className={`${styles.bgColorMenuItem} bgOrange3 ${props.color === "bgOrange3"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgOrange3')}></div>
            <div className={`${styles.bgColorMenuItem} bgOrange2 ${props.color === "bgOrange2"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgOrange2')}></div>
            <div className={`${styles.bgColorMenuItem} bgOrange1 ${props.color === "bgOrange1"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgOrange1')}></div>
            <div className={`${styles.bgColorMenuItem} bgYellow6 ${props.color === "bgYellow6"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgYellow6')}></div>
            <div className={`${styles.bgColorMenuItem} bgYellow5 ${props.color === "bgYellow5"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgYellow5')}></div>
            <div className={`${styles.bgColorMenuItem} bgYellow4 ${props.color === "bgYellow4"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgYellow4')}></div>
            <div className={`${styles.bgColorMenuItem} bgYellow3 ${props.color === "bgYellow3"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgYellow3')}></div>
            <div className={`${styles.bgColorMenuItem} bgYellow2 ${props.color === "bgYellow2"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgYellow2')}></div>
            <div className={`${styles.bgColorMenuItem} bgYellow1 ${props.color === "bgYellow1"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgYellow1')}></div>
            <div className={`${styles.bgColorMenuItem} bgGreen6
            ${props.color === "bgGreen6"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgGreen6')}></div>
            <div className={`${styles.bgColorMenuItem} bgGreen5 ${props.color === "bgGreen5"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgGreen5')}></div>
            <div className={`${styles.bgColorMenuItem} bgGreen4 ${props.color === "bgGreen4"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgGreen4')}></div>
            <div className={`${styles.bgColorMenuItem} bgGreen3 ${props.color === "bgGreen3"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgGreen3')}></div>
            <div className={`${styles.bgColorMenuItem} bgGreen2 ${props.color === "bgGreen2"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgGreen2')}></div>
            <div className={`${styles.bgColorMenuItem} bgGreen1 ${props.color === "bgGreen1"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgGreen1')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlue6 ${props.color === "bgBlue6"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlue6')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlue5 ${props.color === "bgBlue5"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlue5')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlue4 ${props.color === "bgBlue4"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlue4')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlue3 ${props.color === "bgBlue3"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlue3')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlue2 ${props.color === "bgBlue2"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlue2')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlue1 ${props.color === "bgBlue1"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlue1')}></div>
            <div className={`${styles.bgColorMenuItem} bgPink6 ${props.color === "bgPink6"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgPink6')}></div>
            <div className={`${styles.bgColorMenuItem} bgPink5 ${props.color === "bgPink5"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgPink5')}></div>
            <div className={`${styles.bgColorMenuItem} bgPink4 ${props.color === "bgPink4"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgPink4')}></div>
            <div className={`${styles.bgColorMenuItem} bgPink3 ${props.color === "bgPink3"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgPink3')}></div>
            <div className={`${styles.bgColorMenuItem} bgPink2 ${props.color === "bgPink2"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgPink2')}></div>
            <div className={`${styles.bgColorMenuItem} bgPink1 ${props.color === "bgPink1"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgPink1')}></div>
            {!props.withoutTransparent &&
            <div className={`${styles.bgColorMenuItem} bgBlack6 ${props.color === "bgBlack6"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlack6')}>
                <img src={transparentImg} className={styles.transparentImg}/>
            </div>}
            <div className={`${styles.bgColorMenuItem} bgBlack5 ${props.color === "bgBlack5"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlack5')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlack4 ${props.color === "bgBlack4"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlack4')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlack3 ${props.color === "bgBlack3"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlack3')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlack2 ${props.color === "bgBlack2"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlack2')}></div>
            <div className={`${styles.bgColorMenuItem} bgBlack1 ${props.color === "bgBlack1"?styles.selectedBgColorItem:''}`} onClick={e=>colorClicked('bgBlack1')}></div>
        
        </div>
    )
}

export default BgColorMenu