import styles from './borderRadius.module.css'

function BorderRadius(props)
{
    return(
        <div className={`${styles.borderRadius} ${styles[props.borderRadius]} ${props.bgColor?props.bgColor:''} borderRadiusComponent`}></div>
    )
}

export default BorderRadius