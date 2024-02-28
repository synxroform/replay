import React from "react"
import { subtract, norm, atan2, pi } from "mathjs"

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

export function RhombicModule() {
    let capture = React.useRef(null)
    let scale   = React.useRef(1)
    let [update, setUpdate] = React.useState(0)

    function lockPointer(evt) {
        evt.target.setPointerCapture(evt.pointerId)
        let rect = evt.target.closest("svg").getBoundingClientRect()
        let origin = [rect.x + rect.width / 2, rect.y + rect.height / 2]
        capture.current = subtract([evt.clientX, evt.clientY], origin)
    }

    function animate(timestamp) {
        if (scale.current > 1) {
            scale.current = clamp(scale.current * 0.8, 1, 1000)
            setUpdate(Date.now())
            requestAnimationFrame(animate)
        }
    }

    function releasePointer(evt) {
        evt.target.releasePointerCapture(evt.pointerId)
        requestAnimationFrame(animate)
    }

    function captureMotion(evt) {
        if (evt.buttons == 1) {
            let rect = evt.target.closest("svg").getBoundingClientRect()
            let origin = [rect.x + rect.width / 2, rect.y + rect.height / 2]
            let vector = subtract([evt.clientX, evt.clientY], origin)

            scale.current = clamp(norm(vector) / norm(capture.current), 1, 1000)
            setUpdate(Date.now())
        }
    }

    
    let squares = []
    let amp = 50

    for (let s = scale.current, n = 0; s > 0.5; s--, n++) {
        let size = amp * s
        let corner = -(s * (amp / 2))
        squares.push(<rect className="pink-wire glow" strokeWidth="6" x={corner} y={corner} width={size} height={size} key={n}/>)
    }
    

    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg"
                onPointerDown={lockPointer}
                onPointerUp={releasePointer}
                onPointerMove={captureMotion}
        >
            <defs>
                <linearGradient id="grad" gradientTransform="rotate(90)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF0077" stopOpacity="0.66"/>
                    <stop offset="0.2" stopColor="#1F0051" stopOpacity="0"/>
                </linearGradient>
            </defs>
            <rect x="-100" y="0" width="200" height="50" fill="url(#grad)"/>

            <g transform="rotate(45)">
                {squares}
            </g>
        </svg>
    )
}