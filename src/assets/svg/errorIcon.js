function ErrorIcon(props)
{
    return(
        <svg className={props.class?props.class:''} width="100%" height="100%" viewBox="0 0 24 24" fill="none">
<path d="M12 8V12" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 16.0195V16" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<circle cx="12" cy="12" r="10" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
    )
}
export default ErrorIcon