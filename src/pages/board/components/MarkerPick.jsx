// src/components/MarkerPick.jsx
// 위치선택하기 버튼을 누르면 alert로 위치가 가 뜨는데 alert 지우고 selectedAddress 이 값을 주소로 넘겨주면됨
import React, { useEffect, useRef, useState } from 'react';
import mylocation from '../../../assets/my-location.svg';
import '../MarkerPick.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function MarkerPick() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const psRef = useRef(null);
    const geocoderRef = useRef(null);
    const markerRef = useRef(null);
    const timeoutRef = useRef(null);

    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [currentPos, setCurrentPos] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);

    useEffect(() => {
        // 마운트 시 현재 위치 저장
        navigator.geolocation?.getCurrentPosition(
            ({ coords }) => setCurrentPos({ lat: coords.latitude, lng: coords.longitude }),
            () => {}
        );

        // Kakao SDK 로드
        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const maps = window.kakao.maps;
                geocoderRef.current = new maps.services.Geocoder();

                const map = new maps.Map(mapContainer.current, {
                    center: new maps.LatLng(36.1460531, 128.39583),
                    level: 3,
                    draggable: true,
                });
                mapRef.current = map;
                psRef.current = new maps.services.Places();

                let pressStart = 0;
                maps.event.addListener(map, 'mousedown', () => {
                    pressStart = Date.now();
                });
                maps.event.addListener(map, 'mouseup', (e) => {
                    if (Date.now() - pressStart >= 500) {
                        placeMarker(e.latLng);
                    }
                });
            });
        };
        document.head.appendChild(script);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    // 두 좌표 간 거리 계산 (미터 단위)
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = d => (d * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    const placeMarker = (latLng) => {
        const maps = window.kakao.maps;
        if (markerRef.current) {
            markerRef.current.setMap(null);
            clearTimeout(timeoutRef.current);
        }
        const marker = new maps.Marker({
            position: latLng,
            map: mapRef.current,
        });
        markerRef.current = marker;
        setSelectedPosition(latLng);
        setSelectedAddress('…주소를 조회중입니다');

        // 주소 가져오기
        geocoderRef.current.coord2Address(
            latLng.getLng(), latLng.getLat(),
            (result, status) => {
                if (status === maps.services.Status.OK) {
                    setSelectedAddress(result[0].address.address_name);
                } else {
                    setSelectedAddress('주소를 불러올 수 없습니다');
                }
            }
        );

        timeoutRef.current = setTimeout(() => {
            marker.setMap(null);
            markerRef.current = null;
            setSelectedAddress('');
            setSelectedPosition(null);
        }, 5000);
    };

    const handleMyLocation = () => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const maps = window.kakao.maps;
                const pos = new maps.LatLng(coords.latitude, coords.longitude);
                mapRef.current.setCenter(pos);
                placeMarker(pos);
            },
            () => alert('위치 정보를 가져올 수 없습니다.')
        );
    };

    const handleChange = (e) => {
        const v = e.target.value;
        setKeyword(v);
        if (!psRef.current || !v.trim()) {
            setPlaces([]);
            return;
        }
        psRef.current.keywordSearch(v, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                // 검색 결과에 거리 필드 추가
                const list = data.slice(0, 10).map(p => ({
                    ...p,
                    distance: currentPos
                        ? getDistance(currentPos.lat, currentPos.lng, p.y, p.x)
                        : null
                }));
                setPlaces(list);
                setSelectedIndex(-1);
            } else {
                setPlaces([]);
            }
        });
    };

    const handleKeyDown = (e) => {
        if (!places.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => (i + 1) % places.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => (i - 1 + places.length) % places.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const sel = selectedIndex >= 0 ? selectedIndex : 0;
            selectPlace(places[sel]);
        }
    };

    const selectPlace = (place) => {
        const maps = window.kakao.maps;
        const latLng = new maps.LatLng(place.y, place.x);
        mapRef.current.setCenter(latLng);
        placeMarker(latLng);
        setKeyword('');
        setPlaces([]);
    };

    const handleConfirm = () => {
        alert(`선택된 위치:\n${selectedAddress}`);
    };

    return (
        <div className="markerpick-wrapper">
            <div className="marker-search-ui">
                <div className="marker-search-input-wrapper">
                    <input
                        className={`marker-search-input ${keyword ? 'with-clear' : ''}`}
                        placeholder="주소를 검색하세요"
                        value={keyword}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    {keyword && (
                        <button className="marker-clear-button" onClick={() => setKeyword('')}>
                            ×
                        </button>
                    )}
                </div>
                <ul className="marker-search-result-list">
                    {places.map((place, idx) => {
                        const distText = place.distance != null
                            ? place.distance < 1000
                                ? `${place.distance}m`
                                : `${(place.distance / 1000).toFixed(1)}km`
                            : '';
                        return (
                            <li
                                key={place.id}
                                className={idx === selectedIndex ? 'active' : ''}
                                onClick={() => selectPlace(place)}
                            >
                                <div className="icon-title">
                                    <FaMapMarkerAlt size={20} style={{width:'50px'}}/>
                                    <span className="marker-title">{place.place_name}</span>
                                </div>
                                <div className="distance-address">
                                    <span className="dist" style={{width:'50px',textAlign:'center'}}>{distText}</span>
                                    <span className="marker-address">
                                        {place.road_address_name || place.address_name}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <button className="marker-my-location-btn" onClick={handleMyLocation}>
                <img src={mylocation} alt="location" />
            </button>

            {selectedAddress && (
                <div className="marker-location-info">
                    <p className="marker-address-text">{selectedAddress}</p>
                    <button className="marker-confirm-btn" onClick={handleConfirm}>
                        위치 선택하기
                    </button>
                </div>
            )}

            <div ref={mapContainer} className="markerpick-map" />
        </div>
    );
}
