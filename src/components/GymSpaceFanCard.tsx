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
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') onActivate();
      }}
    >
      <a href={item.href} className="gym-spaces-fan__card-link" aria-label={`${item.title} — ${item.subtitle}`}>
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
      </a>
    </motion.article>
  );
}
