import NotFoundPNG from '@/assets/pageNotFound.png'

const Notfound = _ => {
    const line = <p><br /></p>
    const lineStyle = {
        textAlign: 'center',
        fontSize: '16px',
        lineHeight: '30px',
        color: '#333333'
    }
    return (
        <div>
            {line}{line}{line}{line}{line}
            <p style={{ textAlign: 'center' }}>
                <img src={NotFoundPNG} alt="" />
            </p>
            <div style={lineStyle}>404 Not Found</div>
            <div style={lineStyle}>网页不存在</div>
            {line}
        </div >
    )
}
export default Notfound;