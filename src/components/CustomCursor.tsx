import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  useEffect(() => {
    if (isTouch) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let mouse = { x: -200, y: -200 }
    const ring = { x: -200, y: -200 }
    const particles: { x: number; y: number; r: number; life: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY }
    }
    const onClick = () => {
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          r: Math.random() * 3 + 1,
          life: 1,
        })
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)

    let raf: number
    const loop = () => {
      ctx.fillStyle = 'rgba(250,245,239,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ring.x += (mouse.x - ring.x) * 0.1
      ring.y += (mouse.y - ring.y) * 0.1

      ctx.beginPath()
      ctx.arc(ring.x, ring.y, 14, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(201,168,76,0.7)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#C9A84C'
      ctx.fill()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= 0.04
        if (p.life <= 0) { particles.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(p.x + (Math.random() - 0.5) * 4, p.y + (Math.random() - 0.5) * 4, p.r * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${p.life * 0.5})`
        ctx.fill()
      }

      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ cursor: 'none' }}
    />
  )
}
