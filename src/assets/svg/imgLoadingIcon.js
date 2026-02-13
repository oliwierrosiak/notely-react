function ImgLoadingIcon(props)
{
    return(
<svg className={props.class?props.class:''} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="60%" height="60%" style={{"shapeRendering":"auto","display":"block","background":"transparent"}}><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" stroke="#6a6a6a" fill="none" cy="50" cx="50">
  <animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"/>
</circle><g/></g></svg>
    )
}

export default ImgLoadingIcon