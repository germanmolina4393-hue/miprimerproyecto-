import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  onComplete: () => void
}

export default function IntroOverlay({ onComplete }: Props) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      onComplete()
    }

    // Timeout de seguridad — si GSAP falla igual abre el sitio
    const fallback = setTimeout(finish, 3000)

    const tl = gsap.timeline({ onComplete: finish })
    tl.from(textRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' })
      .to(textRef.current, { opacity: 0, duration: 0.4, delay: 0.7 })
      .to(leftRef.current, { x: '-100%', duration: 0.7, ease: 'power3.inOut' }, '<')
      .to(rightRef.current, { x: '100%', duration: 0.7, ease: 'power3.inOut' }, '<')

    return () => {
      clearTimeout(fallback)
      tl.kill()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div ref={leftRef} className="w-1/2 h-full bg-charcoal" />
      <div ref={rightRef} className="w-1/2 h-full bg-charcoal" />
      <div ref={textRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="font-serif text-4xl md:text-6xl living-gradient text-center px-4">
          Mundo de Colores
        </h1>
      </div>
    </div>
  )
}
