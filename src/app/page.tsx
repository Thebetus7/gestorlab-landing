import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectSection } from '@/components/sections/ProjectSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <ServicesSection />
      <ProjectSection />
      <ContactSection />
    </>
  );
}
