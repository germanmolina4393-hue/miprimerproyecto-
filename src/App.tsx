import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import CategoriesSection from './sections/CategoriesSection'
import HowItWorksSection from './sections/HowItWorksSection'
import FeaturedSection from './sections/FeaturedSection'
import PricingSection from './sections/PricingSection'
import ContactSection from './sections/ContactSection'
import PaymentResult from './PaymentResult'

export default function App() {
  if (window.location.pathname === '/pago-aprobado' || window.location.pathname === '/pago-pendiente' || window.location.pathname === '/pago-rechazado') return <PaymentResult />

  return (
    <div className="bg-parchment">
      <Navigation />
      <main>
        <HeroSection show={true} />
        <CategoriesSection />
        <HowItWorksSection />
        <FeaturedSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
