import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../../shared/Footer/Footer';
import tag from '../../../assets/tag.svg';
import missing from '../../../assets/missing.svg';
import sighting from '../../../assets/sighting.svg';
import hospital from '../../../assets/hospital.svg';
import mylocation from '../../../assets/my-location.svg';
import { TbHomeShield } from 'react-icons/tb';
import '../MapMain.css';

export default function MapMain() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const psRef = useRef(null);
    const markersRef = useRef([]);

    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSearchMode, setIsSearchMode] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const map = new window.kakao.maps.Map(mapContainer.current, {
                    center: new window.kakao.maps.LatLng(36.1460531, 128.39583),
                    level: 3,
                });
                mapRef.current = map;
                psRef.current = new window.kakao.maps.services.Places();
            });
        };
        document.head.appendChild(script);
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setKeyword(value);

        if (!psRef.current || !value.trim()) {
            setPlaces([]);
            return;
        }

        psRef.current.keywordSearch(value, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setPlaces(data.slice(0, 10));
                setSelectedIndex(-1);
            } else {
                setPlaces([]);
            }
        });
    };

    const handleKeyDown = (e) => {
        if (places.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % places.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + places.length) % places.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const target = selectedIndex >= 0 ? places[selectedIndex] : places[0];
            handleSelectPlace(target);
        }
    };

    const handleSelectPlace = (place) => {
        if (!mapRef.current || !place) return;

        const loc = new window.kakao.maps.LatLng(place.y, place.x);
        mapRef.current.setCenter(loc);

        const marker = new window.kakao.maps.Marker({
            position: loc,
            map: mapRef.current,
        });

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [marker];

        setIsSearchMode(false);
        setKeyword('');
        setPlaces([]);
    };

    const moveToMyLocation = () => {
        if (!mapRef.current) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const loc = new window.kakao.maps.LatLng(latitude, longitude);
                    mapRef.current.setCenter(loc);

                    const marker = new window.kakao.maps.Marker({
                        position: loc,
                        map: mapRef.current,
                    });

                    markersRef.current.forEach((m) => m.setMap(null));
                    markersRef.current = [marker];
                },
                (error) => {
                    alert('위치 정보를 가져올 수 없습니다.');
                    console.error(error);
                }
            );
        } else {
            alert('Geolocation을 지원하지 않는 브라우저입니다.');
        }
    };

    return (
        <div className="mappage-container">
            <div ref={mapContainer} className="map-box" />

            {!isSearchMode && (
                <form className="search-ui" onSubmit={(e) => e.preventDefault()}>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="검색할 주소를 입력하세요."
                            className="search-input"
                            value={keyword}
                            onFocus={() => setIsSearchMode(true)}
                            readOnly
                        />
                        <button type="button" className="input-icon-button">
                            <img src={tag} alt="filter" className="tag-icon" />
                        </button>
                    </div>

                    <div className="tag-container">
                        <span className="tag-wrap">
                            <img src={missing} alt="missing" className="tag-img" />
                            실종
                        </span>
                        <span className="tag-wrap">
                            <img src={sighting} alt="sighting" className="tag-img" />
                            목격
                        </span>
                        <span className="tag-wrap">
                            <TbHomeShield className="tag-img" />
                            보호소
                        </span>
                        <span className="tag-wrap">
                            <img src={hospital} alt="hospital" className="tag-img" />
                            병원
                        </span>
                        <span className="tag-wrap">품종</span>
                        <span className="tag-wrap">털색</span>
                    </div>
                    <div className="location-wrap" onClick={moveToMyLocation}>
                        <img src={mylocation} alt="mylocation" className="location-img" />
                    </div>
                </form>
            )}

            {isSearchMode && (
                <div className="search-overlay">
                    <div className="search-overlay-content">
                        <div className="search-input-wrapper">
                            <button onClick={() => setIsSearchMode(false)}>&larr;</button>
                            <input
                                autoFocus
                                type="text"
                                placeholder="주소를 검색하세요"
                                className="search-input"
                                value={keyword}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <ul className="search-result-list">
                            {places.map((place, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => handleSelectPlace(place)}
                                    className={idx === selectedIndex ? 'active' : ''}
                                >
                                    <div className="search-result-title">{place.place_name}</div>
                                    <div className="search-result-address">
                                        {place.road_address_name || place.address_name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
