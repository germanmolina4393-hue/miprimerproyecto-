import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useScrollDirection } from '../hooks/useScrollDirection'

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const dir = useScrollDirection()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (window.scrollY < 100) return
    gsap.to(navRef.current, { y: dir === 'down' ? '-100%' : '0%', duration: 0.35, ease: 'power2.out' })
  }, [dir])

  const links = [
    { label: 'Libros', href: '#categorias' },
    { label: 'Cómo funciona', href: '#como-funciona' },
    { label: 'La colección', href: '#destacados' },
    { label: 'Comprar', href: '#comprar' },
    { label: 'Contacto', href: '#contacto' },
  ]

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-parchment/90 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-serif text-xl living-gradient font-bold">Mundo de Colores</a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map(link => <a key={link.href} href={link.href} className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors">{link.label}</a>)}
          <a href="#comprar" className="bg-charcoal text-parchment px-5 py-2 rounded-full text-sm font-semibold hover:bg-gold transition-colors duration-300">Comprar ahora</a>
        </nav>
        <button className="md:hidden p-2 text-charcoal" onClick={() => setMenuOpen(open => !open)} aria-label="Menú">
          <span className="block w-5 h-0.5 bg-charcoal mb-1" /><span className="block w-5 h-0.5 bg-charcoal mb-1" /><span className="block w-5 h-0.5 bg-charcoal" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-parchment border-t border-gold/20 px-6 pb-4">
          {links.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block py-3 text-charcoal/80 hover:text-charcoal border-b border-gold/10 last:border-0">{link.label}</a>)}
          <a href="#comprar" onClick={() => setMenuOpen(false)} className="mt-3 block text-center bg-charcoal text-parchment px-5 py-2 rounded-full text-sm font-semibold">Comprar ahora</a>
        </div>
      )}
    </header>
  )
}
