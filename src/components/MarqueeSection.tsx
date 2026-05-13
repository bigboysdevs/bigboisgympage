import { useEffect, useRef } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1599058945522-734d051e8e27?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1540497077382-69212b239b72?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d17b?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c8?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1434682880608-969413d07d4b?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1599058945522-734d051e8e27?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1540497077382-69212b239b72?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=840&h=540&q=80',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c8?auto=format&fit=crop&w=840&h=540&q=80',
];

const ROW_1 = IMAGES.slice(0, 11);
const ROW_2 = IMAGES.slice(11);

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrolled = window.scrollY - sectionTop + window.innerHeight;
      const offset = scrolled * 0.3;

      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden pt-24 sm:pt-32 md:pt-40 pb-10"
      style={{ backgroundColor: '#0C0C0C' }}
      aria-label="Galería de entrenamiento"
    >
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden w-full">
          <div
            ref={row1Ref}
            className="flex gap-3"
            style={{
              willChange: 'transform',
              transform: 'translateX(-200px)',
            }}
          >
            {[...ROW_1, ...ROW_1, ...ROW_1].map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: '420px', height: '270px' }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden w-full">
          <div
            ref={row2Ref}
            className="flex gap-3"
            style={{
              willChange: 'transform',
              transform: 'translateX(200px)',
            }}
          >
            {[...ROW_2, ...ROW_2, ...ROW_2].map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: '420px', height: '270px' }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
