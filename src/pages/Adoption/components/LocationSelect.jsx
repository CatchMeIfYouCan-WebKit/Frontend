// src/pages/LocationSelect.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../LocationSelect.css';

export default function LocationSelect() {
    const navigate = useNavigate();
    const location = useLocation();
    const mapRef = useRef(null);
    const markerRef = useRef(null);
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
                    center: new kakao.maps.LatLng(37.5665, 126.978),
                    level: 4,
                });
                const geocoder = new kakao.maps.services.Geocoder();

                // 마커 & 클릭 처리 함수
                const placeMarker = (latLng) => {
                    // 이전 마커 제거
                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                    }
                    // 새 마커 생성
                    markerRef.current = new kakao.maps.Marker({
                        map,
                        position: latLng,
                    });
                    const lat = latLng.getLat();
                    const lng = latLng.getLng();
                    setSelectedPos({ lat, lng });
                };

                // 데스크탑 · 모바일 모두 지원
                kakao.maps.event.addListener(map, 'click', (e) => {
                    placeMarker(e.latLng);
                });
                kakao.maps.event.addListener(map, 'rightclick', (e) => {
                    placeMarker(e.latLng);
                });
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleConfirm = () => {
        if (!selectedPos) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.coord2Address(selectedPos.lng, selectedPos.lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;

                // 📦 RegisterPost로 주소, 위도, 경도 모두 전달
                navigate('/adoptionpost/add/details', {
                    replace: true,
                    state: {
                        ...location.state,
                        post: {
                            ...location.state.post,
                            adopt_location: address, // 🏠 주소 텍스트
                            latitude: selectedPos.lat,
                            longitude: selectedPos.lng,
                        },
                    },
                });
            }
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
