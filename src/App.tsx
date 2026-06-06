import { useState } from 'react'
import SmoothScrollProvider from './components/SmoothScrollProvider'
import CustomCursor from './components/CustomCursor'
import IntroOverlay from './components/IntroOverlay'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import CategoriesSection from './sections/CategoriesSection'
import HowItWorksSection from './sections/HowItWorksSection'
import FeaturedSection from './sections/FeaturedSection'
import PricingSection from './sections/PricingSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <SmoothScrollProvider>
      <CustomCursor />

      {!introComplete && <IntroOverlay onComplete={() => setIntroComplete(true)} />}

      <div className="relative z-10 bg-parchment">
        <Navigation />

        <main>
          <HeroSection show={introComplete} />
          <CategoriesSection />
          <HowItWorksSection />
          <FeaturedSection />
          <PricingSection />
          <ContactSection />
        </main>

        {/* Spacer for sticky footer reveal effect */}
        <div className="h-24" />
        <Footer />
      </div>
    </SmoothScrollProvider>
  )
}
