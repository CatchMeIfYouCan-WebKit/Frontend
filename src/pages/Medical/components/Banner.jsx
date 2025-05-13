// Banner.jsx
import React, { useState, useEffect, useRef } from 'react';
import banner1 from '../../../assets/1.png';
import banner2 from '../../../assets/2.png';
import banner3 from '../../../assets/3.png';
import banner4 from '../../../assets/4.png';

const banners = [banner1, banner2, banner3, banner4];

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const startX = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSwipe = (endX) => {
        const diff = startX.current - endX;
        if (diff > 50) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        } else if (diff < -50) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
        }
    };

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        handleSwipe(endX);
    };
    const handleMouseDown = (e) => {
        startX.current = e.clientX;
    };
    const handleMouseUp = (e) => {
        const endX = e.clientX;
        handleSwipe(endX);
    };
    console.log('✅ Banner 컴포넌트 렌더링됨');

    return (
        <div
            className="banner"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div
                className="banner-track"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    width: `${banners.length * 100}%`,
                    height: '100%',
                }}
            >
                {banners.map((src, index) => (
                    <div key={index} style={{ width: '100%', height: '100%' }}>
                        <img src={src} alt={`배너 ${index + 1}`} className="banner-image" />
                    </div>
                ))}
            </div>
            <div className="banner-pagination">
                {currentIndex + 1} / {banners.length}
            </div>
        </div>
    );
};

export default Banner;
