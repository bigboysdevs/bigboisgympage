/** Modelo 3D oficial (copiado desde Downloads → `public/models/`). */
export const HERO_GLTF_URL = '/models/logo-BigBoysGYM-v01.glb';

/** Solo si el perfil es `static` (reduced motion / datos mínimos). */
export const HERO_FIGURE_FALLBACK_PNG = '/big-boys-gym-logo.png';

/** Emisión en directo — Ibiza Global Radio (misma emisora que radio-espana.es). */
export const IBIZA_GLOBAL_RADIO_STREAM =
  'https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3';

export const IBIZA_GLOBAL_RADIO_PAGE =
  'https://www.radio-espana.es/ibiza-global-radio';

/** Datos de contacto y ubicación — Big Boys GYM, Manizales. */
export const GYM_CONTACT = {
  name: 'Big Boys GYM',
  addressLines: ['Cl. 67 #4255 42-1 A', 'Manizales, Caldas'],
  phoneDisplay: '+57 317 1184925',
  phoneHref: 'tel:+573171184925',
  email: 'bigboysdevs@gmail.com',
  whatsappHref: 'https://wa.me/573171184925?text=Hola%20Big%20Boys%20Gym',
  mapsPlaceUrl:
    'https://www.google.com/maps/place/Big+Boys+GYM/@5.0460668,-75.5046687,179m/data=!3m1!1e3!4m6!3m5!1s0x8e47654202262e67:0xc1d7d3f3a4ab48b8!8m2!3d5.0461215!4d-75.5047532!16s%2Fg%2F11ckttmm9l',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.784!2d-75.5073282!3d5.0461215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e47654202262e67%3A0xc1d7d3f3a4ab48b8!2sBig%20Boys%20GYM!5e0!3m2!1ses!2sco!4v1747500000000!5m2!1ses!2sco',
  hours: [
    { label: 'Lun — Vie', value: '5:00 a. m. — 10:00 p. m.' },
    { label: 'Sábado', value: '7:00 a. m. — 2:00 p. m.' },
    { label: 'Domingo', value: 'Cerrado' },
  ],
  instagramUrl: 'https://www.instagram.com/bigboys.gym/',
} as const;
