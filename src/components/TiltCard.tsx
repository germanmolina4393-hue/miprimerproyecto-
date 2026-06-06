import { useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function TiltCard({ children, className = '' }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current!
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(card, {
      rotateX: -(y / rect.height) * 12,
      rotateY: (x / rect.width) * 12,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
