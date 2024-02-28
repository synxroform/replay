import React from "react"
import { abs, sin } from "mathjs"


const labelStyle = {
    color: `var(--fg)`,
    fontSize: `30px`
}

const moduleStyle = {
    padding: `20px`
}

function MovingString() {
    let [, setUpdate] = React.useState(0),
        offset = React.useRef(0)
    
    function animate() {
        offset.current = (offset.current + 1) % 312
        setUpdate(Date.now())
        requestAnimationFrame(animate)
    }

    React.useEffect(() => {
            const id = requestAnimationFrame(animate)
            return () => cancelAnimationFrame(id)
    }, [])


    return (
        <svg width="100%" height="80">
            <text className="techno-text glow" x={-offset.current} y="30" style={labelStyle} opacity={abs(sin(offset.current / 10))}>
                REACT PORTFOLIO&nbsp;REACT PORTFOLIO&nbsp;REACT PORTFOLIO&nbsp;
            </text>
        </svg>
  )  
}

export function LabelModule() {

    return (
        <div className="module x2x1" style={moduleStyle}>
            <svg width="100%" height="30">
                <text className="counter-text glow" x="0" y="30" style={labelStyle}>ZAIKA DENIS</text>
            </svg>
            <MovingString />
        </div>
    )
}