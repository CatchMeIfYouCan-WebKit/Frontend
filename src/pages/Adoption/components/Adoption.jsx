import React, { useState } from 'react';
import '../Adoption.css';
import Footer from '../../../shared/Footer/Footer';
import testdog from '../../../assets/testdog.png';
import bell from '../../../assets/bell.svg';
import topmypage from '../../../assets/topmypage.svg';
import chatimg from '../../../assets/chatimg.svg';
import mark from '../../../assets/mark.svg';
import tag from '../../../assets/tag.svg';
import Header from '../../../shared/Header/components/Header';
import { useNavigate } from 'react-router-dom';

export default function Adoption() {
    const navigate = useNavigate();
    const [fabOpen, setFabOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    // 더미 게시글 (실제 데이터로 교체)
    const posts = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        image: testdog,
        title: '비숑 분양합니다',
        breed: '골든 리트리버',
        birth: '2025년 1월 생',
        gender: '남아',
        location: '구미시 거의동',
        timeAgo: '7일 전',
    }));

    // 더미 내 반려동물 목록 (바텀시트)
    const pets = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        image: testdog,
        name: '멍멍이',
        breed: '비숑',
        birth: '2025년 1월 생',
        gender: '남아',
    }));

    return (
        <div className="adoption-page">
            {/* 상단 헤더 */}
            <Header />

            {/* 배너 */}
            <div className="adoption-banner">
                <img src={mark} alt="뱃지" className="banner-badge" />
                <div className="banner-pagination">1/4</div>
            </div>

            {/* 필터 */}
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

            {/* 게시글 리스트 */}
            <div className="post-list">
                {posts.map((p) => (
                    <div key={p.id} className="post-card" onClick={() => navigate(``)}>
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
                                <span className="post-location">{p.location}</span>
                                <span className="post-time">{p.timeAgo}</span>
                                <button className="comment-btn">
                                    <img src={chatimg} alt="댓글" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAB & 옵션 */}
            <div className="fab-container">
                {fabOpen && (
                    <div className="fab-options">
                        <button
                            className="fab-option"
                            onClick={() => {
                                /* 직접입력 로직 */
                            }}
                        >
                            🖊 직접입력
                        </button>
                        <button className="fab-option" onClick={() => setSheetOpen(true)}>
                            🐾 등록 동물 선택
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

                    {/* 여기를 조건 없이 항상 렌더링 */}
                    <button
                        className="sheet-confirm"
                        disabled={selectedPet === null}
                        onClick={() => navigate('/adoptionpost')}
                    >
                        확인
                    </button>
                </div>
            )}

            {/* 하단 내비게이션 */}
            <Footer />
        </div>
    );
}
