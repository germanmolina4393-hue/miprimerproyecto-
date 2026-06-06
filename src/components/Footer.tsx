export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="sticky bottom-0 z-[-1] bg-charcoal text-parchment py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl living-gradient mb-3">Mundo de Colores</p>
          <p className="text-parchment/50 text-sm leading-relaxed max-w-xs">
            Páginas para colorear únicas, diseñadas con amor. Descargá, imprimí y disfrutá.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-parchment/70 uppercase tracking-wide">Navegación</h4>
          <ul className="space-y-2 text-sm text-parchment/50">
            <li><a href="#categorias" className="hover:text-parchment transition-colors">Categorías</a></li>
            <li><a href="#como-funciona" className="hover:text-parchment transition-colors">Cómo funciona</a></li>
            <li><a href="#destacados" className="hover:text-parchment transition-colors">Destacados</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-parchment/70 uppercase tracking-wide">Contacto</h4>
          <ul className="space-y-2 text-sm text-parchment/50">
            {/* REEMPLAZÁ con tu número de WhatsApp */}
            <li><a href="https://wa.me/549XXXXXXXXXX" target="_blank" rel="noopener" className="hover:text-parchment transition-colors">WhatsApp</a></li>
            {/* REEMPLAZÁ con tu email */}
            <li><a href="mailto:TU_EMAIL@gmail.com" className="hover:text-parchment transition-colors">TU_EMAIL@gmail.com</a></li>
            <li><a href="#" className="hover:text-parchment transition-colors">Política de privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-parchment/10 text-center text-xs text-parchment/30">
        © {year} Mundo de Colores. Todos los derechos reservados.
      </div>
    </footer>
  )
}
