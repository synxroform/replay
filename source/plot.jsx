import React from "react"
import Alea from "alea"
import { add, subtract, factorial, floor, mod } from "mathjs"

const prng = new Alea(12345)

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}


function* range(start, stop, count) {
    let step = (stop - start) / (count - 1)
    for (let n = start; n <= stop; n += step) {
        yield n
    }
}


function zero_divide(a, b) {
    if (b != 0) return a / b
    return 0
}


function be_basis(n, i, t) {
    let k1 = factorial(n)
    let k2 = factorial(i) * factorial(n-i)
    return zero_divide(k1, k2) * (t**i) * ((1-t)**(n-i))
}


function bezier(pts, t, basis=be_basis) {
    let pt = new Array(pts[0].length).fill(0)
    for (let n = 0; n < pts.length; n++) {
        pt.forEach((x, k, a) => {a[k] += pts[n][k] * basis(pts.length-1, n, t)})
    }
    return pt
}


function bezierSegmented(seg, t) {
    let idx = floor(t * seg.length)
        frac  = mod(t * seg.length, 1)
    return bezier(seg[idx], frac)
}


function plotBezier(points, blend) {
    let plot = [],
        curve = []
    for (let n = 1; n < points.length; n++) {
        let a = points[n-1],
            b = points[n],
            d = b[0] - a[0]
            c = (n == 1 ? [add(a, [d * blend, 0])] : []).concat([subtract(b, [d * blend, 0]), b])
            
        plot.push((n == 1 ? "C " : "S ") + c.map(pt => pt.join(' ')).join(', '))
        curve.push([a, add(a, [d * blend, 0]), subtract(b, [d * blend, 0]), b])
    }
    return [`M ${points[0][0]} ${points[0][1]} ` + plot.join(' '), curve]
}

export function PlotModule() {
    let [slide, setSlide] = React.useState(0.5),
        capture = React.useRef(null), 
        origin  = React.useRef(0)

    let [plot, curve] = React.useMemo(() => {
        let points = [...range(-100, 100, 10)].map((x, n) => [x, -20 + prng() * 40])
        return plotBezier(points, 0.5)
    }, [])

    function lockPointer(evt) {
        evt.target.setPointerCapture(evt.pointerId)
        origin.current = evt.clientX
        capture.current = slide
    }

    function releasePointer(evt) {
        evt.target.releasePointerCapture(evt.pointerId)
    }

    function captureMotion(evt) {
        if (evt.buttons == 1) {
            let box = evt.target.closest("svg").getBoundingClientRect()
                npt = ((evt.clientX - box.x) - (origin.current - box.x)) / box.width 
            setSlide(clamp(capture.current + npt, 0.05, 0.95))
        }
    }

    let ptx = -100 + slide * 200 
        pty = bezierSegmented(curve, slide)[1]
    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg"
            onPointerDown={lockPointer}
            onPointerUp={releasePointer}
            onPointerMove={captureMotion}
        >
            <defs>
                <mask id="plot-mask" maskUnits="userSpaceOnUse" x="-100" y="-50" width="200" height="100">
                    <path d={plot + ` L 100 50 L -100 50 Z`} fill="white"/>
                </mask>
                <filter id="plot-blur" x="-100" y="-50" width="200" height="100">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                </filter>
            </defs>
        
            <path className="pink" d={plot} strokeWidth="10" filter="url(#plot-blur)" mask="url(#plot-mask)"/>
            <path className="pink" d={plot} strokeWidth="2" />
            <path className="pink" d={`M ${ptx} -50 L ${ptx} 50`} strokeWidth="10" opacity="0.2"/>
            <path className="pink" d={`M ${ptx} -50 L ${ptx} 50`} strokeWidth="1"/>
            <rect className="pink glow" x={ptx - 5} y={pty - 5} width="10" height="10" />
            <text className="counter-text glow" x="-90" y="40" >{(50 - pty).toFixed(4)}</text>
        </svg>
    )    
}