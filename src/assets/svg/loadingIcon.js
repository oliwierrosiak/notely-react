function LoadingIcon(props)
{
    return(
        <svg className={props.class} viewBox="0 0 200 200"><circle fill="#595959ff" stroke="#595959ff" strokeWidth="15" r="15" cx="40" cy="100" style={{"--darkreader-inline-fill": "var(--darkreader-text-880088 #595959ff)", "--darkreader-inline-stroke": "var(--darkreader-text-880088 #595959ff)"}}><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#595959ff" stroke="#595959ff" strokeWidth="15" r="15" cx="100" cy="100" style={{"--darkreader-inline-fill": "var(--darkreader-text-880088 #595959ff)","--darkreader-inline-stroke":"var(--darkreader-text-880088 #595959ff)"}}><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#595959ff" stroke="#595959ff" strokeWidth="15" r="15" cx="160" cy="100" style={{"--darkreader-inline-fill": "var(--darkreader-text-880088 #595959ff)", "--darkreader-inline-stroke": "var(--darkreader-text-880088 #595959ff);"}}><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
    )
}

export default LoadingIcon