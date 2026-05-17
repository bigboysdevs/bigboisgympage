import { Outlet } from 'react-router-dom';
import ScrollToHash from '@/components/ScrollToHash';
import Navbar from '@/components/Navbar';
import FooterLegalSection from '@/components/FooterLegalSection';
import InvertedBlendCursor from '@/components/InvertedBlendCursor';
import FloatingRadioPlayer from '@/components/FloatingRadioPlayer';

export default function SiteLayout() {
  return (
    <>
      <ScrollToHash />
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-[70] bg-transparent"
      >
        <Navbar />
      </header>
      <main className="relative" style={{ backgroundColor: '#0C0C0C', overflowX: 'clip' }}>
        <Outlet />
      </main>
      <FooterLegalSection />
      <InvertedBlendCursor />
      <FloatingRadioPlayer />
    </>
  );
}
