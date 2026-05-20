import { Outlet } from 'react-router-dom';
import SeoHead from '@/components/SeoHead';
import ScrollToHash from '@/components/ScrollToHash';
import Navbar from '@/components/Navbar';
import FooterLegalSection from '@/components/FooterLegalSection';
import InvertedBlendCursor from '@/components/InvertedBlendCursor';
import FloatingRadioPlayer from '@/components/FloatingRadioPlayer';
import PageLightningScroll from '@/components/PageLightningScroll';

export default function SiteLayout() {
  return (
    <>
      <SeoHead />
      <ScrollToHash />
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-[70] bg-transparent"
      >
        <Navbar />
      </header>
      <div className="site-page-shell">
        <PageLightningScroll />
        <main className="relative z-[10] overflow-visible bg-transparent">
          <Outlet />
        </main>
        <div className="relative z-[10]">
          <FooterLegalSection />
        </div>
      </div>
      <InvertedBlendCursor />
      <FloatingRadioPlayer />
    </>
  );
}
