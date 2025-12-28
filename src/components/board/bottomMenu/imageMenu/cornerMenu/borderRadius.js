import styles from './borderRadius.module.css'

function BorderRadius(props)
{
    return(
        <div className={`${styles.borderRadius} ${styles[props.borderRadius]} borderRadiusComponent`}></div>
    )
}

export default BorderRadius