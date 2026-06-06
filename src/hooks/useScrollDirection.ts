import { useEffect, useState, useRef } from 'react'

export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const lastY = useRef(0)

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setDirection(y > lastY.current ? 'down' : 'up')
      lastY.current = y
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return direction
}
