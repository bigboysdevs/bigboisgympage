import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ContactLocationSection from './components/ContactLocationSection';
import FooterLegalSection from './components/FooterLegalSection';
import InvertedBlendCursor from './components/InvertedBlendCursor';
import FloatingRadioPlayer from './components/FloatingRadioPlayer';

export default function App() {
  return (
    <>
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-[70] bg-transparent"
      >
        <Navbar />
      </header>
      <main className="relative" style={{ backgroundColor: '#0C0C0C', overflowX: 'clip' }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactLocationSection />
        <FooterLegalSection />
      </main>
      <InvertedBlendCursor />
      <FloatingRadioPlayer />
    </>
  );
}
