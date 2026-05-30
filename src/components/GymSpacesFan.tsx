import { useCallback, useState } from 'react';
import GymSpaceFanCard from './GymSpaceFanCard';
import { GYM_SPACE_FAN_ITEMS } from '@/models/gymSpaces';

export default function GymSpacesFan() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const items = GYM_SPACE_FAN_ITEMS;

  const handleActivate = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleClear = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <div
      className="gym-spaces-fan"
      onMouseLeave={handleClear}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          handleClear();
        }
      }}
    >
      <div className="gym-spaces-fan__deck" role="list">
        {items.map((item, index) => (
          <GymSpaceFanCard
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            isActive={activeId === item.id}
            hasActive={activeId !== null}
            onActivate={() => handleActivate(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
