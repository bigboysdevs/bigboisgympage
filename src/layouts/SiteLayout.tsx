import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SeoHead from '@/components/SeoHead';
import ScrollToHash from '@/components/ScrollToHash';
import Navbar from '@/components/Navbar';
import FooterLegalSection from '@/components/FooterLegalSection';
import InvertedBlendCursor from '@/components/InvertedBlendCursor';
import FloatingScrollProgress from '@/components/FloatingScrollProgress';
import PageGalacticBackdrop from '@/components/PageGalacticBackdrop';
import PageLightningScroll from '@/components/PageLightningScroll';

// PERF: Howler + UI de radio fuera del camino crítico de la home.
const FloatingRadioPlayer = lazy(() => import('@/components/FloatingRadioPlayer'));

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
        <main className="site-main relative z-[10] overflow-visible bg-transparent">
          <PageGalacticBackdrop />
          <PageLightningScroll />
          <Outlet />
        </main>
        <div className="relative z-[10]">
          <FooterLegalSection />
        </div>
      </div>
      <InvertedBlendCursor />
      <FloatingScrollProgress />
      <Suspense fallback={null}>
        <FloatingRadioPlayer />
      </Suspense>
    </>
  );
}
