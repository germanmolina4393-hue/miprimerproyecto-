import SmoothScrollProvider from './components/SmoothScrollProvider'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import CategoriesSection from './sections/CategoriesSection'
import HowItWorksSection from './sections/HowItWorksSection'
import FeaturedSection from './sections/FeaturedSection'
import PricingSection from './sections/PricingSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />

      <div className="relative z-10 bg-parchment">
        <Navigation />

        <main>
          <HeroSection show={true} />
          <CategoriesSection />
          <HowItWorksSection />
          <FeaturedSection />
          <PricingSection />
          <ContactSection />
        </main>

        <div className="h-24" />
        <Footer />
      </div>
    </SmoothScrollProvider>
  )
}
