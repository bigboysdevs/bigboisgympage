import { AboutSection } from "./sections/AboutSection";
import { HeroSection } from "./sections/HeroSection";
import { MarqueeSection } from "./sections/MarqueeSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ServicesSection } from "./sections/ServicesSection";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#0C0C0C] text-[#D7E2EA] antialiased">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </div>
  );
}
