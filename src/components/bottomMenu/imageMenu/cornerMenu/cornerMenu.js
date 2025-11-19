import styles from '../imageMenu.module.css'
import BorderRadius from './borderRadius1'

function CornerMenu(props)
{
    return(
        <ul className={styles.cornerMenu}>
            <li className={`${styles.cornerMenuItem} ${props.borderRadius==="borderRadius1"?styles.selected:''}`} onClick={e=>props.cornerItemClicked(1)}><BorderRadius borderRadius={'borderRadius1'}/></li>
            <li className={`${styles.cornerMenuItem} ${props.borderRadius==="borderRadius2"?styles.selected:''}`} onClick={e=>props.cornerItemClicked(2)}><BorderRadius borderRadius={'borderRadius2'}/></li>
            <li className={`${styles.cornerMenuItem} ${props.borderRadius==="borderRadius3"?styles.selected:''}`} onClick={e=>props.cornerItemClicked(3)}><BorderRadius borderRadius={'borderRadius3'}/></li>
            <li className={`${styles.cornerMenuItem} ${props.borderRadius==="borderRadius4"?styles.selected:''}`} onClick={e=>props.cornerItemClicked(4)}><BorderRadius borderRadius={'borderRadius4'}/></li>
        </ul>
    )
}

export default CornerMenu