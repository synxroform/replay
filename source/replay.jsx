import React from "react"
import ReactDOM from "react-dom/client"

import { LabelModule } from "./label.jsx" 
import { KnobModule } from "./knob.jsx" 
import { RangeModule } from "./range.jsx"
import { BarsModule } from "./bars.jsx"
import { CubeModule } from "./cube.jsx"
import { ChartModule } from "./chart.jsx"
import { CrossModule } from "./cross.jsx"
import { SpectrumModule } from "./spectrum.jsx"
import { RhombicModule } from "./rhombic.jsx"
import { BallsModule } from "./balls.jsx"
import { ScissorsModule } from "./scissors.jsx"
import { CounterModule } from "./counter.jsx"
import { GooeyModule } from "./gooey.jsx"
import { PlotModule } from "./plot.jsx"


function App() {
    return (
        <div className="container">
            <LabelModule />
            <KnobModule />
            <RangeModule />
            <BarsModule />
            <ChartModule />
            <CrossModule />
            <CubeModule />
            <SpectrumModule />
            <RhombicModule />
            <CounterModule />
            <ScissorsModule />
            <PlotModule />
            <GooeyModule />
            <BallsModule />
        </div>  
    )
}


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)