import { useEffect } from 'react'
import styles from './textMenu.module.css'

function ColorMenu(props)
{

    const elementClicked = (color) =>{
        const availableClasses = ['colorBlack','colorWhite','colorRed','colorBlue','colorGreen','colorYellow','colorOrange']
        availableClasses.forEach(x=>{
            props.item.removeClass(x)
        })
        const arr = color.split('')
        const firstItem = arr[0].toUpperCase()
        arr.splice(0,1,firstItem)
        const className =  `color${arr.join('')}`
        props.item.addClass(className)
        props.changeColor(color)
    }

    return (
        <div className={styles.colorContainer}>
            <div className={`${styles.colorItem} ${styles.black} ${props.color === "black"?styles.selected:''}`} onClick={e=>elementClicked("black")}>T</div>
            <div className={`${styles.colorItem} ${styles.white} ${props.color === "white"?styles.selected:''}`} onClick={e=>elementClicked("white")}>T</div>
            <div className={`${styles.colorItem} ${styles.red} ${props.color === "red"?styles.selected:''}`} onClick={e=>elementClicked("red")}>T</div>
            <div className={`${styles.colorItem} ${styles.green} ${props.color === "green"?styles.selected:''}`} onClick={e=>elementClicked("green")}>T</div>
            <div className={`${styles.colorItem} ${styles.blue} ${props.color === "blue"?styles.selected:''}`} onClick={e=>elementClicked("blue")}>T</div>
            <div className={`${styles.colorItem} ${styles.yellow} ${props.color === "yellow"?styles.selected:''}`} onClick={e=>elementClicked("yellow")}>T</div>
            <div className={`${styles.colorItem} ${styles.orange} ${props.color === "orange"?styles.selected:''}`} onClick={e=>elementClicked("orange")}>T</div>
        </div>
    )
}

export default ColorMenu