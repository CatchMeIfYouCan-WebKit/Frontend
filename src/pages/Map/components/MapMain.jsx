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
import customMarkerImg from '../../../assets/custom-marker.png'; // 보호소 마커 이미지
import dog1 from '../../../assets/민규강아지.jpeg';
import dog2 from '../../../assets/수완강아지.jpeg';
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

    // 마커 상태
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [markerLoadStates, setMarkerLoadStates] = useState({
        missing: false,
        witness: false,
        shelter: false,
        hospital: false,
    });

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
    const [missingPosts, setMissingPosts] = useState([]);
    const [witnessPosts, setWitnessPosts] = useState([]);
    const [hospitals, setHospitals] = useState([]); // 병원 API 결과용
    const [shelterAnnouncements, setShelterAnnouncements] = useState([]); // 보호소 API 결과용
    // 1) 마운트 시: 내 위치 조회 + Kakao SDK 로드 + 지도 초기화
    useEffect(() => {
        // 1) 내 위치 조회
        navigator.geolocation?.getCurrentPosition(
            ({ coords }) => setCurrentPos({ lat: coords.latitude, lng: coords.longitude }),
            () => console.warn('위치 권한 없음')
        );

        // 2) 실종 게시글 API 호출
        fetch('/api/posts/missing/missing-posts')
            .then((res) => res.json())
            .then((data) => {
                setMissingPosts(data);
            })
            .catch((err) => console.error('실종 API 에러', err));
        // 3) 목격 게시글 API 호출
        fetch('/api/posts/witness/witness-posts')
            .then((res) => res.json())
            .then((data) => {
                setWitnessPosts(data);
            })
            .catch((err) => console.error('목격 API 에러', err));

        // 5) 보호소 공고 API 호출
        fetch('/api/map/shelters')
            .then((res) => res.json())
            .then((data) => {
                setShelterAnnouncements(data);
            })
            .catch((err) => console.error('보호소 API 에러', err));

        // 4) 병원 목록 API 호출
        fetch('/api/map/hospitals')
            .then((res) => res.json())
            .then((data) => {
                setHospitals(data);
            })
            .catch((err) => console.error('병원 API 에러', err));

        // 2) Kakao SDK 로드
        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const map = new kakao.maps.Map(mapContainer.current, {
                    center: new kakao.maps.LatLng(36.1460531, 128.39583),
                    level: 3,
                });
                mapRef.current = map;
                console.log('🗺️ Kakao 지도 생성됨:', map);
                // Places 서비스
                psRef.current = new kakao.maps.services.Places();

                // 기존 선택 해제 (맵 빈 공간 클릭 시)
                kakao.maps.event.addListener(map, 'click', () => {
                    setSelectedMarker(null);
                });

                // 마커 배열 초기화
                // markersRef.current = [];

            });
        };
        document.head.appendChild(script);
    }, []);

    //실종 마커 생성
    useEffect(() => {
        if (!mapRef.current || missingPosts.length === 0) return;

        markersRef.current = markersRef.current.filter(({ type, overlay }) => {
            if (type === 'missing') {
                overlay.setMap(null);
                return false;
            }
            return true;
        });

        const markerPromises = missingPosts
            .filter((post) => post.postType === 'missing')
            .map((post) => {
                return new Promise((resolve) => {
                    const div = document.createElement('div');
                    div.className = 'custom-marker-container missing';
                    div.innerHTML = `
                        <div class="marker-circle">
                            <img src="${post.photoUrl}" class="marker-img" />
                        </div>
                        <div class="marker-label">실종</div>
                    `;

                    div.addEventListener('click', () => {
                        setSelectedMarker({
                            type: 'missing',
                            data: {
                                imageUrl: post.photoUrl,
                                location: post.missingLocation,
                                date: new Date(post.missingDatetime).toLocaleString(),
                            },
                        });
                    });

                    new kakao.maps.services.Geocoder().addressSearch(post.missingLocation, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                            const overlay = new kakao.maps.CustomOverlay({
                                position: coords,
                                content: div,
                                map: missFiltering ? mapRef.current : null,
                                yAnchor: 1,
                            });

                            markersRef.current.push({ type: 'missing', overlay });
                            console.log('✅ 실종 마커 생성 완료:', post.missingLocation);
                        } else {
                            console.warn('❌ 주소 변환 실패:', post.missingLocation);
                        }
                        resolve();
                    });
                });
            });

        Promise.all(markerPromises).then(() => {
            setMarkerLoadStates(prev => ({ ...prev, missing: true }));
        });
    }, [missingPosts, mapRef.current]);

    //overlay 
    useEffect(() => {
        if (!mapRef.current || witnessPosts.length === 0) return;

        // 1. 기존 목격 마커 제거
        markersRef.current = markersRef.current.filter(({ type, overlay }) => {
            if (type === 'witness') {
                overlay.setMap(null);
                return false;
            }
            return true;
        });

        // 2. 목격 마커 비동기 생성
        const markerPromises = witnessPosts
            .filter((post) => post.postType === 'witness') // ✅ 목격 게시글만 필터링
            .map((post) => {
                return new Promise((resolve) => {
                    const div = document.createElement('div');
                    div.className = 'custom-marker-container sighting'; // ✅ 클래스명도 통일
                    div.innerHTML = `
                        <div class="marker-circle">
                            <img src="${post.photoUrl}" class="marker-img" />
                        </div>
                        <div class="marker-label">목격</div>
                    `;

                    div.addEventListener('click', () => {
                        setSelectedMarker({
                            type: 'sighting',
                            data: {
                                imageUrl: post.photoUrl,
                                location: post.witnessLocation,
                                date: new Date(post.witnessDatetime).toLocaleString(),
                            },
                        });
                    });

                    new kakao.maps.services.Geocoder().addressSearch(post.witnessLocation, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                            const overlay = new kakao.maps.CustomOverlay({
                                position: coords,
                                content: div,
                                map: seeFiltering ? mapRef.current : null,
                                yAnchor: 1,
                            });

                            markersRef.current.push({ type: 'sighting', overlay });
                            console.log('✅ 목격 마커 생성 완료:', post.witnessLocation);
                        } else {
                            console.warn('❌ 주소 변환 실패 (목격):', post.witnessLocation);
                        }
                        resolve();
                    });
                });
            });

        Promise.all(markerPromises).then(() => {
            setMarkerLoadStates(prev => ({ ...prev, witness: true }));
        });
    }, [witnessPosts, mapRef.current]);

    useEffect(() => {
        if (!mapRef.current || shelterAnnouncements.length === 0) return;

        // 1. 기존 보호소 마커 제거
        markersRef.current = markersRef.current.filter(({ type, overlay }) => {
            if (type === 'shelter') {
                overlay.setMap(null);
                return false;
            }
            return true;
        });

        // 2. 보호소 마커 생성
        const markerPromises = shelterAnnouncements.map((shelter) => {
            return new Promise((resolve) => {
                const div = document.createElement('div');
                div.className = 'custom-marker-div shelter';
                div.innerHTML = `<img src="${customMarkerImg}" class="custom-marker-img" />`;

                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setSelectedMarker({
                        type: 'shelter',
                        data: {
                            imageUrl: shelter.animalSummaries.map((a) => a.imageUrl).slice(0, 4), // 최대 4개
                            shelterName: shelter.shelterName,
                            location: shelter.address,
                            callNumber: shelter.phone ?? '전화번호 없음',
                            fullShelter: shelter
                        },
                    });
                });

                new kakao.maps.services.Geocoder().addressSearch(shelter.address, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        const overlay = new kakao.maps.CustomOverlay({
                            position: coords,
                            content: div,
                            map: shelterFiltering ? mapRef.current : null,
                            yAnchor: 1,
                        });

                        markersRef.current.push({ type: 'shelter', overlay });
                        console.log('✅ 보호소 마커 생성 완료:', shelter.shelterName);
                    } else {
                        console.warn('❌ 주소 변환 실패 (보호소):', shelter.address);
                    }
                    resolve();
                });
            });
        });

        Promise.all(markerPromises).then(() => {
            setMarkerLoadStates(prev => ({ ...prev, shelter: true }));
        });
    }, [shelterAnnouncements, mapRef.current]);

    useEffect(() => {
        if (!mapRef.current || hospitals.length === 0) return;

        // 1. 기존 병원 마커 제거
        markersRef.current = markersRef.current.filter(({ type, overlay }) => {
            if (type === 'hospital') {
                overlay.setMap(null);
                return false;
            }
            return true;
        });

        // 2. 병원 마커 비동기 생성
        const markerPromises = hospitals.map((hospital) => {
            return new Promise((resolve) => {
                const div = document.createElement('div');
                div.className = 'custom-marker-div hospital';
                div.innerHTML = `<img src="${hospital2}" class="custom-marker-img" />`;

                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setSelectedMarker({
                        type: 'hospital',
                        data: {
                            imageUrl: hospital2,
                            name: hospital.name,
                            location: hospital.address,
                            callNumber: hospital.phone ?? '전화번호 없음',
                        },
                    });
                });

                // 괄호 제거해서 Kakao 주소 변환 실패 방지
                const cleanAddress = hospital.address.replace(/\([^)]*\)/g, '').trim();

                new kakao.maps.services.Geocoder().addressSearch(cleanAddress, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        const overlay = new kakao.maps.CustomOverlay({
                            position: coords,
                            content: div,
                            map: hospitalFiltering ? mapRef.current : null,
                            yAnchor: 1,
                        });

                        markersRef.current.push({ type: 'hospital', overlay });
                        console.log('✅ 병원 마커 생성 완료:', hospital.name);
                    } else {
                        console.warn('❌ 주소 변환 실패 (병원):', hospital.address);
                    }
                    resolve();
                });
            });
        });

        Promise.all(markerPromises).then(() => {
            setMarkerLoadStates(prev => ({ ...prev, hospital: true }));
        });
    }, [hospitals, mapRef.current]);

    useEffect(() => {
        const allLoaded = Object.values(markerLoadStates).every(v => v === true);

        if (allLoaded) {
            console.log("🎯 모든 마커 생성 완료 → 필터 적용 시작");
            applyInitialMarkerFilter();

            // 선택적으로 마커 로드 상태를 초기화하려면 아래 코드 추가:
            // setMarkerLoadStates({ missing: false, witness: false, shelter: false, hospital: false });
        }
    }, [markerLoadStates]);
    // 마커 표시 여부를 적용하는 함수
    const applyInitialMarkerFilter = () => {
        const map = mapRef.current;
        if (!map) return;

        const initMiss = location.state?.missFiltering ?? missFiltering;
        const initSee = location.state?.seeFiltering ?? seeFiltering;
        const initShelter = location.state?.shelterFiltering ?? shelterFiltering;
        const initHospital = location.state?.hospitalFiltering ?? hospitalFiltering;

        markersRef.current.forEach(({ type, overlay }) => {
            const shouldShow =
                (type === 'missing' && initMiss) ||
                (type === 'sighting' && initSee) ||
                (type === 'shelter' && initShelter) ||
                (type === 'hospital' && initHospital);

            overlay.setMap(shouldShow ? map : null);
        });

        console.log('✅ 초기 필터 적용 완료');
    };


    // 필터 상태 변경 시마다 마커 보이기/숨기기
    useEffect(() => {
        markersRef.current.forEach(({ type, overlay }) => {
            const shouldShow =
                (type === 'missing' && missFiltering) ||
                (type === 'sighting' && seeFiltering) ||
                (type === 'shelter' && shelterFiltering) ||
                (type === 'hospital' && hospitalFiltering);
            overlay.setMap(shouldShow ? mapRef.current : null);
        });
    }, [missFiltering, seeFiltering, shelterFiltering, hospitalFiltering]);

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
                            onClick={() => {
                                setMissFiltering((prev) => !prev);
                                setShelterFiltering(false);
                                setHospitalFiltering(false);
                            }}
                        >
                            <img src={missFiltering ? missing2 : missing} alt="실종" className="tag-img" />
                            실종
                        </span>

                        {/* 목격 태그 */}
                        <span
                            className={`tag-wrap1 ${seeFiltering ? 'activeW' : ''}`}
                            onClick={() => {
                                setSeeFiltering((prev) => !prev);
                                setShelterFiltering(false);
                                setHospitalFiltering(false);
                            }}
                        >
                            <img src={seeFiltering ? sighting2 : sighting} alt="목격" className="tag-img" />
                            목격
                        </span>

                        {/* 보호소 태그 */}
                        <span
                            className={`tag-wrap2 ${shelterFiltering ? 'activeS' : ''}`}
                            onClick={() => {
                                if (shelterFiltering) {
                                    setShelterFiltering(false);
                                } else {
                                    setShelterFiltering(true);
                                    setMissFiltering(false);
                                    setSeeFiltering(false);
                                    setHospitalFiltering(false);
                                    setBreedFiltering(''); // 품종 초기화
                                    setColorFiltering('');
                                }
                            }}
                        >
                            <img src={shelterFiltering ? shelter : shelter2} alt="보호소" className="tag-img" />
                            보호소
                        </span>

                        {/* 병원 태그 */}
                        <span
                            className={`tag-wrap1 ${hospitalFiltering ? 'activeH' : ''}`}
                            onClick={() => {
                                if (hospitalFiltering) {
                                    setHospitalFiltering(false);
                                } else {
                                    setHospitalFiltering(true);
                                    setMissFiltering(false);
                                    setSeeFiltering(false);
                                    setShelterFiltering(false);
                                    setBreedFiltering(''); // 품종 초기화
                                    setColorFiltering('');
                                }
                            }}
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
                {selectedMarker ? (
                    // 마커 클릭 시 보여줄 내용
                    <div>
                        {selectedMarker.type === 'missing' && (
                            <div className="list-wrap" onClick={() => navigate('')}>
                                <div className="list-left">
                                    <div className="state">
                                        <img src={missing2} alt="missing2" className="sheet-img" />
                                        실종
                                    </div>
                                    <div className="list-location">
                                        {selectedMarker.data.location} {/* 주소*/}
                                        <p>{selectedMarker.data.date}</p> {/* 글 등록 시간 */}
                                    </div>
                                </div>
                                <div className="list-img">
                                    <img src={selectedMarker.data.imageUrl} alt="testdog" className="sheet-nailimg" />
                                </div>
                                <hr />
                            </div>
                        )}
                        {selectedMarker.type === 'sighting' && (
                            <>
                                <div className="list-wrap">
                                    <div className="list-left">
                                        <div className="state-find">
                                            <img src={missing2} alt="missing2" className="sheet-img" />
                                            목격
                                        </div>
                                        <div className="list-location">
                                            {selectedMarker.data.location}
                                            <p>{selectedMarker.data.date}</p>
                                        </div>
                                    </div>
                                    <div className="list-img">
                                        <img
                                            src={selectedMarker.data.imageUrl}
                                            alt="testdog"
                                            className="sheet-nailimg"
                                        />
                                    </div>
                                    <hr />
                                </div>
                            </>
                        )}
                        {selectedMarker.type === 'shelter' && (
                            <div className="shelter-wrap">
                                <div className="shelter-title">{selectedMarker.data.shelterName}</div>
                                <div className="shelter-address">{selectedMarker.data.location}</div>
                                <div className="shelter-call-number">{selectedMarker.data.callNumber}</div>
                                <hr />
                                <div className="view-detail" onClick={() =>
                                    navigate('/shelterdetail', {
                                        state:
                                        {
                                            shelters: shelterAnnouncements,
                                            selectedShelter: selectedMarker.data.fullShelter
                                        }
                                    })}>
                                    상세보기
                                </div>
                                <div className="shelter-images">
                                    {selectedMarker.data.imageUrl.slice(0, 4).map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`보호소 사진 ${idx + 1}`}
                                            className="shelter-img"
                                        />
                                    ))}
                                </div>
                                <hr />
                            </div>
                        )}// post-count
                        {selectedMarker.type === 'hospital' && (
                            <div className="hospital-wrap">
                                <div>{selectedMarker.data.name}</div>
                                <div>{selectedMarker.data.location}</div>
                                <div>{selectedMarker.data.callNumber}</div>
                            </div>
                        )}
                    </div>
                ) : (
                    // map 써서 받아온 리스트 쭉 보여주면 됨
                    <div>
                        <div className="list-header">
                            <div className="post-count">
                                {
                                    (missFiltering ? missingPosts.length : 0) +
                                    (seeFiltering ? witnessPosts.length : 0) +
                                    (shelterFiltering ? shelterAnnouncements.length : 0) +
                                    (hospitalFiltering ? hospitals.length : 0)
                                }개의 게시글
                            </div>
                            <div
                                className={`sort-toggle ${!listChange ? 'reversed' : ''}`}
                                onClick={() => setListChange((prev) => !prev)}
                            >
                                {listChange ? '최근작성순' : '오래된 순'}
                                <img src={change} alt="변경" />
                            </div>
                        </div>

                        <div className="list-wrap-group">
                            {/* ✅ 실종 리스트 */}
                            {missFiltering && missingPosts
                                .slice()
                                .sort((a, b) =>
                                    listChange
                                        ? new Date(b.missingDatetime) - new Date(a.missingDatetime)
                                        : new Date(a.missingDatetime) - new Date(b.missingDatetime)
                                )
                                .map((post) => (
                                    <div
                                        key={`missing-${post.id}`}
                                        className="list-wrap"
                                        onClick={() => navigate(`/missingpostDetail/${post.id}`)}
                                    >
                                        <div className="list-left">
                                            <div className="state">
                                                <img src={missing2} alt="missing2" className="sheet-img" />
                                                실종
                                            </div>
                                            <div className="list-location">
                                                {post.missingLocation}
                                                <p>{new Date(post.missingDatetime).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="list-img">
                                            <img src={post.photoUrl} alt="dog" className="sheet-nailimg" />
                                        </div>
                                        <hr />
                                    </div>
                                ))}

                            {/* ✅ 목격 리스트 */}
                            {seeFiltering && witnessPosts
                                .slice()
                                .sort((a, b) =>
                                    listChange
                                        ? new Date(b.witnessDatetime) - new Date(a.witnessDatetime)
                                        : new Date(a.witnessDatetime) - new Date(b.witnessDatetime)
                                )
                                .map((post) => (
                                    <div
                                        key={`witness-${post.id}`}
                                        className="list-wrap"
                                        onClick={() => navigate(`/witnesspostDetail/${post.id}`)}
                                    >
                                        <div className="list-left">
                                            <div className="state-find">
                                                <img src={missing2} alt="witness" className="sheet-img" />
                                                목격
                                            </div>
                                            <div className="list-location">
                                                {post.witnessLocation}
                                                <p>{new Date(post.witnessDatetime).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="list-img">
                                            <img src={post.photoUrl} alt="dog" className="sheet-nailimg" />
                                        </div>
                                        <hr />
                                    </div>
                                ))}

                            {/* ✅ 보호소 리스트 */}
                            {shelterFiltering && shelterAnnouncements.map((shelter, index) => (
                                <div key={`shelter-${index}`} className="list-wrap">
                                    <div className="list-left">
                                        <div className="state-shelter">
                                            <img src={customMarkerImg} alt="shelter" className="sheet-img" />
                                            보호소
                                        </div>
                                        <div className="list-location">
                                            {shelter.address}
                                            <p>{shelter.shelterName}</p>
                                        </div>
                                    </div>
                                    <div className="list-img">
                                        <img
                                            src={shelter.animalSummaries?.[0]?.imageUrl ?? defaultImg}
                                            alt="animal"
                                            className="sheet-nailimg"
                                        />
                                    </div>
                                    <hr />
                                </div>
                            ))}

                            {/* ✅ 병원 리스트 */}
                            {hospitalFiltering && hospitals.map((hospital, index) => (
                                <div key={`hospital-${index}`} className="list-wrap">
                                    <div className="list-left">
                                        <div className="state-hospital">
                                            <img src={hospital2} alt="hospital" className="sheet-img" />
                                            병원
                                        </div>
                                        <div className="list-location">
                                            {hospital.address}
                                            <p>{hospital.name}</p>
                                        </div>
                                    </div>
                                    <div className="list-img">
                                        <img src={hospital2} alt="hospital" className="sheet-nailimg" />
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    </div>


                )}
            </BottomSheet>

            <Footer />
        </div>
    );
}
//수정본본