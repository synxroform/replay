import React from "react"
import { norm, subtract, add, divide, multiply, deepEqual } from "mathjs"

export function CrossModule() {
    let [time, setTime] = React.useState(0)
    let [position, setPosition] = React.useState([0, 0])
    let origin = React.useRef([0, 0])
    let target = React.useRef([0, 0])
    let buffer = React.useRef([])

    function captureTarget(evt) {
        if (evt.buttons == 1) {
            let rect = evt.target.closest("svg").getBoundingClientRect()
            target.current = [
                ((evt.clientX - rect.x) / rect.width) * 200 - 100,
                ((evt.clientY - rect.y) / rect.height) * 100 - 50
            ]
            buffer.current = buffer.current ?? []
        }
    }

    function animate(timestamp) {
        let time = timestamp / 1000
        let diff = subtract(target.current, origin.current)
        if (norm(diff) > 1) {
            let step = multiply(diff, 0.2)
            origin.current = add(origin.current, step)
            setPosition(origin.current) 
        } else {
            origin.current = target.current
        }

        if (buffer.current) {
            let bc = buffer.current
            if (bc.length < 32 && !deepEqual(bc.length ? bc[bc.length - 1].point : [Infinity, Infinity], origin.current)) {
                buffer.current.push({
                    point: origin.current,
                    age: 1
                })
            }
            buffer.current = bc
                .map((item) => Object.assign({}, item, {age: item.age - 0.05}))
                .filter((item) => item.age > 0)
    
            if (buffer.current.length) {
                setTime(time)
            } else {
                buffer.current = null
            }
        } 
        requestAnimationFrame(animate)
    }

    React.useEffect(() => {
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, [])

    let trace = []
    for (let n = 1; n < buffer.current.length; n++) {
        let prev = buffer.current[n - 1]
        let item = buffer.current[n]
        trace.push(<path className="pink" key={n} d={`M ${prev.point[0]} ${prev.point[1]} L ${item.point[0]} ${item.point[1]}`} strokeWidth={item.age * 5} strokeLinecap="round" />)
    }

    let thickness = 10;
    let rx = position[0] - (thickness / 2)
    let ry = position[1] - (thickness / 2)
    return (
        <svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            onPointerMove={captureTarget}
            onPointerDown={captureTarget}
        >
            <g className="blur-2px">{trace}</g>
            {trace}
            <path className="pink semi" d={`M ${position[0]} 50 L ${position[0]} -50`} strokeWidth={thickness}/>
            <path className="pink semi" d={`M 100 ${position[1]} L -100 ${position[1]}`} strokeWidth={thickness}></path>
            <rect className="pink blur-4px" x={rx} y={ry} width={thickness} height={thickness}></rect>
            <rect className="pink" x={rx} y={ry} width={thickness} height={thickness}></rect>
        </svg>
    )
}