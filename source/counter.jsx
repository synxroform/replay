import React from "react"
import { abs, sign } from "mathjs"


function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}


function scaleFactor(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2
}


export function CounterModule() {
    const m = 65

    let [, setUpdate] = React.useState()

    let offset = React.useRef(0),
        count  = React.useRef(6),
        queue  = React.useRef(0),
        time   = React.useRef(0)

    function animate(timestamp) {
        if (abs(queue.current) > 0) {
            let delta = timestamp - time.current,
                step  = queue.current / abs(queue.current)

            offset.current = clamp(offset.current - delta / 4 * step, -m, m)
            time.current   = timestamp

        if (abs(offset.current) != m) {
            requestAnimationFrame(animate)
        } else {
            offset.current = 0
            count.current += step
            queue.current -= step

            if (abs(queue.current) > 0) {
                requestAnimationFrame(animate)
            }
        }
        setUpdate(Date.now())
        }
    }

    function changeCurrent(evt) {
        let rect = evt.target.closest("svg").getBoundingClientRect() ,
            step = (evt.clientX - rect.x) / rect.width > 0.5 ? 1 : -1,
            next = count.current + step + queue.current

        if (next <= 99 && next >= 0) {
            if (abs(sign(step) + sign(queue.current)) == 0) {
                queue.current = step
            } else {
                queue.current += step
            }
            if (abs(queue.current) == 1) {
                time.current = document.timeline.currentTime
                requestAnimationFrame(animate)
            }
        }
    }

    let numbers = []
    for (let n = -2; n < 3; n++) {
        let x = m * n + offset.current,
            f = scaleFactor(clamp(abs(x / 80), 0, 1)), 
            s = 2 - f
            d = count.current + n
            t = d >= 0 && d < 100 ? d.toString().padStart(2, '0') : ""
        numbers.push(<g key={n} transform-origin={`${x} 0`} transform={`scale(${s * 1.2} ${s * 1.2})`} opacity={clamp(1 - f, 0.2, 2)}>
                <text className="counter-text font-size-mm8" x={x - 10} y="6" transform={`scale(1 -1) translate(0 -13)`} opacity="0.2" style={{fill: "url(#counter-grad)"}}>{t}</text>
                <text className="counter-text font-size-mm8 glow" x={x - 10} y="6" >{t}</text>
        </g>)
    }

    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg"
            onPointerDown={changeCurrent}
        >
            <defs>
                <linearGradient id="counter-grad" gradientTransform="rotate(90)" gradientUnits="objectBoundingBox">
                    <stop offset="0.5" stopColor="#F07" stopOpacity="0"/>
                    <stop offset="1" stopColor="#F07" stopOpacity="1"/>
                </linearGradient>
            </defs>
            {numbers}
        </svg>
    )
}