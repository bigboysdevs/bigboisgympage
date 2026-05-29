import HeroSection from '@/components/HeroSection';
import BrandPartnersBar from '@/components/BrandPartnersBar';
import MarqueeSection from '@/components/MarqueeSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactLocationSection from '@/components/ContactLocationSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandPartnersBar />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactLocationSection />
    </>
  );
}
