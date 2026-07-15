import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import CategoriesSection from './sections/CategoriesSection'
import HowItWorksSection from './sections/HowItWorksSection'
import FeaturedSection from './sections/FeaturedSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  return (
    <div className="bg-parchment">
      <Navigation />
      <main>
        <HeroSection show={true} />
        <CategoriesSection />
        <HowItWorksSection />
        <FeaturedSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
