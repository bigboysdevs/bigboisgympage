import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { normalizeDragOffset } from '../utils/marqueeLoop';

type DragAxis = 'x' | 'y' | null;

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startOffset: number;
  axis: DragAxis;
};

const AXIS_LOCK_PX = 10;

/** Arrastre horizontal; si el gesto es vertical, deja pasar el scroll de la página. */
export function useHorizontalDragOffset() {
  const offsetRef = useRef(0);
  const dragRef = useRef<DragState | null>(null);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: offsetRef.current,
      axis: null,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.axis === null) {
      if (Math.hypot(dx, dy) < AXIS_LOCK_PX) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        drag.axis = 'x';
      } else {
        dragRef.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
        return;
      }
    }

    if (drag.axis === 'x') {
      e.preventDefault();
      offsetRef.current = drag.startOffset + dx;
    }
  }, []);

  const endDrag = useCallback(
    (e: ReactPointerEvent<HTMLElement>, loopWidth?: number) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      dragRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (loopWidth && loopWidth > 0) {
        offsetRef.current = normalizeDragOffset(offsetRef.current, loopWidth);
      }
    },
    [],
  );

  const getOffset = useCallback(() => offsetRef.current, []);

  return {
    getOffset,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
}
