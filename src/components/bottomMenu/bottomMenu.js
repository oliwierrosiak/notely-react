import styles from './bottomMenu.module.css'
import AddingImgForm from '../addingImgForm/addingImgForm'
import { useContext, useEffect, useState } from 'react'
import ImgErrorIcon from '../../assets/svg/imgErrorIcon'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'
import ClearElementEditContext from '../../context/clearEdit'

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
        </div>
    )
}

export default BottomMenu