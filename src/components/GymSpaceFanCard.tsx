import { motion } from 'framer-motion';
import PlanImage from './PlanImage';
import { getFanPose } from '@/models/gymSpaceFanLayout';
import type { GymSpaceFanItem } from '@/models/gymSpaces';

type GymSpaceFanCardProps = {
  item: GymSpaceFanItem;
  index: number;
  total: number;
  isActive: boolean;
  hasActive: boolean;
  onActivate: () => void;
};

export default function GymSpaceFanCard({
  item,
  index,
  total,
  isActive,
  hasActive,
  onActivate,
}: GymSpaceFanCardProps) {
  const pose = getFanPose(index, total, isActive);

  return (
    <motion.article
      className={`gym-spaces-fan__card group ${isActive ? 'gym-spaces-fan__card--active' : ''}`}
      style={{ zIndex: pose.zIndex }}
      animate={{
        rotate: pose.rotate,
        x: pose.x,
        y: pose.y,
        scale: pose.scale,
        opacity: hasActive && !isActive ? 0.72 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.62 }}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`${item.title} — ${item.subtitle}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      <div className="gym-spaces-fan__card-link">
        <PlanImage
          src={item.image}
          fallbackSrc={item.fallbackImage}
          alt={item.title}
          className="gym-spaces-fan__img"
        />
        <div className="gym-spaces-fan__caption" aria-hidden={!isActive}>
          <p className="gym-spaces-fan__caption-sub">{item.subtitle}</p>
          <p className="gym-spaces-fan__caption-title">{item.title}</p>
        </div>
      </div>
    </motion.article>
  );
}
