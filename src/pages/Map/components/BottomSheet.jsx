import React, { useRef, useState, useEffect } from 'react';
import '../BottomSheet.css';

export default function BottomSheet({
  minHeight = 100,
  initialPercent = 0.4,
  maxPercent = 0.8,
  children,
}) {
  const startY = useRef(0);
  const startH = useRef(0);
  const [height, setHeight] = useState(window.innerHeight * initialPercent);

  const onDragStart = e => {
    e.preventDefault();
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    startH.current = height;
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchmove', onDragMove);
    window.addEventListener('touchend', onDragEnd);
  };

  const onDragMove = e => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = startY.current - clientY;
    const maxH = window.innerHeight * maxPercent;
    const newH = Math.min(maxH, Math.max(minHeight, startH.current + dy));
    setHeight(newH);
  };

  const onDragEnd = () => {
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
    window.removeEventListener('touchmove', onDragMove);
    window.removeEventListener('touchend', onDragEnd);
  };

  // 윈도우 리사이즈 대응
  useEffect(() => {
    const onResize = () => {
      const maxH = window.innerHeight * maxPercent;
      setHeight(h => Math.min(maxH, Math.max(minHeight, h)));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [minHeight, maxPercent]);

  return (
    <div className="bottom-sheet" style={{ height: `${height}px` }}>
      <div
        className="sheet-handle"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      />
      <div className="sheet-content">
        {children}
      </div>
    </div>
  );
}
