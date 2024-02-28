import React from "react"
import { pi, cos, sin, multiply, subtract } from "mathjs"


const points = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
    [0, 0, 0],
    [0, 0, 1],
    [1, 0, 0],
]

const edges = [
    [0, 2],
    [2, 1],
    [1, 3],
    [3, 0],
    
    [4, 6],
    [6, 5],
    [5, 7],
    [7, 4],

    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

function rotateX(a) {
    return [
        [1, 0, 0],
        [0, cos(a), -sin(a)],
        [0, sin(a), cos(a)]
    ]
}

function rotateY(a) {
    return [
        [cos(a), 0, sin(a)],
        [0, 1, 0],
        [-sin(a), 0, cos(a)]
    ]
}

function rotateZ(a) {
    return [
        [cos(a), -sin(a), 0],
        [sin(a), cos(a), 0],
        [0, 0, 1]
    ]
}

export function CubeModule() {
    let [rx, setRx] = React.useState(0.4)
    let [rz, setRz] = React.useState(0.4)

    let rMatrix = multiply(rotateX(rx), rotateY(0), rotateZ(rz))

    let cube = []
    for (let pt of points) {
        cube.push(multiply(multiply(subtract(pt, 0.5), 90), rMatrix))
    }

    let frame = []
    for (let [n, edge] of Object.entries(edges)) {
        let pt0 = cube[edge[0]]
        let pt1 = cube[edge[1]]
        frame.push(<path className="pink" d={`M ${pt0[0]} ${pt0[2]} L ${pt1[0]} ${pt1[2]}`} strokeWidth="10" key={n} strokeLinecap="round"></path>)
    }

    let lockPoint = React.useRef(null)
    function lockPointer(evt) {
        evt.target.setPointerCapture(evt.pointerId)
        lockPoint.current = {x: evt.clientX, y: evt.clientY}
    }

    function releasePointer(evt) {
        evt.target.releasePointerCapture(evt.pointerId)
    }

    function captureMotion(evt) {
        if (evt.target.hasPointerCapture(evt.pointerId)) {
            let delta = {x: evt.clientX - lockPoint.current.x, y: evt.clientY - lockPoint.current.y}
            setRx(rx - (delta.y / 100))
            setRz(rz + (delta.x / 100))
            lockPoint.current = {x: evt.clientX, y: evt.clientY}
        }
    }

    return (
        <svg className="module x2x1" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" 
            onPointerDown={lockPointer}
            onPointerUp={releasePointer}
            onPointerMove={captureMotion}
        >
            <g className="blur">{frame}</g>
            {frame}
        </svg>
    )
}