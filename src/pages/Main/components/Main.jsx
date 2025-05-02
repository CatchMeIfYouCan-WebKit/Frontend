// src/pages/Main/Main.jsx
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
import pencil from '../../../assets/ei_pencil.svg'; // ✎ 연필 아이콘

import ChartBox from '../components/ChartBox';
import reportMissingImage from '../../../assets/실종신고.svg';
import reportFoundIcon from '../../../assets/목격신고.svg';
import medicalReservationImage from '../../../assets/진료예약.svg';
import shelterBoardImage from '../../../assets/보호소게시판.svg';

library.add(faBell, faUser);

export default function Main() {
    const navigate = useNavigate();

    // — 예시용 펫 배열 (여러 마리 등록 시 여기에 추가) —
    const pets = [
        {
            id: 1,
            name: '나비',
            age: '3살',
            gender: '남아',
            breed: '비숑',
            days: 920,
            img: petImage,
        },
        {
            id: 2,
            name: '형규',
            age: '3살',
            gender: '여아',
            breed: '말티즈',
            days: 950,
            img: petImage,
        },
        // …추가 등록 가능
    ];

    const totalSlides = pets.length + 1; // +1: 마지막 “추가하기” 카드
    const wrapperRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);

    // 스크롤 위치에 따라 현재 페이지(슬라이드) 계산
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
            <header className="main-header">
                <div className="logo-section">
                    <img src={logo} alt="logo" className="logo" />
                    <span className="brand">CatchMe</span>
                </div>
                <div className="icons">
                    <button className="icon-button">
                        <FontAwesomeIcon icon={faBell} style={{ color: '#f29b30' }} />
                    </button>
                    <button className="icon-button" onClick={() => navigate('/mypage')}>
                        <FontAwesomeIcon icon={faUser} style={{ color: '#f29b30' }} />
                    </button>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="main-content">
                {/* === PET CARD SWIPE === */}
                <section className="pet-card-wrapper" ref={wrapperRef}>
                    {pets.map((pet) => (
                        <section className="pet-card" key={pet.id}>
                            {/* 등록된 펫에만 편집 버튼 표시 */}
                            <button className="edit-button" onClick={() => navigate('/animal-profile')}>
                                {/* 백엔드 작업시 url /animal-profile/{pet.id} 이런형식으로 참고하세용 */}
                                <img src={pencil} alt="프로필 편집" />
                            </button>

                            <div className="pet-info-wrapper">
                                <img src={pet.img} alt={pet.name} className="pet-image" />
                                <div className="pet-text">
                                    <h2>{pet.name}</h2>
                                    <p>
                                        {pet.age} / {pet.gender}
                                    </p>
                                    <p>{pet.breed}</p>
                                    <p>태어난지 {pet.days}일</p>
                                </div>
                            </div>
                            <button className="register-button" onClick={() => navigate('/animal-profile')}>
                                등록번호 조회 안함
                            </button>
                        </section>
                    ))}

                    {/* 마지막 “추가하기” 카드 (편집 버튼 없음) */}
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
                    <ChartBox />
                </section>

                {/* ===== ACTION GRID ===== */}
                <section className="action-grid">
                    <div className="action-box tall" onClick={() => navigate('/report-missing')}>
                        <div className="action-content">
                            <div className="action-text">
                                <div className="action-title">
                                    <span className="red">실종</span> <span className="black">신고</span>
                                </div>
                                <div className="action-desc">
                                    강아지를
                                    <br /> 잃었다면
                                    <br /> 바로 신고!
                                </div>
                            </div>
                            <img src={reportMissingImage} alt="실종신고" className="action-img" />
                        </div>
                    </div>
                    <div className="action-box tall" onClick={() => navigate('/report-found')}>
                        <div className="action-content">
                            <div className="action-text">
                                <div className="action-title">
                                    <span className="blue">목격</span> <span className="black">신고</span>
                                </div>
                                <div className="action-desc">
                                    강아지를
                                    <br /> 발견하면
                                    <br /> 찰칵!
                                </div>
                            </div>
                            <img src={reportFoundIcon} alt="목격신고" className="action-img" />
                        </div>
                    </div>
                    <div className="action-box tall" onClick={() => navigate('/medical')}>
                        <div className="action-content">
                            <div className="action-text">
                                <div className="action-title">
                                    <span className="yellow">진료</span> <span className="black">예약</span>
                                </div>
                                <div className="action-desc">
                                    강아지가
                                    <br /> 아프다면
                                    <br /> 바로 예약!
                                </div>
                            </div>
                            <img src={medicalReservationImage} alt="진료예약" className="action-img" />
                        </div>
                    </div>
                    <div className="action-box tall" onClick={() => navigate('/shelter-board')}>
                        <div className="action-content">
                            <div className="action-text">
                                <div className="action-title">
                                    <span className="green">보호소</span> <span className="black">게시판</span>
                                </div>
                                <div className="action-desc">
                                    잃어버렸다면
                                    <br /> 확인!
                                </div>
                            </div>
                            <img src={shelterBoardImage} alt="보호소게시판" className="action-img" />
                        </div>
                    </div>
                </section>
            </main>

            {/* ===== FOOTER ===== */}
            <Footer />
        </div>
    );
}
