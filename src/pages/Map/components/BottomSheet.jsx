// BottomSheet.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../BottomSheet.css';

export default function BottomSheet({
    percent, // MapMain 에서 내려주는 현재 스냅 퍼센트 (0~1)
    minPercent,
    maxPercent,
    onDragEnd,
    children,
}) {
    const startY = useRef(0);
    const startH = useRef(0);

    // 1) height 상태와 ref
    const [height, setHeight] = useState(window.innerHeight * percent);
    const heightRef = useRef(height);

    // 2) percent prop 바뀔 때 높이 및 ref 동기화
    useEffect(() => {
        const h = window.innerHeight * percent;

        setHeight(h);

        heightRef.current = h;

        console.log('[BottomSheet] 강제로 높이 설정:', h);
    }, [percent]);

    // 3) height state가 바뀔 때도 ref 동기화
    useEffect(() => {
        heightRef.current = height;
    }, [height]);

    // 4) 드래그 중
    const onDragMove = useCallback(
        (e) => {
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const dy = startY.current - clientY;

            const minH = window.innerHeight * minPercent;
            const maxH = window.innerHeight * maxPercent;
            const newH = Math.min(maxH, Math.max(minH, startH.current + dy));

            setHeight(newH);
            // 바로 ref도 업데이트
            heightRef.current = newH;
        },
        [minPercent, maxPercent]
    );

    // 5) 드래그 시작
    const onDragStart = useCallback(
        (e) => {
            // e.preventDefault();

            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            startY.current = clientY;
            startH.current = heightRef.current; // ref에서 읽기

            window.addEventListener('mousemove', onDragMove);
            window.addEventListener('mouseup', onDragStop);
            window.addEventListener('touchmove', onDragMove, { passive: false });
            window.addEventListener('touchend', onDragStop, { passive: false });

            console.log('onDragStart called');
        },
        [onDragMove]
    );

    // 6) 드래그 종료
    const onDragStop = useCallback(() => {
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragStop);
        window.removeEventListener('touchmove', onDragMove);
        window.removeEventListener('touchend', onDragStop);

        // ref에서 읽은 height로 최종 퍼센트 계산
        let finalPercent = heightRef.current / window.innerHeight;

        const minSnapPercent = minPercent || 0.3;
        const maxSnapPercent = maxPercent || 0.87;

        if (finalPercent < minSnapPercent) {
            finalPercent = minSnapPercent;
        }
        if (finalPercent > maxSnapPercent) {
            finalPercent = maxSnapPercent;
        }

        onDragEnd?.(finalPercent);
    }, [onDragEnd, onDragMove]);

    // 7) 리사이즈 대응
    useEffect(() => {
        const onResize = () => {
            const minH = window.innerHeight * minPercent;
            const maxH = window.innerHeight * maxPercent;
            setHeight((h) => {
                const nh = Math.min(maxH, Math.max(minH, h));
                heightRef.current = nh;
                return nh;
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [minPercent, maxPercent]);

    return (
        <div
            className="bottom-sheet"
            style={{ height: `${height}px` }}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
        >
            <div className="sheet-handle" />
            <div className="sheet-content">{children}</div>
        </div>
    );
}
