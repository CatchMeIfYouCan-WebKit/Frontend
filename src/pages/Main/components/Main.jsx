// src/pages/Main/components/Main.jsx

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Main.css';
import Footer from '../../../shared/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import logo from '../../../assets/logo2.png';
import petImage from '../../../assets/수완강아지.jpeg';
import plusIcon from '../../../assets/plus.svg';
import pencil from '../../../assets/ei_pencil.svg';
import boy from '../../../assets/boy.svg';
import girl from '../../../assets/girl.svg';

import ChartBox from '../components/ChartBox';
import reportMissingImage from '../../../assets/실종신고.svg';
import reportFoundIcon from '../../../assets/목격신고.svg';
import medicalReservationImage from '../../../assets/진료예약.svg';
import shelterBoardImage from '../../../assets/보호소게시판.svg';
import axios from 'axios';
import graph from '../../../assets/graph.svg';
// 바텀시트 컴포넌트 import
import MissingPostBottomSheet from '../../MissingForm/components/MissingPostBottomSheet';
import Header from '../../../shared/Header/components/Header';

library.add(faBell, faUser);

export default function Main() {
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    // 바텀시트 오픈 상태
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const [pets, setPets] = useState([]);
    const totalSlides = pets.length + 1; // +1: 마지막 “추가하기” 카드

    // 슬라이더 페이지 인덱스 상태
    const [currentPage, setCurrentPage] = useState(0);
    const isWeb = typeof window !== 'undefined' && window.location;

    // 슬라이더 스크롤 이벤트
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const onScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            const maxScroll = scrollWidth - clientWidth;
            const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
            setCurrentPage(Math.round(ratio * (totalSlides - 1)));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, [totalSlides]);

    // 펫 스크롤을 처음으로
    useEffect(() => {
        if (pets.length > 0 && wrapperRef.current) {
            wrapperRef.current.scrollTo({ left: 0, behavior: 'auto' }); // 초기 위치로 스크롤 이동
            setCurrentPage(0); // 페이지 표시도 초기화
        }
    }, [pets]);

    // 내 반려동물 조회 api 요청
    useEffect(() => {
        const myPets = async () => {
            try {
                const res = await axios.get('/api/animal-profile/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setPets(res.data);
            } catch (err) {
                console.error('반려동물 조회 실패:', err);
            }
        };

        myPets();
    }, []);

    // 사진 불러오기
    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    // 태어난 지 ?일 계산
    const calculateDays = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        const diff = today - birth;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    // 도트 클릭 시 해당 슬라이드로 애니메이션 이동
    const scrollTo = (idx) => {
        const el = wrapperRef.current;
        if (!el) return;
        const { scrollWidth, clientWidth } = el;
        const maxScroll = scrollWidth - clientWidth;
        const left = (maxScroll / (totalSlides - 1)) * idx;
        el.scrollTo({ left, behavior: 'smooth' });
    };

    return (
        <div className="main-page">
            {/* ===== HEADER ===== */}
            <Header />

            {/* ===== MAIN CONTENT ===== */}
            <main className="main-content">
                {/* === PET CARD SWIPE === */}
                <section className="pet-card-wrapper" ref={wrapperRef}>
                    {pets.map((pet) => (
                        <section className="pet-card" key={pet.id}>
                            {/* 등록된 펫에만 편집 버튼 표시 */}
                            <button
                                className="edit-button"
                                onClick={() => navigate('/animal-profile', { state: { mode: 'edit', pet } })}
                            >
                                {/* 백엔드 작업시 url /animal-profile/{pet.id} 이런형식으로 참고하세용 */}
                                <img src={pencil} alt="프로필 편집" />
                            </button>
                            <div className="pet-info-wrapper">
                                <img
                                    src={getImageUrl(pet.photoPath)}
                                    alt={pet.name}
                                    className="pet-image"
                                    onError={(e) => {
                                        e.target.src = '/default-image.png';
                                    }}
                                />
                                <div className="pet-text">
                                    <h2>{pet.name}</h2>
                                    <p className="pet-info">
                                        {pet.age}살 / {pet.gender}
                                        <img
                                            src={pet.gender === '남아' ? boy : girl}
                                            alt={pet.gender}
                                            className="gender-icon"
                                        />
                                    </p>
                                    <p className="pet-breed">{pet.breed}</p>
                                </div>
                            </div>
                            <button
                                className={`register-button ${pet.registrationNumber?.trim() ? 'complete' : ''}`}
                                disabled={!!pet.registrationNumber?.trim()}
                                onClick={() => {
                                    if (!pet.registrationNumber?.trim()) {
                                        navigate('/animal-profile', { state: { mode: 'edit', pet } });
                                    }
                                }}
                            >
                                {pet.registrationNumber?.trim() ? '동물등록번호 조회완료' : '동물등록번호 등록하기'}
                            </button>
                        </section>
                    ))}

                    {/* 마지막 “추가하기” 카드 */}
                    <section className="pet-card center" key="add" onClick={() => navigate('/animal-profile')}>
                        <img src={plusIcon} alt="추가하기" className="pet-add-icon" />
                        <button className="register-button">반려동물 추가하기</button>
                    </section>
                </section>

                {/* === PAGINATION DOTS === */}
                <div className="pet-pagination">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                        <span
                            key={idx}
                            className={`pet-pagination-dot${idx === currentPage ? ' active' : ''}`}
                            onClick={() => scrollTo(idx)}
                        />
                    ))}
                </div>

                {/* ===== STAT SECTION ===== */}
                <section className="stat-section">
                    <div className="stat-box-wrapper">
                        <div className="stat-text-box">
                            <div className="stat-date">
                                {new Date().toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    weekday: 'long', // 요일 (예: 월, 화, 수...)
                                })}
                            </div>

                            <div className="stat-count">
                                <strong>251</strong>건
                            </div>
                            <div className="stat-sub">오늘 실종 신고 수</div>
                        </div>
                        <div className="stat-chart-box">
                            <img src={graph} alt="통계 그래프" className="stat-chart-image" />
                        </div>
                    </div>
                </section>

                {/* ===== ACTION GRID ===== */}
                <section className="action-grid">
                    {/* 실종신고: 바텀시트 열기 */}
                    <div className="action-box tall" onClick={() => setIsSheetOpen(true)}>
                        <div className="action-content">
                            <div className="action-text">
                                <div className="action-title">
                                    <span className="red">실종</span> <span className="black">신고</span>
                                </div>
                                <div className="action-desc">지금 실종 상태를 알리세요</div>
                            </div>
                            <img src={reportMissingImage} alt="실종신고" className="action-img1" />
                        </div>
                    </div>

                    {/* 목격신고 */}
                    <div className="action-box tall" onClick={() => navigate('/report-found')}>
                        <div className="action-content">
                            <div className="action-text">
                                <div className="action-title">
                                    <span className="blue">목격</span> <span className="black">신고</span>
                                </div>
                                <div className="action-desc">목격 정보를 제보해주세요</div>
                            </div>
                            <img src={reportFoundIcon} alt="목격신고" className="action-img2" />
                        </div>
                    </div>

                    {/* 보호소게시판 */}
                    <div className="action-box tall" onClick={() => navigate('/shelterdetail')}>
                        <div className="action-content">
                            <div className="action-text">
                                <div className="action-title">
                                    <span className="green">보호소</span> <span className="black">게시판</span>
                                </div>
                                <div className="action-desc">보호소에서 관리중인 동물도 확인하세요</div>
                            </div>
                            <img src={shelterBoardImage} alt="보호소게시판" className="action-img3" />
                        </div>
                    </div>
                </section>
            </main>

            {/* ===== MISSING POST BOTTOM SHEET ===== */}
            <MissingPostBottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                pets={pets}
                onSelect={(pet) => {
                    setIsSheetOpen(false);
                    navigate('/report-missing', { state: { pet } });
                }}
            />

            {/* ===== FOOTER ===== */}
            <Footer />
        </div>
    );
}
