import { motion } from 'framer-motion';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { IBIZA_GLOBAL_RADIO_STREAM } from '@/models/branding';
import {
  hasRadioStreamError,
  isRadioStreamPlaying,
  pauseRadioStream,
  playRadioStream,
  subscribeRadioPlayer,
} from '@/lib/radioStreamPlayer';

const Skiper25 = () => {
  return (
    <motion.div className="flex h-full w-full flex-col items-center justify-center">
      <motion.div className="absolute top-[20%] grid content-start justify-items-center gap-6 py-20 text-center">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight text-white/40">
          Pulsa para escuchar la radio
        </span>
      </motion.div>
      <MusicToggleButton />
    </motion.div>
  );
};

export { Skiper25 };

export interface MusicToggleButtonProps {
  /** URL del stream (MP3/AAC). Por defecto: Ibiza Global Radio en directo. */
  streamUrl?: string;
  className?: string;
}

export const MusicToggleButton = ({
  streamUrl = IBIZA_GLOBAL_RADIO_STREAM,
  className = '',
}: MusicToggleButtonProps) => {
  const bars = 5;

  const getRandomHeights = () =>
    Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);

  const [heights, setHeights] = useState(() => getRandomHeights());

  const isPlaying = useSyncExternalStore(
    subscribeRadioPlayer,
    isRadioStreamPlaying,
    () => false,
  );

  const error = useSyncExternalStore(
    subscribeRadioPlayer,
    hasRadioStreamError,
    () => false,
  );

  useEffect(() => {
    if (!isPlaying) {
      setHeights(Array(bars).fill(0.1));
      return;
    }

    const waveformIntervalId = setInterval(() => {
      setHeights(getRandomHeights());
    }, 100);

    return () => clearInterval(waveformIntervalId);
  }, [isPlaying]);

  const handleClick = () => {
    if (isPlaying) {
      pauseRadioStream();
      return;
    }

    playRadioStream(streamUrl);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={
        error
          ? 'No se pudo reproducir Ibiza Global Radio'
          : isPlaying
            ? 'Pausar Ibiza Global Radio'
            : 'Reproducir Ibiza Global Radio en directo'
      }
      aria-pressed={isPlaying}
      title="Ibiza Global Radio"
      initial={{ padding: '14px 14px' }}
      whileHover={{ padding: '16px 18px' }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.35, bounce: 0.4, type: 'spring' }}
      className={[
        'cursor-pointer rounded-full border-2 bg-[#0a0a0a] p-2 transition-colors',
        error
          ? 'border-amber-500/80'
          : isPlaying
            ? 'border-[#ef4444] shadow-[0_0_24px_rgba(220,38,38,0.35)]'
            : 'border-white/25 hover:border-[#dc2626]/70',
        className,
      ].join(' ')}
    >
      <motion.div
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ type: 'spring', bounce: 0.35 }}
        className="flex h-[18px] w-full items-center gap-1 rounded-full"
      >
        {heights.map((height, index) => (
          <motion.div
            key={index}
            className={[
              'w-[2px] rounded-full',
              error ? 'bg-amber-400' : isPlaying ? 'bg-[#ef4444]' : 'bg-white/90',
            ].join(' ')}
            initial={{ height: 4 }}
            animate={{ height: Math.max(4, height * 14) }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          />
        ))}
      </motion.div>
    </motion.button>
  );
};
