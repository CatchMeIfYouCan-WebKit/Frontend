// src/pages/MissingForm/components/LocationPicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../LoactionPicker.css';

export default function LocationPicker({ isOpen, onClose, onSelect }) {
    const mapRef = useRef(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        // 카카오 스크립트 로딩
        const script = document.createElement('script');
        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services';
        script.onload = () => {
            const kakao = window.kakao;
            const map = new kakao.maps.Map(mapRef.current, {
                center: new kakao.maps.LatLng(37.5665, 126.978),
                level: 5,
            });
            const geocoder = new kakao.maps.services.Geocoder();
            const marker = new kakao.maps.Marker({ map });

            kakao.maps.event.addListener(map, 'click', (e) => {
                marker.setPosition(e.latLng);
                geocoder.coord2Address(e.latLng.getLng(), e.latLng.getLat(), (res, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        setAddress(res[0].address.address_name);
                    }
                });
            });
        };
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
            setAddress('');
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div className="lp-overlay" onClick={onClose}>
            <div className="lp-container" onClick={(e) => e.stopPropagation()}>
                <div className="lp-header">
                    <h2>실종 위치 선택</h2>
                    <button className="lp-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div ref={mapRef} className="lp-map" />
                <div className="lp-footer">
                    <span>{address || '지도를 클릭하여 주소를 선택하세요'}</span>
                    <button
                        className="lp-select"
                        disabled={!address}
                        onClick={() => {
                            onSelect(address);
                            onClose();
                        }}
                    >
                        선택
                    </button>
                </div>
            </div>
        </div>
    );
}
