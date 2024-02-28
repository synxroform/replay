import React from "react"
import { sin, pi } from "mathjs"

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}


function easeInExpo(x){
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}


export function ChartModule() {
    let [offset, setOffset] = React.useState(0)
    let previous = React.useRef(0)
    let phase = React.useRef(0)
    let frequency = React.useRef(0)

    function scroll(timestamp) {
        let time = timestamp / 1000
        let step = (time - previous.current)
        frequency.current = clamp(frequency.current - 0.005, 0, 1)
        phase.current = phase.current + step * (1 + easeInExpo(frequency.current) * 40)
        setOffset(phase.current)
        previous.current = time
        requestAnimationFrame(scroll)
    }

    React.useEffect(() => {
        const id = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(id);
    }, []);

    let ampX = 70
    let ampY = 20
    let points = []
    for (let n = 0; n < 17; n++) {
        let cx = -ampX + (ampX / 8) * n 
        let cy = sin((pi / 8) * n + offset * 2) * ampY
        points.push(
            <g key={n}>
                <path className="pink glow" d={`M ${cx} ${cy - 10} L ${cx} ${cy + 10}`} strokeWidth="5" style={{opacity: n * 0.1}}/>
            </g>
        )
    }

    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            onClick={() => frequency.current = 1}
        >
            {points}
        </svg>
    )
}