import React from "react"

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

function remap(val, min, max) {
    return min + val * (max - min)
}

function inRange(val, min, max) {
    return val >= min && val <= max
}

export function Range({initLeft, initRight, width, onChanged}) {
    let lockPoint         = React.useRef(null)
    let [left, setLeft]   = React.useState(initLeft)
    let [right, setRight] = React.useState(initRight)

    const wd  = width || 90;
    const wdd = wd * 2 
    const gap = 0.2

    function lockPointer(evt) {
        evt.target.setPointerCapture(evt.pointerId)
        lockPoint.current = {x: evt.clientX, y: evt.clientY}
    }

    function releasePointer(evt) {
        evt.target.releasePointerCapture(evt.pointerId)
    }
    
    function captureLeft(evt) {
        if (evt.target.hasPointerCapture(evt.pointerId)) {
            let delta   = {x: evt.clientX - lockPoint.current.x, y: evt.clientY - lockPoint.current.y}
            let factor  = delta.x / (300 * 0.01 * wd)
            let newLeft = clamp(left + factor, 0, right - gap)
            
            setLeft(newLeft)
            if (right - newLeft <= gap + 0.0001) {
                setRight(clamp(newLeft + gap + factor, 0, 1))
            }
            lockPoint.current = {x: evt.clientX, y: evt.clientY}
        }
    }

    function captureRight(evt) {
        if (evt.target.hasPointerCapture(evt.pointerId)) {
            let delta    = {x: evt.clientX - lockPoint.current.x, y: evt.clientY - lockPoint.current.y}
            let factor   = delta.x / (300 * 0.01 * wd)
            let newRight = clamp(right + factor, left + gap, 1)
            
            setRight(newRight)
            if (newRight - left <= gap + 0.0001) {
                setLeft(clamp((newRight - gap) + factor, 0, right))
            }
            lockPoint.current = {x: evt.clientX, y: evt.clientY}
        }
    }

    React.useEffect(() => {
        onChanged({left: left, right: right})
    }, [left, right])

    function captureBoth(evt) {
        if (evt.target.hasPointerCapture(evt.pointerId)) {
            let delta    = {x: evt.clientX - lockPoint.current.x, y: evt.clientY - lockPoint.current.y}
            let factor   = delta.x / (300 * 0.01 * wd)
            let newRight = clamp(right + factor, -1, 2)
            let newLeft  = clamp(left + factor, -1, 2)
            
            if (newLeft >= 0 && newRight <= 1) {
                setLeft(newLeft)
                setRight(newRight)
            }
            lockPoint.current = {x: evt.clientX, y: evt.clientY}
        }
    }

    let ptL = -wd + left * wdd
    let ptR = -wd + right * wdd 

    return(
        <svg className="module x2x1" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            onPointerDown={lockPointer}
            onPointerUp={releasePointer}
        >
            <path className="brush pink semi" d={`M -${wd} 0 L ${wd} 0`} />
            <g className="blur">
                <path className="brush pink" d={`M ${ptL} 0 L ${ptR} 0`} />
                <rect className="pink" x={ptL} y="-30" width="8" height="60"></rect>
                <rect className="pink" x={ptR - 8} y="-30" width="8" height="60"></rect>
            </g>
            <path className="brush pink" d={`M ${ptL} 0 L ${ptR} 0`}
                onPointerMove={captureBoth}
            />
            <rect className="pink" x={ptL} y="-30" width="8" height="60" 
                onPointerMove={captureLeft}
            ></rect>
            <rect className="pink" x={ptR - 8} y="-30" width="8" height="60" 
                onPointerMove={captureRight}
            ></rect>
        </svg>        
    )    
}

/********************************************************/

export function RangeReadout({left, right, width, count}) {
    width  = width || 90
    count  = count || 20
    
    let w2 = width * 2
    let dx = w2 / count
    let ticks  = {on: [], off: []}
    for (let n = 0; n < count; n++) {
        let pos    = (-width + (dx / 2)) + n * dx
        let isOn   = inRange(pos, remap(left, -width, width), remap(right, -width, width))
        let type   = isOn ? "pink" : "pink semi"
        let target = isOn ? ticks.on : ticks.off
        target.push(
            <path className={type} strokeWidth={dx / 2} d={`M ${pos} -30 L ${pos} 30`} key={n}></path>
        )
    }

    return (
        <svg className="module x2x1" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <g className="blur">{ticks.on}</g>
            {ticks.on}
            {ticks.off}
        </svg>
    )
}

/********************************************************/

export function RangeModule() {
    const initLeft = 0.2
    const initRight = 0.8
    let [left, setLeft]   = React.useState(initLeft)
    let [right, setRight] = React.useState(initRight)

    function rangeChanged(range) {
        setLeft(range.left)
        setRight(range.right)
    }

    return(
        <>
            <Range onChanged={rangeChanged} initLeft={initLeft} initRight={initRight}/>
            <RangeReadout left={left} right={right}/>
        </>
    )
}