// MapMain.jsx
import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../../shared/Footer/Footer';
import tag from '../../../assets/tag.svg';
import missing from '../../../assets/missing.svg'; // 실종상태 이미지 1
import missing2 from '../../../assets/missing2.svg'; // 실종상태 이미지 2
import sighting from '../../../assets/sighting.svg'; // 목격 이미지
import sighting2 from '../../../assets/sighting2.svg'; // 목격 이미지2
import hospital from '../../../assets/hospital.svg';
import hospital2 from '../../../assets/hospital2.svg';
import shelter from '../../../assets/shelter.svg';
import shelter2 from '../../../assets/shelter2.svg';
import mylocation from '../../../assets/my-location.svg';
import testdog from '../../../assets/testdog.png';
import change from '../../../assets/change.svg';
import { useNavigate } from 'react-router-dom';
import { TbHomeShield } from 'react-icons/tb';
import { GoChevronLeft } from 'react-icons/go';
import { TiDelete } from 'react-icons/ti';
import '../MapMain.css';
import BottomSheet from './BottomSheet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export default function MapMain() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const psRef = useRef(null);
    const markersRef = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    // 검색 상태
    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [currentPos, setCurrentPos] = useState(null);

    // 리스트 최신순 오래된순 상태
    const [listChange, setListChange] = useState(true);

    // 필터 태그 상태
    const [missFiltering, setMissFiltering] = useState(true);
    const [seeFiltering, setSeeFiltering] = useState(true);
    const [shelterFiltering, setShelterFiltering] = useState(false);
    const [hospitalFiltering, setHospitalFiltering] = useState(false);
    const [colorFiltering, setColorFiltering] = useState('');
    const [breedFiltering, setBreedFiltering] = useState('');

    // DB에서 받아온 게시글
    const [posts, setPosts] = useState([]);

    // 1) 마운트 시: 내 위치 조회 + Kakao SDK 로드 + 지도 초기화
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

    // 백엔드 만들어 지면 주석해제 -- 실종 목격 보호소 병원 필터링 ---------
    // useEffect(() => {
    //   navigator.geolocation?.getCurrentPosition(
    //     ({ coords }) => setCurrentPos({ lat: coords.latitude, lng: coords.longitude }),
    //     () => console.warn('위치 권한 없음')
    //   );

    //   const script = document.createElement('script');
    //   script.src =
    //     'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
    //   script.async = true;
    //   script.onload = () => {
    //     window.kakao.maps.load(() => {
    //       const kakao = window.kakao.maps;
    //       const map = new kakao.Map(mapContainer.current, {
    //         center: new kakao.maps.LatLng(36.1460531, 128.39583),
    //         level: 3,
    //       });
    //       mapRef.current = map;
    //       psRef.current = new kakao.maps.services.Places();
    //     });
    //   };
    //   document.head.appendChild(script);
    // }, []);
    // // 2) 필터 상태 변경 시마다 서버에서 posts 불러오기
    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         const res = await fetch(
    //             `/api/posts?missing=${missFiltering}` +
    //                 `&sighting=${seeFiltering}` +
    //                 `&shelter=${shelterFiltering}` +
    //                 `&hospital=${hospitalFiltering}`
    //         );
    //         if (!res.ok) return console.error('posts fetch error', res.status);
    //         const data = await res.json();
    //         // data: [{ id, created_at, image_url, location: { lat, lng } }, …]
    //         setPosts(data);
    //     };
    //     fetchPosts();
    // }, [missFiltering, seeFiltering, shelterFiltering, hospitalFiltering]);

    // // 3) posts가 바뀔 때마다 지도 마커 업데이트
    // useEffect(() => {
    //     // 기존 마커 제거
    //     markersRef.current.forEach((marker) => marker.setMap(null));
    //     markersRef.current = [];

    //     // 새로운 마커 생성
    //     posts.forEach((post) => {
    //         const { lat, lng } = post.location;
    //         const marker = new window.kakao.maps.Marker({
    //             position: new window.kakao.maps.LatLng(lat, lng),
    //             map: mapRef.current,
    //         });

    //         const infowindow = new window.kakao.maps.InfoWindow({
    //             content: `
    //       <div style="padding:5px;">
    //         <strong>${new Date(post.created_at).toLocaleDateString()}</strong><br/>
    //         <img src="${post.image_url}" width="100"/><br/>
    //         위치: (${lat.toFixed(4)}, ${lng.toFixed(4)})
    //       </div>
    //     `,
    //         });
    //         window.kakao.maps.event.addListener(marker, 'click', () => {
    //             infowindow.open(mapRef.current, marker);
    //         });

    //         markersRef.current.push(marker);
    //     });
    // }, [posts]);
    //---------------------------------------------------------------------

    // Haversine 거리 계산
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (d) => (d * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    // 검색 자동완성
    const handleChange = (e) => {
        const v = e.target.value;
        setKeyword(v);
        if (!psRef.current || !v.trim()) {
            setPlaces([]);
            return;
        }
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

    // 키보드 내비게이션
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

    // 검색 결과 선택
    const handleSelectPlace = (place) => {
        const loc = new window.kakao.maps.LatLng(place.y, place.x);
        mapRef.current.setCenter(loc);
        setIsSearchMode(false);
        setKeyword('');
        setPlaces([]);
    };

    // 입력창 초기화
    const handleClear = () => {
        setKeyword('');
        setPlaces([]);
        setSelectedIndex(-1);
    };

    // 내 위치로 이동
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

    useEffect(() => {
        if (location.state) {
            const { missFiltering, seeFiltering, shelterFiltering, hospitalFiltering, breedFiltering, colorFiltering } =
                location.state;
            setMissFiltering(missFiltering);
            setSeeFiltering(seeFiltering);
            setShelterFiltering(shelterFiltering);
            setHospitalFiltering(hospitalFiltering);
            setBreedFiltering(breedFiltering);
            setColorFiltering(colorFiltering);
        }
    }, [location.state]);

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
                        <button
                            className="input-icon-button"
                            type="button"
                            onClick={() => {
                                navigate('/filters', {
                                    state: {
                                        missFiltering,
                                        seeFiltering,
                                        shelterFiltering,
                                        hospitalFiltering,
                                        breedFiltering,
                                        colorFiltering,
                                    },
                                });
                            }}
                        >
                            <img src={tag} alt="filter" className="tag-icon" />
                        </button>
                    </div>
                    <div className="tag-container">
                        <span
                            className={`tag-wrap1 ${missFiltering ? 'activeM' : ''}`}
                            onClick={() => setMissFiltering((prev) => !prev)}
                        >
                            <img src={missFiltering ? missing2 : missing} alt="실종" className="tag-img" />
                            실종
                        </span>

                        <span
                            className={`tag-wrap1 ${seeFiltering ? 'activeW' : ''}`}
                            onClick={() => setSeeFiltering((prev) => !prev)}
                        >
                            <img src={seeFiltering ? sighting2 : sighting} alt="목격" className="tag-img" />
                            목격
                        </span>

                        <span
                            className={`tag-wrap2 ${shelterFiltering ? 'activeS' : ''}`}
                            onClick={() => setShelterFiltering((prev) => !prev)}
                        >
                            <img src={shelterFiltering ? shelter : shelter2} alt="보호소" className="tag-img" />
                            보호소
                        </span>

                        <span
                            className={`tag-wrap1 ${hospitalFiltering ? 'activeH' : ''}`}
                            onClick={() => setHospitalFiltering((prev) => !prev)}
                        >
                            <img src={hospitalFiltering ? hospital2 : hospital} alt="병원" className="tag-img" />
                            병원
                        </span>

                        <span className={breedFiltering == '' ? 'tag-wrap3' : 'tag-wrap3-select'}>품종</span>
                        <span className={colorFiltering == '' ? 'tag-wrap3' : 'tag-wrap3-select'}>털색</span>
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

            <BottomSheet initialPercent={0.11} maxPercent={0.928} minHeight={100}>
                <div>
                    <div className="list-header">
                        <div className="post-count">{}개의 게시글</div>
                        <div
                            className={`sort-toggle ${!listChange ? 'reversed' : ''}`}
                            onClick={() => setListChange((prev) => !prev)}
                        >
                            {listChange ? '최근작성순' : '오래된 순'}
                            <img src={change} alt="변경" />
                        </div>
                    </div>
                    {/* 리스트 백엔드에서 불라와서 밑에 형식으로 다 띄우면됨 클릭 시 게시글로 보내면 됨 */}
                    <div className="list-wrap" onClick={() => navigate('')}>
                        <div className="list-left">
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
                        <div className="list-left">
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
