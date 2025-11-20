import styles from './bottomMenu.module.css'
import AddingImgForm from '../addingImgForm/addingImgForm'
import { useEffect, useState } from 'react'
import ImgErrorIcon from '../../assets/svg/imgErrorIcon'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'

function BottomMenu(props)
{

    const [imageAddingLoading,setImageAddingLoading] = useState(false)
    const [imageAddingError,setImageAddingError] = useState(false)


    const textClicked = () =>{
        props.clearElementEdit()
        props.addTextItem()
        props.setShowAddingImgForm(false)
    }

    const imgClicked = () =>{
        if(!imageAddingLoading && !imageAddingError)
        {
            props.clearElementEdit()
            props.setShowAddingImgForm(true)
        }
    }

    useEffect(()=>{
         props.setShowAddingImgForm(false)
    },[props.display])

    useEffect(()=>{
        if(imageAddingError)
        {
            setTimeout(() => {
                setImageAddingError(false)
            }, 3000);
        }
    },[imageAddingError])

    const brushClicked = () =>{
        props.clearElementEdit()
        props.setShowAddingImgForm(false)
        props.brushClicked()
    }

    return(
        <div className={`${styles.menu} ${props.display?styles.display:''}`}>

            <AddingImgForm display={props.showAddingImgForm} setImageAddingError={setImageAddingError} setImageAddingLoading={setImageAddingLoading} setShowAddingImgForm={props.setShowAddingImgForm} addImg={props.addImg}/>

            <div className={styles.item} onClick={textClicked}>
                Text
            </div>
            <div className={styles.item} onClick={imgClicked}>
                {imageAddingLoading?
                <ImgLoadingIcon />
                :(
                    <>
                    Foto
                    <div className={`${styles.errorContainer} ${imageAddingError?styles.errorContainerDisplay:''}`}>
                    <ImgErrorIcon class={styles.errorSVG}/>

                    </div>
                    </>
                )}
            </div>

            <div className={styles.item} onClick={brushClicked}>
                Pędzel
            </div>
        </div>
    )
}

export default BottomMenu