import React from "react"
import { sqrt } from "mathjs"

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

export function ScissorsModule() {
    let [limit, setLimit] = React.useState(80)
    let origin = React.useRef(null)
    let capture = React.useRef(null)

    function lockPointer(evt) {
        evt.target.setPointerCapture(evt.pointerId)
        capture.current = evt.clientX
        origin.current = limit
    }

    function releasePointer(evt) {
        evt.target.releasePointerCapture(evt.pointerId)
    }

    function captureMotion(evt) {
        if (evt.buttons == 1) {
            let box = evt.target.closest("svg").getBoundingClientRect() 
            setLimit(clamp(origin.current - (capture.current - evt.clientX) * (200 / box.width), 0, 80))
        }
    }

    let w = (limit - -80) / 4,
        d = 60,
        k = sqrt(d*d - w*w)
    let segments = []
    for (let n = 0; n < 4; n++) {
        let x = -80 + w * n,
            s = [-1, 1][n % 2]
            y = k/2 * s
        if (!segments.length) {
            segments.push([x, y])
        }
        segments.push([x+w, y+(k * -s)])
    }

    let points = segments.map((seg, n) => n ? `L ${seg[0]} ${seg[1]}` : `M ${seg[0]} ${seg[1]}` ).join(" ")
    let link = <>
        <path className="pink glow" strokeWidth="4" d={points} strokeLinejoin="round"/>
    </>

    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg"
            onPointerDown={lockPointer}
            onPointerUp={releasePointer}
            onPointerMove={captureMotion}
        >
            <defs>
                <linearGradient id="mirror-gradient">
                    <stop stopColor="#FF0077" />
                    <stop offset="0.3" stopColor="#1F0051" stopOpacity="0"/>
                    <stop offset="0.7" stopColor="#200051" stopOpacity="0"/>
                    <stop offset="1" stopColor="#FF0077" />
                </linearGradient>
            </defs>
            <path className="pink" strokeWidth="6" d="M -80 -35 L -80 35" />
            <path className="pink" strokeWidth="6" d={`M ${limit} -35 L ${limit} 35`} />
            {link}
            <g transform="scale(1 -1)">
                {link}
            </g>
            <rect x="-80" y="-35" width={w * 4} height="70" fill="url(#mirror-gradient)" opacity="0.5"/>
        </svg>
    )
}