import React from "react";
import CSS from "./css/knob.module.css"
import {sin, cos, pi, atan2} from "mathjs"

const pii = pi * 2

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

/********************************************************/

export function Knob({ startValue, onChanged }) {
    const pMin = 0.1
    const pMax = 0.9
    const cr = 70
    const p0 = {x: -sin(pMin * pii) * cr, y: cos(pMin * pii) * cr}
    const p1 = {x: -sin(pMax * pii) * cr, y: cos(pMax * pii) * cr}
    
    const [theta, setTheta] = React.useState(pMin + startValue * (pMax - pMin));
    let px = {x: -sin(theta * pii) * cr, y: cos(theta * pii) * cr}
    let ang = atan2(p0.y*px.x - p0.x*px.y, p0.x*px.x + p0.y*px.y)

    let lockPoint = React.useRef(null)
    let lockTheta = React.useRef(null)

    function lockPointer(evt) {
        evt.target.setPointerCapture(evt.pointerId)
        lockPoint.current = {x: evt.clientX, y: evt.clientY}
        lockTheta.current = theta
    }

    function releasePointer(evt) {
        evt.target.releasePointerCapture(evt.pointerId)
    }

    function captureMotion(evt) {
        if (evt.target.hasPointerCapture(evt.pointerId)) {
            let delta = {x: evt.clientX - lockPoint.current.x, y: evt.clientY - lockPoint.current.y}
            let newTheta = clamp(lockTheta.current + (delta.y / 300), pMin, pMax)
            setTheta(newTheta)
            if (onChanged) {
                onChanged(((newTheta - pMin) / (pMax - pMin)))
            }
        }
    }

    const arc0 = `M ${p0.x} ${p0.y} A ${cr} ${cr} 0 ${Number(ang > 0)} 1 ${px.x} ${px.y}`
    const arc1 = `M ${p0.x} ${p0.y} A ${cr} ${cr} 0 1 1 ${p1.x} ${p1.y}`
   
    return (
        <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg"
            onPointerDown={lockPointer}
            onPointerMove={captureMotion}
            onPointerUp={releasePointer}
        >
            <path className="brush pink semi" d={arc1} stroke="black" fill="none" />
            <path className="brush pink blur" d={arc0} stroke="black" fill="none" />
            <path className="brush pink" d={arc0} stroke="black" fill="none" strokeWidth="15" />
        </svg>
    );
}

/********************************************************/

export function KnobLabel({ text }) {
    const layer = {
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "0px",
        left: "0px", 
    }

    return (
        <div className={`${CSS.label} techno-text`} style={{position: "relative"}}>
            <div className="blur" style={layer}>{text}</div>
            <div style={layer}>{text}</div>
        </div>
    )
}

/********************************************************/

export function KnobModule() {
    const start = 0.36

    let [knobValue, setKnobValue] = React.useState(start)
    function knobChanged(value) {
        setKnobValue(value)
    }

    return (
        <div className={`${CSS.readout} module x2x1 c2x1`}>
            <Knob onChanged={knobChanged} startValue={start} />
            <KnobLabel text={parseInt(knobValue * 99)}></KnobLabel>
        </div>
    )
}

