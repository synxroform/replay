import React from "react"
import { random, distance, abs } from "mathjs"

function updateBalls(balls, bounds) {
	let grav = 0.5,
		fric = 0.95,
		rebn = 0.05

	for (let i = 0; i < balls.length; i++) {
		
		let b = balls[i],
			r = b.s / 2,
			vx = (b.x - b.px) * fric,
			vy = (b.y - b.py) * fric

		b.converged = false

		b.px = b.x
		b.py = b.y

		vy += grav

		b.x += vx
		b.y += vy

		if (b.x < bounds.x.min || b.x > bounds.x.max) {
			b.x = b.x > bounds.x.max ? bounds.x.max : b.x < bounds.x.min ? bounds.x.min : b.x
			b.px = b.x + vx * rebn
		}
		if (b.y < bounds.y.min || b.y + r > bounds.y.max) {
			b.y = b.y + r > bounds.y.max ? bounds.y.max - r : b.y < bounds.y.min ? bounds.y.min : b.y
			b.py = b.y + vy * rebn
		}

		for (let j = 0; j < balls.length; j++) {
			let b2 = balls[j],
				d = distance([b.x, b.y], [b2.x, b2.y]),
				bc = (b.s + b2.s) / 2
			
			if (d <= bc && i != j) {
				let rebnp = (bc - d) / d / 2,
					ofx = (b2.x - b.x) * rebnp,
					ofy = (b2.y - b.y) * rebnp

				b.x -= ofx
				b.y -= ofy

				b2.x += ofx
				b2.y += ofy
			}
		}

		if (abs(b.x - b.px) < 0.5 && abs(b.y - b.py) < 0.5) {
			b.converged = true
		}
	}
}

function explode(balls, ex, ey, f, r) {
	for (let i = 0; i < balls.length; i++) {
		let b = balls[i],
		 	d = distance([ex, ey], [b.x, b.y])
		if (d < r){
			let vx = b.x - ex,
				vy = b.y - ey
			b.x += vx / d * f
			b.y += vy / d * f
		}
	}
}


function setup(bounds) {
	let particles = []
	for (let i = 0; i < 10; i++) {
		let x = random(bounds.x.min, bounds.x.max),
			y = random(bounds.y.min, bounds.y.max)

		particles.push({
			x: x,
			y: y,
			px: x - random(-3, 3),
			py: y - random(-3, 3),
			s: random(15, 30),
		})
	}
	return particles
}


export function BallsModule() {
	const bounds = { x: {min: -80, max: 80}, y: {min: -35, max: 35} }

	let balls = React.useRef(setup(bounds)),
		[, setUpdate] = React.useState(0)

	function animate() {
		updateBalls(balls.current, bounds)
		requestAnimationFrame(animate)
		if (!balls.current.every(b => b.converged)) {
			setUpdate(Date.now())
		}
	}

	function makeExplosion(evt) {
		let rect = evt.target.closest("svg").getBoundingClientRect()
		let ex = ((evt.clientX - rect.x) / rect.width * 200) - 100
		let ey = ((evt.clientY - rect.y) / rect.height * 100) - 50
		explode(balls.current, ex, ey, 10, 50)
	}

	React.useEffect(() => {
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, []);

	let circles = balls.current.map((p, n) => <circle className="pink glow" cx={p.x} cy={p.y} r={p.s / 2} key={n}></circle>)

	return (
		<svg className="module x2x1" viewBox="-100 -50 200 100" xmlns="http://www.w3.org/2000/svg"
			onPointerDown={makeExplosion}
		>
			{circles}
		</svg>
	)
}