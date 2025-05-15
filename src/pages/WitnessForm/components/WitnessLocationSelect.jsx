// src/pages/LocationSelect.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { MdMyLocation } from 'react-icons/md';
import '../WitnessLocationSelect.css';

export default function LocationSelect() {
    const navigate = useNavigate();
    const location = useLocation();

    const mapDiv = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const psRef = useRef(null);

    const [selectedPos, setSelectedPos] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);

    const KAKAO_MAP_SDK =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';

    useEffect(() => {
        const script = document.createElement('script');
        script.src = KAKAO_MAP_SDK;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const map = new kakao.maps.Map(mapDiv.current, {
                    center: new kakao.maps.LatLng(36.1460531, 128.39583),
                    level: 4,
                });
                mapRef.current = map;
                psRef.current = new kakao.maps.services.Places();

                kakao.maps.event.addListener(map, 'click', (e) => {
                    placeMarker(e.latLng.getLat(), e.latLng.getLng());
                });
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const placeMarker = (lat, lng) => {
        const kakao = window.kakao;
        const map = mapRef.current;
        if (!map) return;

        if (markerRef.current) markerRef.current.setMap(null);

        const position = new kakao.maps.LatLng(lat, lng);
        markerRef.current = new kakao.maps.Marker({ position, map });
        map.setCenter(position);
        setSelectedPos({ lat, lng });
    };

    // 검색어가 바뀔 때 자동완성
    const handleSearchChange = (e) => {
        const kw = e.target.value;
        setKeyword(kw);
        if (!kw.trim() || !psRef.current) {
            setPlaces([]);
            return;
        }
        psRef.current.keywordSearch(kw, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setPlaces(data);
            } else {
                setPlaces([]);
            }
        });
    };

    // 자동완성 아이템 클릭
    const handleSelectPlace = (place) => {
        placeMarker(place.y, place.x);
        setKeyword(place.place_name);
        setPlaces([]);
    };

    // 내 위치 버튼
    const handleMyLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => placeMarker(coords.latitude, coords.longitude),
            () => alert('위치 정보를 가져올 수 없습니다.')
        );
    };

    const handleBack = () => navigate(-1);
    const handleConfirm = () => {
        if (!selectedPos) return;
        navigate('/report-found', {
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
                    <IoIosArrowBack size={28} />
                </div>

                <input
                    className="ls-search-input"
                    type="text"
                    placeholder="장소를 검색하세요"
                    value={keyword}
                    onChange={handleSearchChange}
                />
                <MdMyLocation
                    className="ls-my-location-btn"
                    size={24}
                    onClick={handleMyLocation}
                    title="내 위치로 이동"
                />

                {places.length > 0 && (
                    <ul className="ls-suggestion-list">
                        {places.map((p) => (
                            <li key={p.id} className="ls-suggestion-item" onClick={() => handleSelectPlace(p)}>
                                {p.place_name}
                            </li>
                        ))}
                    </ul>
                )}
            </header>

            <div className="map-wrapper">
                <div ref={mapDiv} className="ls-map" />
            </div>

            <button className="ls-confirm-btn" onClick={handleConfirm} disabled={!selectedPos}>
                선택 완료
            </button>
        </div>
    );
}
