import styles from './bottomMenu.module.css'
import AddingImgForm from '../addingImgForm/addingImgForm'
import { useEffect } from 'react'

function BottomMenu(props)
{
    const textClicked = () =>{
        props.clearElementEdit()
        props.addTextItem()
        props.setShowAddingImgForm(false)
    }

    const imgClicked = () =>{
        props.clearElementEdit()
        props.setShowAddingImgForm(true)
    }

    useEffect(()=>{
         props.setShowAddingImgForm(false)
    },[props.display])

    return(
        <div className={`${styles.menu} ${props.display?styles.display:''}`}>

            <AddingImgForm display={props.showAddingImgForm} setShowAddingImgForm={props.setShowAddingImgForm} addImg={props.addImg}/>

            <div className={styles.item} onClick={textClicked}>
                Text
            </div>
            <div className={styles.item} onClick={imgClicked}>
                Foto
            </div>
        </div>
    )
}

export default BottomMenu