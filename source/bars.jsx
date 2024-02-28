import React from "react"
import CSS from "./css/bars.module.css"

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

function randomArray(count, min, max) {
    const result = []
    for (let n = 0; n < count; n++) {
      result.push(min + (Math.random() * (max - min)));
    }
    return result
}


function Bars({ values, onChange }) {
    let count  = values.length

    let width = 90
    let amp   = 70
    let w2    = width * 2
    let dx    = w2 / count

    function captureMotion(evt, n) {
        if (evt.buttons == 1) {
            let box  = evt.target.getBoundingClientRect()
            let pos = clamp(evt.clientY - box.y, 0, box.height) / box.height
            onChange(n, 1 - pos)
        }
    }

    let bars = []
    let back = []
    for (let n = 0; n < count; n++) {
        let pos = (-width + (dx / 2)) + n * dx
        back.push(<path className="pink semi" strokeWidth={dx / 2} d={`M ${pos} ${amp} L ${pos} ${-amp}`} key={n} onPointerMove={evt => captureMotion(evt, n)}></path>)
        bars.push(<path className={`${CSS.bar} pink glow-2px`} strokeWidth={dx / 2} d={`M ${pos} ${amp} L ${pos} ${amp - amp * 2 * values[n]}`} key={n}></path>)
    }
   
    return (
        <svg className="module x2x1" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            onPointerDown={evt => evt.target.releasePointerCapture(evt.pointerId)}
        >
            {back}
            {bars}
        </svg>
    );
}


function Switch({active, onChoose}) {
    let activeNode = React.useRef()
    
    function choose(evt, n) {
        let glow = evt.target.closest(".box").children[0]
        if (activeNode.current !== glow) {
            activeNode.current.style.transform = `scale(0)`        
            glow.style.transform = `scale(1)`
            activeNode.current = glow
            onChoose(n)
        }
    }

    let buttons = []
    for (let n = 0; n < 8; n++) {
        buttons.push(
            <div className={`${CSS.button} pink semi box`} key={n} onClick={evt => choose(evt, n)}>
                {n != active ? 
                    <div className={`${CSS.light} pink glow`}></div> : 
                    <div className={`${CSS.light} pink glow`} style={{transform: `scale(1)`}} ref={activeNode}></div>}
            </div>            
        )
    }

    return (
        <div className={`${CSS.switch} module x2x1`}>
           {buttons}
        </div>
    )
}


export function BarsModule() {
    let [dataset, setDataset] = React.useState(() => Array.from({length: 8}, () => randomArray(10, 0, 1)))
    let [active, setActive] = React.useState(1)

    function change(n, value) {
        setDataset(dataset.with(active, dataset[active].with(n, value)))
    }

    return (
        <>
            <Bars values={dataset[active]} onChange={change}/>
            <Switch active={active} onChoose={setActive}/>
        </>
    )
}