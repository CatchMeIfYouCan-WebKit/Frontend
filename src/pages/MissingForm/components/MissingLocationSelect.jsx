//로케이션

// src/pages/LocationSelect.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../../Adoption/LocationSelect.css';

export default function LocationSelect() {
    const navigate = useNavigate();
    const location = useLocation();
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const downTimeRef = useRef(0);
    const [selectedPos, setSelectedPos] = useState(null);

    const KAKAO_MAP_SDK =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';

    useEffect(() => {
        // 1) SDK 스크립트 로드
        const script = document.createElement('script');
        script.src = KAKAO_MAP_SDK;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            // 2) SDK 초기화
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const map = new kakao.maps.Map(mapRef.current, {
                    center: new kakao.maps.LatLng(37.5665, 126.978), // 초기 중심 좌표
                    level: 4,
                });

                // 3) long-press 로 marker 찍기
                kakao.maps.event.addListener(map, 'mousedown', () => {
                    downTimeRef.current = Date.now();
                });
                kakao.maps.event.addListener(map, 'mouseup', (mouseEvent) => {
                    const elapsed = Date.now() - downTimeRef.current;
                    if (elapsed >= 500) {
                        // 500ms 이상 누르고 있었으면
                        const { Ma: lat, La: lng } = mouseEvent.latLng;
                        setSelectedPos({ lat, lng });

                        // 이전 마커 제거
                        if (markerRef.current) {
                            markerRef.current.setMap(null);
                        }
                        // 새 마커 생성
                        markerRef.current = new kakao.maps.Marker({
                            map,
                            position: mouseEvent.latLng,
                        });
                    }
                });
            });
        };

        return () => {
            // 컴포넌트 언마운트 시 스크립트 제거 (선택)
            document.head.removeChild(script);
        };
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleConfirm = () => {
        if (!selectedPos) return;
        // 이전 화면으로 돌아가면서 latitude/longitude 추가 전달
        navigate('/report-missing', {
            replace: true,
            state: {
                ...location.state,
                latitude: selectedPos.lat,
                longitude: selectedPos.lng,
            },
        });
    };

    return (
        <div className="location-select">
            <header className="ls-header">
                <div className="ls-back" onClick={handleBack}>
                    <IoIosArrowBack size={24} />
                </div>
                <h1 className="ls-title">아이가 새로운 반려인을 만날 곳을 선택해주세요</h1>
                <p className="ls-subtitle">지도에서 원하시는 장소를 마커로 표시해주세요</p>
            </header>

            <div ref={mapRef} className="ls-map" />

            <button className="ls-confirm-btn" onClick={handleConfirm} disabled={!selectedPos}>
                선택 완료
            </button>
        </div>
    );
}
