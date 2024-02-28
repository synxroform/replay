import React from "react"
import { norm, subtract } from "mathjs"


function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3)
}

function easeInCubic(x) {
    return x * x * x
}

export function SpectrumModule() {

    let capture = React.useRef(null)
    let [gamma, setGamma] = React.useState(1)

    function lockPointer(evt) {
        evt.target.closest("svg").setPointerCapture(evt.pointerId)
        capture.current = evt.clientX
    }

    function releasePointer(evt) {
        evt.target.closest("svg").releasePointerCapture(evt.pointerId)
    }

    function captureMotion(evt) {
        if (evt.buttons == 1) {
            let rect = evt.target.closest("svg").getBoundingClientRect()
            setGamma(clamp(gamma + (capture.current - evt.clientX) / rect.width * 4, 0, 1))
            capture.current = evt.clientX
        }
    }
    
    let amp = 80
    let stripes = []
    for (let n = 0; n <= 1; n += 0.025) {
        let x0 = -amp + easeOutCubic(n) * amp * 2
        let x1 = -amp + easeInCubic(n) * amp * 2
        let x = x1 * gamma + x0 * (1 - gamma)
        let w = n * (1 - gamma) + (1 - n) * gamma
        stripes.push(<path className="pink" d={`M ${x} -30 L ${x} 30`} strokeWidth="2" style={{opacity: w}} key={n}/>)
    }

    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg"
            onPointerDown={lockPointer}
            onPointerUp={releasePointer}
            onPointerMove={captureMotion}
        >
            {stripes}
        </svg>
    )
}