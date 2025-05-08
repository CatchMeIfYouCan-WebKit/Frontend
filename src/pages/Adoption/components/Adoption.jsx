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

export default function Adoption() {
    const navigate = useNavigate();
    const { state } = useLocation();

    // ─ FAB & BottomSheet 상태 ─
    const [fabOpen, setFabOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const [addresses, setAddresses] = useState({});

    // ─ 더미 기본 게시글 ─
    const defaultPosts = Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        image: testdog,
        title: '비숑 분양합니다',
        breed: '골든 리트리버',
        birth: '2025년 1월 생',
        gender: '남아',
        location: '구미시 거의동',
        timeAgo: '7일 전',
    }));

    // ─ posts 상태 선언 ─
    const [posts, setPosts] = useState(defaultPosts);

    // ─ useEffect: state.newPost가 넘어오면 한 번만 앞에 추가 ─
    useEffect(() => {
        if (state?.newPost) {
            setPosts((prev) => {
                if (prev.some((p) => p.id === state.newPost.id)) return prev;
                return [state.newPost, ...prev];
            });
        }
    }, [state?.newPost]);

    // ─ 더미 내 반려동물 목록 (BottomSheet) ─
    const pets = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        image: testdog,
        name: '멍멍이',
        breed: '비숑',
        birth: '2025년 1월 생',
        gender: '남아',
    }));

    // ─ pagination 상태 ─
    const [page, setPage] = useState(1);
    const postsPerPage = 4;
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const currentPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

    useEffect(() => {
        // load Kakao SDK
        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&libraries=services&autoload=false';
        script.async = true;
        document.head.appendChild(script);
        script.onload = () => {
            window.kakao.maps.load(() => {
                const geocoder = new window.kakao.maps.services.Geocoder();
                currentPosts.forEach((p) => {
                    const loc = p.location;
                    const match = loc.match(/([-\d.]+)\s*,\s*([-\d.]+)/);
                    if (match) {
                        const lat = parseFloat(match[1]);
                        const lng = parseFloat(match[2]);
                        geocoder.coord2Address(lng, lat, (result, status) => {
                            if (status === window.kakao.maps.services.Status.OK && result[0]) {
                                setAddresses((prev) => ({
                                    ...prev,
                                    [p.id]: result[0].address.address_name,
                                }));
                            }
                        });
                    }
                });
            });
        };
        return () => {
            document.head.removeChild(script);
        };
    }, [currentPosts]);

    return (
        <div className="adoption-page">
            <Header />

            <div className="adoption-banner">
                <img src={mark} alt="뱃지" className="banner-badge" />
                <div className="banner-pagination">1/4</div>
            </div>

            <div className="adoption-header">
                <div className="filters">
                    <div className="filter">지역</div>
                    <div className="filter">나이</div>
                    <div className="filter">품종</div>
                    <div className="filter">색상</div>
                    <div className="filter-tag">
                        <img src={tag} alt="필터" />
                    </div>
                </div>
            </div>

            {/* ─ 게시글 리스트 ─ */}
            <div className="post-list">
                {currentPosts.map((p) => (
                    <div
                        key={p.id}
                        className="post-card"
                        onClick={() => navigate(`/adoptionpost/${p.id}`, { state: { post: p, ownerName: '한민규' } })}
                    >
                        <img src={p.image} alt={p.title} className="post-img" />
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
                                <span className="post-location">{addresses[p.id] || p.location}</span>{' '}
                                <span className="post-time">{p.timeAgo}</span>
                                <button className="comment-btn">
                                    <img src={chatimg} alt="댓글" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─ 페이지 네비게이션 ─ */}
            <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                    이전
                </button>
                <span className="page-info">
                    {page} / {totalPages}
                </span>
                <button disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
                    다음
                </button>
            </div>

            {/* ─ FAB & 옵션 ─ */}
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

            {/* ─ 등록 동물 선택 바텀시트 ─ */}
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
                        onClick={() => navigate('/adoptionpost/add', { state: { petId: selectedPet } })}
                    >
                        확인
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
}
