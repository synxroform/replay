import React from "react"


function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

export function GooeyModule() {    
    let [spread, setSpread] = React.useState(10),
        capture = React.useRef(null) 
        origin  = React.useRef(0)

    function lockPointer(evt) {
        evt.target.setPointerCapture(evt.pointerId)
        origin.current = evt.clientY
        capture.current = spread
    }

    function releasePointer(evt) {
        evt.target.releasePointerCapture(evt.pointerId)
    }

    function captureMotion(evt) {
        if (evt.buttons == 1) {
            setSpread(clamp(capture.current + (evt.clientY - origin.current) / 2, -20, 20))
        }
    }

    let circles = []
        particles = []
    for (let n = 0; n < 5; n++) {
        let x = -60 + 120 * (n / 4),
            s = spread 
        circles.push(<circle className="pink" cx={x} cy={n % 2 ? -s : s} r="15" key={n}/>)
        particles.push(<circle className="pink glow" cx={x} cy={n % 2 ? -s : s} r="5" key={n}/>)
    }

    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg"
            onPointerDown={lockPointer}
            onPointerUp={releasePointer}
            onPointerMove={captureMotion}
        >
            <defs>
                <filter id="goo" x="-20%" y="-30%" width="150%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -2.5" result="goo" />
                    <feColorMatrix in="goo" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -2.5" result="goo2" />
                    <feMorphology operator="erode" radius="1" out="erode"/>
                    <feComposite in="erode" in2="goo2" operator="arithmetic" k1="0" k2="-1" k3="1" k4="0" result="contour" />
                    <feGaussianBlur in="contour" stdDeviation="3" result="contour-blur" />
                    <feComposite in="contour-blur" in2="contour" operator="over"/>
                </filter>
            </defs>
            <g filter="url(#goo)">
                {circles}
            </g>
            {particles}
        </svg>
    )
}