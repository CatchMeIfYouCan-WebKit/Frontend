// src/pages/LocationSelect.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../LocationSelect.css';
import { MdMyLocation } from "react-icons/md";


export default function LocationSelect() {
    const navigate = useNavigate();
    const location = useLocation();

    const mapDiv = useRef(null);
    const markerRef = useRef(null);
    const mapRef = useRef(null);
    const psRef = useRef(null);

    const [selectedPos, setSelectedPos] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);

    const KAKAO_MAP_SDK =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services,clusterer';

    useEffect(() => {
        // 1) SDK 로드
        const script = document.createElement('script');
        script.src = KAKAO_MAP_SDK;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            // 2) SDK 초기화
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const map = new kakao.maps.Map(mapDiv.current, {
                    center: new kakao.maps.LatLng(37.5665, 126.978),
                    level: 4,
                });
                mapRef.current = map;

                // Places 서비스
                psRef.current = new kakao.maps.services.Places();

                // 클릭 시 마커 표시
                kakao.maps.event.addListener(map, 'click', (e) => {
                    placeMarker(e.latLng.getLat(), e.latLng.getLng());
                });
            });
        };

        return () => document.head.removeChild(script);
    }, []);

    // 마커 생성/이전 마커 제거
    const placeMarker = (lat, lng) => {
        const kakao = window.kakao;
        const map = mapRef.current;
        if (!map) return;

        if (markerRef.current) {
            markerRef.current.setMap(null);
        }
        const position = new kakao.maps.LatLng(lat, lng);
        markerRef.current = new kakao.maps.Marker({
            position,
            map,
        });
        map.setCenter(position);
        setSelectedPos({ lat, lng });
    };

    // 검색어 변경 시 자동완성 요청
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

    // 추천 장소 클릭
    const handleSelectPlace = (place) => {
        placeMarker(place.y, place.x);
        setKeyword(place.place_name);
        setPlaces([]);
    };

    // 내 위치 버튼
    const handleMyLocation = () => {
        if (!navigator.geolocation || !window.kakao) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                placeMarker(coords.latitude, coords.longitude);
            },
            () => alert('위치 정보를 가져올 수 없습니다.')
        );
    };

    const handleBack = () => navigate(-1);
    const handleConfirm = () => {
        if (!selectedPos) return;
// <<<<<<< HEAD

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
// =======
//         navigate('/adoptionpost/add/details', {
//             replace: true,
//             state: {
//                 ...location.state,
//                 latitude: selectedPos.lat,
//                 longitude: selectedPos.lng,
//             },
// >>>>>>> 00cb71d8ec8a449f25e8da3e72b1cba1e48df464
        });
    };



    return (
        <div className="location-select">
            <header className="ls-header">
                {/* 검색창 + 내 위치 버튼 */}
                <div className="ls-search-bar">
                    <div className="ls-back" onClick={handleBack}>
                        <IoIosArrowBack size={28} />
                    </div>
                    <input
                        type="text"
                        placeholder="장소를 검색하세요"
                        value={keyword}
                        onChange={handleSearchChange}
                        className="ls-search-input"
                    />
                    <MdMyLocation onClick={handleMyLocation} className="ls-my-location-btn"/>

                    {places.length > 0 && (
                        <ul className="ls-suggestion-list">
                            {places.map((p) => (
                                <li key={p.id} onClick={() => handleSelectPlace(p)} className="ls-suggestion-item">
                                    {p.place_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </header>

            <div ref={mapDiv} className="ls-map" />

            <div className="ls-confirm-btn" onClick={handleConfirm} disabled={!selectedPos}>
                선택 완료
            </div>
        </div>
    );
}
