import styles from './backgroundTemplateMenu.module.css'
import template1 from '../../../assets/img/preview10.png'
import template2 from '../../../assets/img/preview20.png'
import template3 from '../../../assets/img/preview30.png'
import template4 from '../../../assets/img/preview40.png'
import template5 from '../../../assets/img/preview50.png'
import template6 from '../../../assets/img/preview60.png'
import template7 from '../../../assets/img/preview70.png'
import template8 from '../../../assets/img/preview80.png'


function BackgroundTemplateMenu(props)
{

    return(
        <div className={styles.container}>
            <div className={`${styles.item} ${props.template ==="backgroundTemplate9"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate9')}></div>
            <img src={template1} className={`${styles.item} ${props.template==="backgroundTemplate1"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate1')}/>
            <img src={template2} className={`${styles.item} ${props.template==="backgroundTemplate2"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate2')}/>
            <img src={template3} className={`${styles.item} ${props.template==="backgroundTemplate3"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate3')}/>
            <img src={template4} className={`${styles.item} ${props.template==="backgroundTemplate4"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate4')}/>
            <img src={template5} className={`${styles.item} ${props.template==="backgroundTemplate5"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate5')}/>
            <img src={template6} className={`${styles.item} ${props.template==="backgroundTemplate6"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate6')}/>
            <img src={template7} className={`${styles.item} ${props.template==="backgroundTemplate7"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate7')}/>
            <img src={template8} className={`${styles.item} ${props.template==="backgroundTemplate8"?styles.selected:''}`} onClick={e=>props.setTemplate('backgroundTemplate8')}/>
        </div>
    )
}

export default BackgroundTemplateMenu