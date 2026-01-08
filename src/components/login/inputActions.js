import styles from './login-register.module.css'

export const divClicked = (e) =>{
        const input = e.target.closest(`.${styles.inputContainer}`).children[0]
        input.focus()
}



export const inputFocused = (e) =>{
        const div = e.target.closest(`.${styles.inputContainer}`)
        div.classList.add(styles.containerFocused)
        div.children[0].classList.add(styles.inputFocused)
        div.children[1].classList.add(styles.placeholderFocused)
        div.children[1].classList.add(styles.placeholderColorWhileFocused)
}



export const inputBlur = (e) =>{
        const div = e.target.closest(`.${styles.inputContainer}`)
        div.classList.remove(styles.containerFocused)
        div.children[0].classList.remove(styles.inputFocused)
        div.children[1].classList.remove(styles.placeholderColorWhileFocused)
        if(e.target.value.trim() === "")
        {
            div.children[1].classList.remove(styles.placeholderFocused)
        }

}