// MapMain.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoChevronLeft } from 'react-icons/go';
import { TiDelete } from 'react-icons/ti';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { FaPhoneAlt, FaHospital } from 'react-icons/fa';
import missing from '../../../assets/missing.svg';
import missing2 from '../../../assets/missing2.svg';
import sighting from '../../../assets/sighting.svg';
import sighting2 from '../../../assets/sighting2.svg';
import hospital from '../../../assets/hospital.svg';
import hospital2 from '../../../assets/hospital3.svg';
import shelter from '../../../assets/shelter.svg';
import shelter2 from '../../../assets/shelter2.svg';
import mylocation from '../../../assets/my-location.svg';
import tag from '../../../assets/tag.svg';
import change from '../../../assets/change.svg';
import pethospital from '../../../assets/pet-hospital.png';
import axios from 'axios';
import Footer from '../../../shared/Footer/Footer';
import BottomSheet from './BottomSheet';
import '../MapMain.css';

export default function MapMain() {
    // ==================================================================================== useState 시작
    // 검색 상태
    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [currentPos, setCurrentPos] = useState(null);

    // 현재 활성 마커
    const [activeMarker, setActiveMarker] = useState(null);

    // 마커 상태
    const [markerStatus, setMarkerStatus] = useState({
        missing: false,
        witness: false,
        shelter: false,
        hospital: false,
    });

    // 리스트 상태(최신순, 오래된순)
    const [isLatest, setIsLatest] = useState(true);

    // 필터 태그 상태
    const [isMissing, setIsMissing] = useState(true);
    const [isWitness, setIsWitness] = useState(true);
    const [isHospital, setIsHospital] = useState(false);
    const [isShelter, setIsShelter] = useState(false);
    const [colorFilter, setColorFilter] = useState('');
    const [breedFilter, setBreedFilter] = useState('');

    // DB에서 받은 데이터 : 실종/목격, 병원, 보호소
    const [missingPosts, setMissingPosts] = useState([]);
    const [witnessPosts, setWitnessPosts] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [shelters, setShelters] = useState([]);

    //  바텀 시트
    const snapPoints = [0.3, 0.5, 0.87];
    const [snapIndex, setSnapIndex] = useState(1);
    const [percent, setPercent] = useState(snapPoints[0]);
    // ==================================================================================== useState 종료
    // ==================================================================================== useRef 시작
    // 지도 관련
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    // 마커, 클러스터
    const markersRef = useRef([]);
    const clustererRef = useRef(null);

    // 검색
    const psRef = useRef(null);
    // ==================================================================================== useRef 종료
    // ==================================================================================== Router/Navigate 시작
    const navigate = useNavigate();
    const location = useLocation();
    // ==================================================================================== Router/Navigate 종료
    // ==================================================================================== 핸들러함수 시작
    // 바텀시트 드래그 종료
    const handleDragEnd = useCallback(
        (currentPercent) => {
            // currentPercent 와 snapPoints 간 차이를 재어 가장 가까운 인덱스 찾기
            const nearestIndex = snapPoints.reduce((closestIdx, p, idx) => {
                const prevDiff = Math.abs(snapPoints[closestIdx] - currentPercent);
                const currDiff = Math.abs(p - currentPercent);
                return currDiff < prevDiff ? idx : closestIdx;
            }, 0);

            setSnapIndex(nearestIndex);
            setPercent(snapPoints[nearestIndex]);
        },
        [snapPoints]
    );

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
        handleClear();
    };

    // 입력창 초기화 및 뒤로가기
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
                console.log('좌표 받아옴:', coords);
                const loc = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
                mapRef.current.setCenter(loc);
            },
            (err) => {
                console.error('위치 정보 에러:', err);
                alert('위치 정보를 가져올 수 없습니다.');
            }
        );
    };
    // ==================================================================================== 핸들러함수 종료
    // ==================================================================================== 로직함수 시작
    // 거리 계산
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
            console.warn('[Search] 빈 검색어 또는 Places 서비스 미사용');
            setPlaces([]);
            return;
        }

        console.log(`[Search] 검색어 입력: "${v}"`);
        psRef.current.keywordSearch(v, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const list = data.slice(0, 10).map((p) => ({
                    ...p,
                    distance: currentPos ? getDistance(currentPos.lat, currentPos.lng, p.y, p.x) : null,
                }));
                console.log(`[Search] 검색 결과 ${list.length}개`);
                setPlaces(list);
                setSelectedIndex(-1);
            } else {
                console.warn('[Search] 검색 결과 없음');
                setPlaces([]);
            }
        });
    };

    // 이미지 불러오기
    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    // 지도에 표시할 마커 적용
    const applyInitialMarkerFilter = () => {
        const map = mapRef.current;
        if (!map) return;

        const initMiss = location.state?.missFiltering ?? isMissing;
        const initSee = location.state?.seeFiltering ?? isWitness;
        const initShelter = location.state?.shelterFiltering ?? isShelter;
        const initHospital = location.state?.hospitalFiltering ?? isHospital;

        markersRef.current.forEach(({ type, overlay }) => {
            const shouldShow =
                (type === 'missing' && initMiss) ||
                (type === 'witness' && initSee) ||
                (type === 'shelter' && initShelter) ||
                (type === 'hospital' && initHospital);

            overlay.setMap(shouldShow ? map : null);
        });
    };
    // ==================================================================================== 로직함수 종료
    // ==================================================================================== useEffect 시작

    // 내 위치 조회 + Kakao SDK 로드 + 지도 초기화
    useEffect(() => {
        // 1) 내 위치 조회
        navigator.geolocation?.getCurrentPosition(
            ({ coords }) => {
                setCurrentPos({ lat: coords.latitude, lng: coords.longitude });
            },
            () => console.warn('[Init] 위치 권한 없음')
        );

        // 2.1) 실종 전체 조회
        axios
            .get('/api/posts/missing/all')
            .then(({ data }) => {
                // console.log('[API] 실종 게시글 응답:', data);
                setMissingPosts(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error('[API] 실종 게시글 요청 실패:', err));

        // 2.2) 목격 전체 조회
        axios
            .get('/api/posts/witness/all')
            .then(({ data }) => {
                // console.log('[API] 목격 게시글 응답:', data);
                setWitnessPosts(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error('[API] 목격 게시글 요청 실패:', err));

        // 2.3) 보호소(입양, 실종) API 호출
        Promise.all([axios.get('/api/map/shelter-adoption'), axios.get('/api/map/shelter-missing')])
            .then(([adoptionRes, missingRes]) => {
                const mergedData = [
                    ...adoptionRes.data.map((item) => ({ ...item, type: 'adoption' })),
                    ...missingRes.data.map((item) => ({ ...item, type: 'missing' })),
                ];
                // console.log('[API] 보호소 전체 데이터 응답:', mergedData);
                setShelters(mergedData);
            })
            .catch((err) => console.error('[API] 보호소 API 요청 실패:', err));

        // 2.4) 병원 목록 API 호출
        axios
            .get('/api/map/hospital')
            .then(({ data }) => {
                // console.log('[API] 병원 데이터 응답:', data);
                setHospitals(data);
            })
            .catch((err) => console.error('[API] 병원 API 요청 실패:', err));

        // 3) Kakao SDK 로드
        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=f7f187089f6a8bc9d9967ce8bfcc67c0&autoload=false&libraries=services,clusterer';
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                console.log('카카오 지도 인스턴스 생성 시작');
                const kakao = window.kakao;
                const map = new kakao.maps.Map(mapContainerRef.current, {
                    // 디폴트 위치 : 금오공대
                    center: new kakao.maps.LatLng(36.1460531, 128.39583),
                    level: 4,
                });
                mapRef.current = map;

                psRef.current = new kakao.maps.services.Places();

                kakao.maps.event.addListener(map, 'click', () => {
                    console.log('[Map] 지도 빈 공간 클릭 → 선택 마커 해제');
                });

                applyInitialMarkerFilter();

                clustererRef.current = new kakao.maps.MarkerClusterer({
                    map,
                    averageCenter: true,
                    minLevel: 8,
                    calculator: [10, 20, 30], // 원하는 구간(1-10, 11-20, 21-30, 31-)
                    styles: [
                        {
                            width: '30px',
                            height: '30px',
                            background: '#4CAF50',
                            lineHeight: '30px',
                            borderRadius: '15px',
                        },
                        {
                            width: '40px',
                            height: '40px',
                            background: '#2196F3',
                            lineHeight: '40px',
                            borderRadius: '20px',
                        },
                        {
                            width: '50px',
                            height: '50px',
                            background: '#FFD600',
                            lineHeight: '50px',
                            borderRadius: '25px',
                        },
                        {
                            width: '60px',
                            height: '60px',
                            background: '#FF3B30',
                            lineHeight: '60px',
                            borderRadius: '30px',
                        },
                    ],
                });

                // 클러스터링 실행 (모든 마커를 클러스터러에 등록)
                clustererRef.current.addMarkers(markersRef.current.map(({ overlay }) => overlay));

                kakao.maps.event.addListener(map, 'zoom_changed', () => {
                    const level = map.getLevel();
                    console.log('현재 줌 레벨:', level);

                    clustererRef.current?.clear(); // 클러스터러 비우고

                    markersRef.current.forEach(({ type, overlay }) => {
                        const shouldShow =
                            (type === 'missing' && isMissing) ||
                            (type === 'witness' && isWitness) ||
                            (type === 'shelter' && isShelter) ||
                            (type === 'hospital' && isHospital);

                        if (level > 7) {
                            // 마커는 숨기고 클러스터만 표시
                            markersRef.current.forEach(({ overlay }) => overlay.setMap(null));
                            clustererRef.current?.addMarkers(markersRef.current.map(({ overlay }) => overlay));
                        } else {
                            // 마커 표시 + 클러스터 적용
                            markersRef.current.forEach(({ overlay }) => overlay.setMap(map));
                            clustererRef.current?.addMarkers(markersRef.current.map(({ overlay }) => overlay));
                        }
                    });
                });

                // 지도 생성 후 현재 줌 레벨에 맞게, 마커 표시 여부 즉시 적용
                const currentLevel = map.getLevel();

                markersRef.current.forEach(({ type, overlay }) => {
                    const shouldShow =
                        (type === 'missing' && isMissing) ||
                        (type === 'witness' && isWitness) ||
                        (type === 'shelter' && isShelter) ||
                        (type === 'hospital' && isHospital);

                    if (currentLevel > 2) {
                        overlay.setMap(null);
                    } else {
                        overlay.setMap(shouldShow ? map : null);
                    }
                });

                setSnapIndex(1);
                setPercent(snapPoints[1]);
            });
        };

        document.head.appendChild(script);

        return () => {
            console.log('[Cleanup] useEffect 정리');
        };
    }, []);

    // 마커(1: 실종, 2: 목격, 3: 보호소, 4: 병원)
    // 1. 실종 마커
    useEffect(() => {
        if (!mapRef.current || missingPosts.length === 0) return;
        // console.log('[Marker] 실종 마커 생성 시작. 게시글 수:', missingPosts.length);

        // 기존 실종 마커 제거
        const removeExistingMarkers = () => {
            markersRef.current = markersRef.current.filter(({ type, overlay }) => {
                if (type === 'missing') {
                    overlay.setMap(null);
                    return false;
                }
                return true;
            });
        };

        // 새 실종 마커 생성
        const createMarker = (post) => {
            return new Promise((resolve) => {
                const div = document.createElement('div');
                div.className = 'custom-marker-container missing';
                div.innerHTML = `
                <div class="marker-circle">
                    <img src="${getImageUrl(post.photoUrl)}" class="marker-img" />
                </div>
                <div class="marker-label">실종</div>
            `;

                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setActiveMarker({
                        type: 'missing',
                        data: {
                            id: post.id,
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
                            map: isMissing ? mapRef.current : null,
                            yAnchor: 1,
                        });

                        markersRef.current.push({ type: 'missing', overlay });
                    } else {
                        console.warn(`[Marker] 주소 변환 실패. ID: ${post.id}, 주소: ${post.missingLocation}`);
                    }
                    resolve();
                });
            });
        };

        removeExistingMarkers();

        Promise.all(missingPosts.filter((post) => post.postType === 'missing').map(createMarker)).then(() => {
            console.log('[Marker] 실종 마커 생성 완료.');
            setMarkerStatus((prev) => ({ ...prev, missing: true }));
        });
    }, [missingPosts, mapRef.current]);

    // 2. 목격 마커
    useEffect(() => {
        if (!mapRef.current || witnessPosts.length === 0) return;
        // console.log('[Marker] 목격 마커 생성 시작. 게시글 수:', witnessPosts.length);

        // 기존 목격 마커 제거
        const removeExistingMarkers = () => {
            markersRef.current = markersRef.current.filter(({ type, overlay }) => {
                if (type === 'witness') {
                    overlay.setMap(null);
                    return false;
                }
                return true;
            });
        };

        // 새 목격 마커 생성
        const createMarker = (post) => {
            return new Promise((resolve) => {
                const imageUrl = post.photoUrl ? post.photoUrl.split(',')[0] : '/default-image.png';

                const div = document.createElement('div');
                div.className = 'custom-marker-container sighting';
                div.innerHTML = `
                <div class="marker-circle">
                    <img src="${getImageUrl(imageUrl)}" class="marker-img" />
                </div>
                <div class="marker-label">목격</div>
            `;

                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setActiveMarker({
                        type: 'witness',
                        data: {
                            id: post.id,
                            imageUrl: imageUrl,
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
                            map: isWitness ? mapRef.current : null,
                            yAnchor: 1,
                        });

                        markersRef.current.push({ type: 'witness', overlay });
                    } else {
                        console.warn(`[Marker] 목격 주소 변환 실패. ID: ${post.id}, 주소: ${post.witnessLocation}`);
                    }
                    resolve();
                });
            });
        };

        removeExistingMarkers();

        Promise.all(witnessPosts.filter((post) => post.postType === 'witness').map(createMarker)).then(() => {
            console.log('[Marker] 목격 마커 생성 완료.');
            setMarkerStatus((prev) => ({ ...prev, witness: true }));
        });
    }, [witnessPosts, mapRef.current]);

    // 3. 병원 마커 - 최초 1회 생성, 이후 표시/숨김만 처리
    useEffect(() => {
        if (!mapRef.current || hospitals.length === 0) return;

        const kakao = window.kakao;
        const chunkSize = 100;
        let index = 0;

        const bounds = mapRef.current.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const isInView = (lat, lng) =>
            lat >= sw.getLat() && lat <= ne.getLat() && lng >= sw.getLng() && lng <= ne.getLng();

        const sortedHospitals = hospitals.slice().sort((a, b) => {
            const aInView = isInView(a.latitude, a.longitude);
            const bInView = isInView(b.latitude, b.longitude);
            return bInView - aInView;
        });

        // 기존 마커 제거
        markersRef.current = markersRef.current.filter(({ type, overlay }) => {
            if (type === 'hospital') {
                overlay.setMap(null);
                return false;
            }
            return true;
        });

        const createHospitalMarker = (hospital) => {
            const exists = markersRef.current.some(({ type, id }) => type === 'hospital' && id === hospital.id);
            if (exists) return;

            const div = document.createElement('div');
            div.className = 'custom-marker-div hospital';
            div.innerHTML = `<img src="${hospital2}" class="custom-marker-img" />`;

            div.addEventListener('click', (e) => {
                e.stopPropagation();
                setActiveMarker({
                    type: 'hospital',
                    data: {
                        imageUrl: hospital2,
                        name: hospital.name,
                        location: hospital.address,
                        phone: hospital.phone || '전화번호 없음',
                    },
                });
            });

            if (hospital.latitude && hospital.longitude) {
                const coords = new kakao.maps.LatLng(hospital.latitude, hospital.longitude);
                const overlay = new kakao.maps.CustomOverlay({
                    position: coords,
                    content: div,
                    map: isHospital ? mapRef.current : null, // 최초 표시 여부 결정
                    yAnchor: 1,
                    clickable: true,
                });

                markersRef.current.push({ type: 'hospital', overlay, id: hospital.id });
            }
        };

        const processChunk = () => {
            const end = Math.min(index + chunkSize, sortedHospitals.length);
            for (; index < end; index++) {
                createHospitalMarker(sortedHospitals[index]);
            }

            if (index < sortedHospitals.length) {
                setTimeout(processChunk, 0);
            } else {
                setMarkerStatus((prev) => ({ ...prev, hospital: true }));
            }
        };

        // 마커 생성 시작
        processChunk();
    }, [hospitals, mapRef.current, isHospital]);

    // 4. 보호소 마커
    useEffect(() => {
        if (!mapRef.current || shelters.length === 0) return;

        const kakao = window.kakao;
        const chunkSize = 100;
        let index = 0;

        const bounds = mapRef.current.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const isInView = (lat, lng) =>
            lat >= sw.getLat() && lat <= ne.getLat() && lng >= sw.getLng() && lng <= ne.getLng();

        const sortedShelters = shelters.slice().sort((a, b) => {
            const aInView = isInView(a.latitude, a.longitude);
            const bInView = isInView(b.latitude, b.longitude);
            return bInView - aInView;
        });

        // 기존 보호소 마커 제거
        markersRef.current = markersRef.current.filter(({ type, overlay }) => {
            if (type === 'shelter') {
                overlay.setMap(null);
                return false;
            }
            return true;
        });

        const createShelterMarker = (shelter) => {
            const exists = markersRef.current.some(({ type, id }) => type === 'shelter' && id === shelter.shelterName);
            if (exists) return;

            const div = document.createElement('div');
            div.className = 'custom-marker-div shelter';
            div.innerHTML = `<img src="${shelter2}" class="custom-marker-img" />`;

            div.addEventListener('click', (e) => {
                e.stopPropagation();

                const imageList = shelter.imageUrl
                    ? shelter.imageUrl.split(',').slice(0, 4)
                    : shelter.imageUrls
                    ? shelter.imageUrls.split(',').slice(0, 4)
                    : ['/default-image.png'];

                setActiveMarker({
                    type: 'shelter',
                    data: {
                        imageUrl: imageList,
                        shelterName: shelter.shelterName,
                        location: shelter.address || shelter.protectionLocation,
                        callNumber: shelter.phone || shelter.shelterContact || '전화번호 없음',
                        fullShelter: shelter,
                    },
                });
            });

            if (shelter.latitude && shelter.longitude) {
                const coords = new kakao.maps.LatLng(shelter.latitude, shelter.longitude);
                const overlay = new kakao.maps.CustomOverlay({
                    position: coords,
                    content: div,
                    map: isShelter ? mapRef.current : null, // 필터 상태에 따라 표시 여부 결정
                    yAnchor: 1,
                    clickable: true,
                });

                markersRef.current.push({ type: 'shelter', overlay, id: shelter.shelterName });
            }
        };

        const processChunk = () => {
            const end = Math.min(index + chunkSize, sortedShelters.length);

            for (; index < end; index++) {
                createShelterMarker(sortedShelters[index]);
            }

            if (index < sortedShelters.length) {
                setTimeout(processChunk, 0);
            } else {
                setMarkerStatus((prev) => ({ ...prev, shelter: true }));
            }
        };

        // 새 마커 생성
        processChunk();
    }, [shelters, mapRef.current, isShelter]);

    // 마커 로드
    useEffect(() => {
        const allLoaded = Object.values(markerStatus).every((v) => v === true);

        if (allLoaded) {
            applyInitialMarkerFilter();

            // setMarkerLoadStates({ missing: false, witness: false, shelter: false, hospital: false });
        }
    }, [markerStatus]);

    // 필터 상태 변경 시마다 마커 보이기/숨기기
    useEffect(() => {
        console.log('[Filter] 마커 표시 상태 변경', {
            실종: isMissing,
            목격: isWitness,
            보호소: isShelter,
            병원: isHospital,
        });

        markersRef.current.forEach(({ type, overlay }) => {
            const shouldShow =
                (type === 'missing' && isMissing) ||
                (type === 'witness' && isWitness) ||
                (type === 'shelter' && isShelter) ||
                (type === 'hospital' && isHospital);
            overlay.setMap(shouldShow ? mapRef.current : null);
            // console.log(`[Filter] 마커 타입: ${type} → ${shouldShow ? '표시' : '숨김'}`);
        });
    }, [isMissing, isWitness, isShelter, isHospital]);

    useEffect(() => {
        if (location.state) {
            const {
                missFiltering = false,
                seeFiltering = false,
                shelterFiltering = false,
                hospitalFiltering = false,
                breedFiltering = '',
                colorFiltering = '',
            } = location.state;

            setIsMissing(missFiltering);
            setIsWitness(seeFiltering);
            setIsShelter(shelterFiltering);
            setIsHospital(hospitalFiltering);
            setBreedFilter(breedFiltering);
            setColorFilter(colorFiltering);

            applyInitialMarkerFilter();
        }
    }, [location.state]);

    useEffect(() => {
        applyInitialMarkerFilter();
    }, [isMissing, isWitness, isShelter, isHospital]);

    // ==================================================================================== useEffect 종료
    // ==================================================================================== 렌더링 시작
    console.log('현재 percent 값:', percent);

    return (
        <div className="mappage-container">
            {/* 지도 */}
            <div ref={mapContainerRef} className="map-box" />

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

                        <button
                            className="input-icon-button"
                            type="button"
                            onClick={() => {
                                navigate('/filters', {
                                    state: {
                                        missFiltering: isMissing,
                                        seeFiltering: isWitness,
                                        shelterFiltering: isShelter,
                                        hospitalFiltering: isHospital,
                                        breedFiltering: breedFilter,
                                        colorFiltering: colorFilter,
                                    },
                                });
                            }}
                        >
                            <img src={tag} alt="filter" className="tag-icon" />
                        </button>
                    </div>

                    {/* 1. 태그 */}
                    <div className="tag-container">
                        {/* 1.1. 실종 태그 */}
                        <span
                            className={`tag-wrap1 ${isMissing ? 'activeM' : ''}`}
                            onClick={() => {
                                setIsMissing((prev) => !prev);
                            }}
                        >
                            <img src={isMissing ? missing2 : missing} alt="실종" className="tag-img1" />
                            실종
                        </span>

                        {/* 1.2. 목격 태그 */}
                        <span
                            className={`tag-wrap1 ${isWitness ? 'activeW' : ''}`}
                            onClick={() => {
                                setIsWitness((prev) => !prev);
                            }}
                        >
                            <img src={isWitness ? sighting2 : sighting} alt="목격" className="tag-img1" />
                            목격
                        </span>

                        {/* 1.3. 병원 태그 */}
                        <span
                            className={`tag-wrap1 ${isHospital ? 'activeH' : ''}`}
                            onClick={() => setIsHospital((prev) => !prev)}
                        >
                            <img src={isHospital ? hospital2 : hospital} alt="병원" className="tag-img1" />
                            병원
                        </span>
                        {/* 1.4.보호소 태그 */}
                        <span
                            className={`tag-wrap2 ${isShelter ? 'activeS' : ''}`}
                            onClick={() => setIsShelter((prev) => !prev)}
                        >
                            <img src={isShelter ? shelter2 : shelter} alt="보호소" className="tag-img" />
                            보호소
                        </span>
                        <span className="location-wrap" onClick={moveToMyLocation}>
                            <img src={mylocation} alt="내 위치" className="location-img" />
                        </span>
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

            <BottomSheet
                percent={percent}
                minPercent={snapPoints[1]}
                maxPercent={snapPoints[2]}
                onDragEnd={handleDragEnd}
            >
                {activeMarker ? (
                    // 2. 마커 클릭 시 보여줄 내용
                    <div>
                        {/* 2.1. 실종 마커 선택 */}
                        {activeMarker.type === 'missing' && (
                            <div
                                className="list-wrap"
                                onClick={() =>
                                    navigate(`/missingpostDetail/${activeMarker.data.id}`, {
                                        state: { post: activeMarker.data },
                                    })
                                }
                            >
                                <div className="list-left">
                                    <div className="state">
                                        <img src={missing2} alt="missing2" className="sheet-img" />
                                        실종
                                    </div>
                                    <div className="list-location">
                                        {activeMarker.data.location} {/* 주소*/}
                                        <p>{activeMarker.data.date}</p> {/* 글 등록 시간 */}
                                    </div>
                                </div>
                                <div className="list-img">
                                    <img
                                        src={getImageUrl(activeMarker.data.imageUrl)}
                                        alt="testdog"
                                        className="sheet-nailimg"
                                    />
                                </div>
                                <hr />
                            </div>
                        )}
                        {/* 2.2. 목격 마커 선택 */}
                        {activeMarker.type === 'witness' && (
                            <>
                                <div
                                    className="list-wrap"
                                    onClick={() =>
                                        navigate(`/witnesspostDetail/${activeMarker.data.id}`, {
                                            state: { postId: activeMarker.data.id },
                                        })
                                    }
                                >
                                    <div className="list-left">
                                        <div className="state-find">
                                            <img src={missing2} alt="missing2" className="sheet-img" />
                                            목격
                                        </div>
                                        <div className="list-location">
                                            {activeMarker.data.location}
                                            <p>{activeMarker.data.date}</p>
                                        </div>
                                    </div>
                                    <div className="list-img">
                                        <img
                                            src={getImageUrl(activeMarker.data.imageUrl)}
                                            alt="testdog"
                                            className="sheet-nailimg"
                                        />
                                    </div>
                                    <hr />
                                </div>
                            </>
                        )}
                        {/* 2.3. 보호소 마커 선택 */}
                        {activeMarker.type === 'shelter' && (
                            <div
                                className="list-wrap"
                                onClick={() =>
                                    navigate('/shelterdetail', {
                                        state: {
                                            shelters: shelters,
                                            selectedShelter: activeMarker.data.fullShelter, // ← 여기
                                        },
                                    })
                                }
                            >
                                <div>
                                    <div className="shelter-wrap">
                                        <img src={shelter2} alt="보호소" className="tag-img" />
                                        보호소
                                    </div>
                                    <div className="list-left">
                                        <div className="state-shelter">{activeMarker.data.fullShelter.shelterName}</div>
                                        <div className="list-location">
                                            {activeMarker.data.fullShelter.address}
                                            {activeMarker.data.fullShelter.protectionLocation}
                                        </div>
                                    </div>
                                </div>
                                <div className="list-img">
                                    <img
                                        src={activeMarker.data.fullShelter.imageUrl ?? '/default-image.png'}
                                        alt="animal"
                                        className="sheet-nailimg"
                                    />
                                </div>
                            </div>
                        )}
                        {/* 2.4. 병원 마커 선택 */}
                        {activeMarker.type === 'hospital' && (
                            <div className="list-wrap">
                                <div>
                                    <div className="hospital-wrap">
                                        <img src={hospital2} alt="병원" className="tag-img" />
                                        병원
                                    </div>
                                    <div className="list-left">
                                        <div className="state-hospital">{activeMarker.data.name}</div>
                                        <div className="list-location">{activeMarker.data.location}</div>
                                        <div className="list-location">{activeMarker.data.phone}</div>
                                    </div>
                                </div>
                                <div className="list-img">
                                    <img src={pethospital} alt="hospital" className="sheet-nailimg" />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // map 써서 받아온 리스트 쭉 보여주면 됨
                    // 3. 리스트
                    <div>
                        <div className="list-header">
                            <div className="post-count">
                                {(isMissing ? missingPosts.length : 0) +
                                    (isWitness ? witnessPosts.length : 0) +
                                    (isShelter ? shelters.length : 0) +
                                    (isHospital ? hospitals.length : 0)}
                                개의 게시글
                            </div>
                            <div
                                className={`sort-toggle ${!isLatest ? 'reversed' : ''}`}
                                onClick={() => setIsLatest((prev) => !prev)}
                            >
                                {isLatest ? '최근작성순' : '오래된 순'}
                                <img src={change} alt="변경" />
                            </div>
                        </div>

                        <div className="list-wrap-group">
                            {/* 3.1. 실종 리스트 */}
                            {isMissing &&
                                missingPosts
                                    .slice()
                                    .sort((a, b) =>
                                        isLatest
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
                                                <img
                                                    src={getImageUrl(post.photoUrl)}
                                                    alt="dog"
                                                    className="sheet-nailimg"
                                                />
                                            </div>
                                            <hr />
                                        </div>
                                    ))}

                            {/* 3.2. 목격 리스트 */}
                            {isWitness &&
                                witnessPosts
                                    .slice()
                                    .sort((a, b) =>
                                        isLatest
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
                                                    <img src={sighting2} alt="witness" className="sheet-img" />
                                                    목격
                                                </div>
                                                <div className="list-location">
                                                    {post.witnessLocation}
                                                    <p>{new Date(post.witnessDatetime).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="list-img">
                                                <img
                                                    src={getImageUrl(post.photoUrl.split(',')[0])} // 첫 번째 경로만 사용
                                                    alt="dog"
                                                    className="sheet-nailimg"
                                                />
                                            </div>
                                            <hr />
                                        </div>
                                    ))}

                            {/* 3.3. 보호소 리스트 */}
                            {isShelter &&
                                shelters.map((shelter, index) => (
                                    <div
                                        key={`shelter-${index}`}
                                        className="list-wrap"
                                        onClick={() =>
                                            navigate('/shelterdetail', {
                                                state: {
                                                    shelters: shelters,
                                                    selectedShelter: shelter,
                                                },
                                            })
                                        }
                                    >
                                        <div>
                                            <div className={`shelter-wrap`}>
                                                <img src={shelter2} alt="보호소" className="tag-img" />
                                                보호소
                                            </div>
                                            <div className="list-left">
                                                <div className="state-shelter">{shelter.shelterName}</div>
                                                <div className="list-location">{shelter.protectionLocation}</div>
                                            </div>
                                        </div>
                                        <div className="list-img">
                                            <img
                                                src={shelter.imageUrls?.split(';')[0] || '/default-image.png'}
                                                alt="animal"
                                                className="sheet-nailimg"
                                            />
                                        </div>
                                        <hr />
                                    </div>
                                ))}

                            {/* 3.4. 병원 리스트 */}
                            {isHospital &&
                                hospitals.map((hospital, index) => (
                                    <div key={`hospital-${index}`} className="list-wrap">
                                        <div>
                                            <div className={`hospital-wrap`}>
                                                <img src={hospital2} alt="병원" className="tag-img" />
                                                병원
                                            </div>
                                            <div className="list-left">
                                                <div className="state-hospital">{hospital.name}</div>
                                                <div className="list-location">{hospital.address}</div>
                                                <div className="list-location">{hospital.phone}</div>
                                            </div>
                                        </div>
                                        <div className="list-img">
                                            <img src={pethospital} alt="hospital" className="sheet-nailimg" />
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
