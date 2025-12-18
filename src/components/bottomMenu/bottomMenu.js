import styles from './bottomMenu.module.css'
import AddingImgForm from '../addingImgForm/addingImgForm'
import { useContext, useEffect, useState } from 'react'
import ClearElementEditContext from '../../context/clearEdit'
import ZoomInIcon from '../../assets/svg/zoomInIcon'
import ZoomOutIcon from '../../assets/svg/zoomOutIcon'

function BottomMenu(props)
{
    const clearElementEdit = useContext(ClearElementEditContext)

    const textClicked = () =>{
        clearElementEdit()
        props.addTextItem()
        props.setShowAddingImgForm(false)
    }

    const imgClicked = () =>{

        clearElementEdit()
        props.setShowAddingImgForm(true)
    }

    useEffect(()=>{
        props.setShowAddingImgForm(false)
    },[props.display])

    const brushClicked = () =>{
        clearElementEdit()
        props.setShowAddingImgForm(false)
        props.brushClicked()
    }

    return(
        <div className={`${styles.menu} ${props.display?styles.display:''}`}>

            <AddingImgForm display={props.showAddingImgForm} setShowAddingImgForm={props.setShowAddingImgForm} addImg={props.addImg}/>

            <div className={styles.item} onClick={textClicked}>
                Text
            </div>
            <div className={styles.item} onClick={imgClicked}>
                Foto
            </div>

            <div className={styles.item} onClick={brushClicked}>
                Pędzel
            </div>
            <div className={styles.item} onClick={e=>props.zoomBtn(-100)}>
                <ZoomInIcon class={styles.zoomIcon}/>
            </div>
            <div className={styles.item} onClick={e=>props.zoomBtn(100)}>
                <ZoomOutIcon class={styles.zoomIcon} />
            </div>
        </div>
    )
}

export default BottomMenu