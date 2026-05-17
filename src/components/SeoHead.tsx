import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  OG_IMAGE_URL,
  SITE_NAME,
  absoluteUrl,
  buildGymJsonLd,
  getPageSeo,
} from '@/models/seo';

const JSON_LD_ID = 'gym-jsonld';

function upsertMeta(
  selector: string,
  create: () => HTMLMetaElement,
  content: string,
) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setSocialMeta(seo: ReturnType<typeof getPageSeo>) {
  const url = absoluteUrl(seo.canonicalPath);

  upsertMeta(
    'meta[property="og:title"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      return m;
    },
    seo.title.replace(/ — .*$/, '') || SITE_NAME,
  );

  upsertMeta(
    'meta[property="og:description"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:description');
      return m;
    },
    seo.description,
  );

  upsertMeta(
    'meta[property="og:url"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:url');
      return m;
    },
    url,
  );

  upsertMeta(
    'meta[property="og:image"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:image');
      return m;
    },
    OG_IMAGE_URL,
  );

  upsertMeta(
    'meta[property="og:image:alt"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:image:alt');
      return m;
    },
    `${SITE_NAME} — logo oficial`,
  );

  upsertMeta(
    'meta[property="og:site_name"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:site_name');
      return m;
    },
    SITE_NAME,
  );

  upsertMeta(
    'meta[property="og:locale"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:locale');
      return m;
    },
    'es_CO',
  );

  upsertMeta('meta[name="twitter:title"]', () => {
    const m = document.createElement('meta');
    m.name = 'twitter:title';
    return m;
  }, seo.title.replace(/ — .*$/, '') || SITE_NAME);

  upsertMeta('meta[name="twitter:description"]', () => {
    const m = document.createElement('meta');
    m.name = 'twitter:description';
    return m;
  }, seo.description);

  upsertMeta('meta[name="twitter:image"]', () => {
    const m = document.createElement('meta');
    m.name = 'twitter:image';
    return m;
  }, OG_IMAGE_URL);

  upsertMeta('meta[name="twitter:image:alt"]', () => {
    const m = document.createElement('meta');
    m.name = 'twitter:image:alt';
    return m;
  }, `${SITE_NAME} — logo oficial`);
}

export default function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getPageSeo(pathname);
    document.title = seo.title;

    upsertMeta('meta[name="description"]', () => {
      const m = document.createElement('meta');
      m.name = 'description';
      return m;
    }, seo.description);

    upsertLink('canonical', absoluteUrl(seo.canonicalPath));
    setSocialMeta(seo);

    let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildGymJsonLd());
  }, [pathname]);

  return null;
}
