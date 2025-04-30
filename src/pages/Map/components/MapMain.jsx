// MapMain.jsx
import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../../shared/Footer/Footer';
import tag from '../../../assets/tag.svg';
import missing from '../../../assets/missing.svg';
import missing2 from '../../../assets/missing2.svg';
import sighting from '../../../assets/sighting.svg';
import hospital from '../../../assets/hospital.svg';
import mylocation from '../../../assets/my-location.svg';
import testdog from '../../../assets/testdog.png';

import { TbHomeShield } from 'react-icons/tb';
import { GoChevronLeft } from 'react-icons/go';
import { TiDelete } from 'react-icons/ti';
import '../MapMain.css';
import BottomSheet from './BottomSheet';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function MapMain() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const psRef = useRef(null);

    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [currentPos, setCurrentPos] = useState(null);

    // 바텀시트 추가
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const toggleSheet = () => setIsSheetOpen((open) => !open);

    // 1) 마운트 시: 내 위치 + Kakao SDK 로드
    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            ({ coords }) => setCurrentPos({ lat: coords.latitude, lng: coords.longitude }),
            () => console.warn('위치 권한 없음')
        );

        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const kakao = window.kakao.maps;
                const map = new kakao.Map(mapContainer.current, {
                    center: new kakao.LatLng(36.1460531, 128.39583),
                    level: 3,
                });
                mapRef.current = map;
                psRef.current = new window.kakao.maps.services.Places();
            });
        };
        document.head.appendChild(script);
    }, []);

    // 2) 거리 계산 (Haversine)
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (d) => (d * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1),
            dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    // 3) 검색 자동완성 + 거리 부여
    const handleChange = (e) => {
        const v = e.target.value;
        setKeyword(v);
        if (!psRef.current || !v.trim()) return setPlaces([]);

        psRef.current.keywordSearch(v, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const list = data.slice(0, 10).map((p) => ({
                    ...p,
                    distance: currentPos ? getDistance(currentPos.lat, currentPos.lng, p.y, p.x) : null,
                }));
                setPlaces(list);
                setSelectedIndex(-1);
            } else {
                setPlaces([]);
            }
        });
    };

    // 4) 키보드 내비
    const handleKeyDown = (e) => {
        if (!places.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((i) => (i + 1) % places.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((i) => (i - 1 + places.length) % places.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const target = selectedIndex >= 0 ? places[selectedIndex] : places[0];
            handleSelectPlace(target);
        }
    };

    // 5) 검색 결과 선택 → 지도 센터 이동만
    const handleSelectPlace = (place) => {
        const loc = new window.kakao.maps.LatLng(place.y, place.x);
        mapRef.current.setCenter(loc);
        setIsSearchMode(false);
        setKeyword('');
        setPlaces([]);
    };

    // 6) 입력창 클리어
    const handleClear = () => {
        setKeyword('');
        setPlaces([]);
        setSelectedIndex(-1);
    };

    // 7) 내 위치 이동 → 지도 센터 이동만
    const moveToMyLocation = () => {
        if (!mapRef.current) return;
        navigator.geolocation?.getCurrentPosition(
            ({ coords }) => {
                const loc = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
                mapRef.current.setCenter(loc);
            },
            () => alert('위치 정보를 가져올 수 없습니다.')
        );
    };

    return (
        <div className="mappage-container">
            {/* 지도 */}
            <div ref={mapContainer} className="map-box" />

            {/* 기본 검색 UI */}
            {!isSearchMode ? (
                <form className="search-ui" onSubmit={(e) => e.preventDefault()}>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="검색할 주소를 입력하세요."
                            className={`search-input${keyword ? ' with-clear' : ''}`}
                            value={keyword}
                            onFocus={() => setIsSearchMode(true)}
                            readOnly
                        />
                        {keyword && (
                            <button className="clear-button" onClick={handleClear}>
                                <TiDelete size={24} style={{ color: 'gray' }} />
                            </button>
                        )}
                        <div className="location-wrap" onClick={moveToMyLocation}>
                            <img src={mylocation} alt="내 위치" className="location-img" />
                        </div>
                        <button className="input-icon-button">
                            <img src={tag} alt="filter" className="tag-icon" />
                        </button>
                    </div>
                    <div className="tag-container">
                        <span className="tag-wrap1">
                            <img src={missing} alt="" className="tag-img" />
                            실종
                        </span>
                        <span className="tag-wrap1">
                            <img src={sighting} alt="" className="tag-img" />
                            목격
                        </span>
                        <span className="tag-wrap2">
                            <TbHomeShield className="tag-img" />
                            보호소
                        </span>
                        <span className="tag-wrap1">
                            <img src={hospital} alt="" className="tag-img" />
                            병원
                        </span>
                        <span className="tag-wrap3">품종</span>
                        <span className="tag-wrap3">털색</span>
                    </div>
                </form>
            ) : (
                <div className="search-overlay">
                    <div className="search-overlay-content">
                        <div className="search-input-wrapper">
                            <button className="back-button" onClick={() => setIsSearchMode(false)}>
                                <GoChevronLeft size={30} />
                            </button>
                            <input
                                autoFocus
                                type="text"
                                placeholder="주소를 검색하세요"
                                className={`search-input${keyword ? ' with-clear' : ''}`}
                                value={keyword}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                            {keyword && (
                                <button className="clear-button" onClick={handleClear}>
                                    <TiDelete size={24} style={{ color: 'gray' }} />
                                </button>
                            )}
                        </div>
                        <ul className="search-result-list">
                            {places.map((place, idx) => {
                                const distText =
                                    place.distance < 1000
                                        ? `${place.distance}m`
                                        : `${(place.distance / 1000).toFixed(1)}km`;
                                return (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelectPlace(place)}
                                        className={idx === selectedIndex ? 'active' : ''}
                                    >
                                        <div className="search-result-distance">
                                            <div>
                                                <FaMapMarkerAlt size={23} style={{ marginBottom: '4px' }} />
                                            </div>
                                            {distText}
                                        </div>
                                        <div className="search-result-details">
                                            <div className="search-result-title">{place.place_name}</div>
                                            <div className="search-result-address">
                                                {place.road_address_name || place.address_name}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}

            <BottomSheet initialPercent={0.11} maxPercent={0.89} minHeight={80}>
                <div>
                    <div className="list-wrap">
                        <div className='list-left'>
                            <div className="state">
                                <img src={missing2} alt="missing2" className="sheet-img" />
                                실종
                            </div>
                            <div className="list-location">
                                경상북도 구미시 대학로 61
                                <p>2025년 4월 15일 오전 9:00 접수</p>
                            </div>
                        </div>
                        <div className="list-img">
                            <img src={testdog} alt="testdog" className="sheet-nailimg" />
                        </div>
                        <hr />
                    </div>
                    <div className="list-wrap">
                        <div className='list-left'>
                            <div className="state">
                                <img src={missing2} alt="missing2" className="sheet-img" />
                                실종
                            </div>
                            <div className="list-location">
                                경상북도 구미시 대학로 61
                                <p>2025년 4월 15일 오전 9:00 접수</p>
                            </div>
                        </div>
                        <div className="list-img">
                            <img src={testdog} alt="testdog" className="sheet-nailimg" />
                        </div>
                        <hr />
                    </div>
                </div>
            </BottomSheet>

            <Footer />
        </div>
    );
}
