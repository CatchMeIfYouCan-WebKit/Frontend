// src/pages/Adoption.jsx
import React, { useState, useEffect } from 'react';
import '../Adoption.css';
import Footer from '../../../shared/Footer/Footer';
import testdog from '../../../assets/testdog.png';
import chatimg from '../../../assets/chatimg.svg';
import mark from '../../../assets/mark.svg';
import tag from '../../../assets/tag.svg';
import Header from '../../../shared/Header/components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdoptionFilterSheet from './AdoptionFilterSheet';

function getTimeAgo(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${diffDay}일 전`;
}

export default function Adoption() {
    const navigate = useNavigate();
    const { state } = useLocation();

    //필터 상태
    const [filter, setFilter] = useState({
        region: '',
        age: '',
        breed: '',
        color: '',
    });
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);

    // FAB & BottomSheet 상태
    const [fabOpen, setFabOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    // 게시글 주소 매핑
    const [addresses, setAddresses] = useState({});

    const [posts, setPosts] = useState([]);

    //필터로 불러오기
    useEffect(() => {
        const getImageUrl = (path) => {
            if (!path) return '';
            const isMobile = /android/i.test(navigator.userAgent);
            const base = isMobile ? 'http://10.0.2.2:8080' : `http://${window.location.hostname}:8080`;
            return path.startsWith('http') ? path : `${base}${path}`;
        };

        // ✅ 선언 빠졌던 부분 복구
        const query = new URLSearchParams();

        // 각 필터 값에 대해 trim() 후 유효성 체크
        if (filter.region && filter.region.trim()) {
            query.append('region', filter.region.trim());
        }

        if (filter.age && filter.age.toString().trim()) {
            query.append('age', filter.age.toString().trim());
        }

        if (filter.breed && filter.breed.trim()) {
            query.append('breed', filter.breed.trim());
        }

        if (filter.color && Array.isArray(filter.color) && filter.color.length > 0) {
            // 예: ["검은색", "하얀색"] => "검은색,하얀색"
            const trimmedColors = filter.color.map((c) => c.trim()).filter(Boolean);
            if (trimmedColors.length > 0) {
                query.append('color', trimmedColors.join(','));
            }
        }


        axios
            .get(`/api/adopt/filter?${query.toString()}`)
            .then((res) => {
                console.log('✅ 서버 응답 데이터:', res.data);
                const sortedData = res.data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                const adoptPosts = sortedData.map((post) => {
                    const createdAt = post.createdAt || new Date();
                    return {
                        id: post.id,
                        image: getImageUrl(post.photoPath),
                        title: post.title,
                        breed: post.breed || post.pet?.breed || '품종 정보 없음',
                        birth: post.dateOfBirth || post.pet?.dateOfBirth || '생일 정보 없음',
                        gender: post.gender || post.pet?.gender || '성별 정보 없음',
                        location: post.adoptLocation || '',
                        timeAgo: getTimeAgo(createdAt),
                        ...post, // 전체 데이터도 같이 포함
                    };
                });

                setPosts(adoptPosts);
            })
            .catch((err) => {
                console.error('필터 적용 중 오류:', err);
            });
    }, [filter]);

    // 새 게시글이 넘어오면 앞에 추가
    useEffect(() => {
        if (state?.newPost) {
            setPosts((prev) => {
                if (prev.some((p) => p.id === state.newPost.id)) return prev;
                return [state.newPost, ...prev];
            });
        }
    }, [state?.newPost]);

    // 반려동물 목록 (BottomSheet)
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const isMobile = /android/i.test(navigator.userAgent);
        const base = isMobile ? 'http://10.0.2.2:8080' : `http://${window.location.hostname}:8080`;

        axios
            .get('/api/animal-profile/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const petList = res.data.map((p) => {
                    let imagePath = '';
                    if (!p.photoPath || p.photoPath.trim() === '') {
                        alert(`❌ [${p.name}]의 photoPath가 없습니다.`);
                    } else {
                        const paths = p.photoPath
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                        if (paths.length > 0) {
                            const rawPath = paths[0];
                            imagePath = rawPath.startsWith('http') ? rawPath : `${base}${rawPath}`;
                        }
                    }

                    return {
                        id: p.id,
                        image: imagePath,
                        name: p.name,
                        breed: p.breed,
                        birth: p.dateOfBirth,
                        gender: p.gender,
                        coatColor: p.coatColor,
                        isNeutered: p.isNeutered,
                        age: p.age,
                        weight: p.weight,
                        registrationNumber: p.registrationNumber,
                    };
                });

                setPets(petList);
            })
            .catch((err) => {
                console.error('펫 정보 불러오기 실패:', err);
            });
    }, []);

    return (
        <div className="adoption-page">
            <Header />

            <div className="adoption-header">
                <div className="filters">
                    <div className={`filter ${filter.region ? 'active-filter' : ''}`}>
                        {filter.region?.trim() || '지역'}
                    </div>
                    <div className={`filter ${filter.age ? 'active-filter' : ''}`}>
                        {filter.age?.toString().trim() || '나이'}
                    </div>
                    <div className={`filter ${filter.breed ? 'active-filter' : ''}`}>
                        {filter.breed?.trim() || '품종'}
                    </div>
                    <div className={`filter ${filter.color?.length ? 'active-filter' : ''}`}>
                        {filter.color?.length ? filter.color.join(', ') : '색상'}
                    </div>

                    <div className="filter-tag" onClick={() => setFilterSheetOpen(true)}>
                        <img src={tag} alt="필터" />
                    </div>
                </div>
            </div>

            {/* 게시글 리스트: 스크롤로 전체 표시 */}
            <div className="post-list">
                {posts.map((p) => (
                    <div
                        key={p.id}
                        className="post-card"
                        onClick={() =>
                            navigate(`/adoptionpost/${p.id}`, {
                                state: {
                                    post: p, // ✅ 전체 게시글 객체 하나만 넘김
                                },
                            })
                        }
                    >
                        <img src={p.image || ''} alt={p.title} className="post-img" />
                        <div className="post-info">
                            <div className="post-title">
                                {p.title}
                                <span className="verified">
                                    <img src={mark} alt="인증" />
                                </span>
                            </div>
                            <div className="post-meta">
                                {p.breed}
                                <br />
                                {p.birth} · {p.gender}
                            </div>
                            <div className="post-footer">
                                <span className="post-location">{p.location || '위치 정보 없음'}</span>{' '}
                                <span className="post-time">{p.timeAgo}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAB & 옵션 */}
            <div className="fab-container">
                {fabOpen && (
                    <div className="fab-options">
                        <button className="fab-option" onClick={() => navigate('/adoptionpost/add')}>
                            직접입력
                        </button>
                        <button className="fab-option" onClick={() => setSheetOpen(true)}>
                            등록 동물 선택
                        </button>
                    </div>
                )}
                <button className={`write-btn${fabOpen ? ' open' : ''}`} onClick={() => setFabOpen((o) => !o)}>
                    {fabOpen ? '+' : '게시글 작성'}
                </button>
            </div>

            {/* 등록 동물 선택 바텀시트 */}
            {sheetOpen && (
                <div className="select-sheet">
                    <div className="sheet-header">
                        <h3>반려동물 선택</h3>
                        <button className="close-sheet" onClick={() => setSheetOpen(false)}>
                            ×
                        </button>
                    </div>
                    <div className="sheet-list">
                        {pets.map((p) => (
                            <label key={p.id} className="sheet-item">
                                <input
                                    type="radio"
                                    name="pet"
                                    checked={selectedPet === p.id}
                                    onChange={() => setSelectedPet(p.id)}
                                />
                                <img src={p.image} alt={p.name} className="sheet-img" />
                                <div className="sheet-info">
                                    <strong>{p.name}</strong>
                                    <span>{p.breed}</span>
                                    <span>
                                        {p.birth} · {p.gender}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                    <button
                        className="sheet-confirm"
                        disabled={selectedPet === null}
                        onClick={() => {
                            const selected = pets.find((p) => p.id === selectedPet);
                            navigate('/adoptionpost/add', {
                                state: { petId: selectedPet, petData: selected },
                            });
                        }}
                    >
                        확인
                    </button>
                </div>
            )}

            <Footer />
            {filterSheetOpen && (
                <AdoptionFilterSheet
                    initFilter={filter}
                    onApply={(newFilter) => {
                        setFilter(newFilter);
                        setFilterSheetOpen(false);
                    }}
                    onClose={() => setFilterSheetOpen(false)}
                />
            )}
        </div>
    );
}
