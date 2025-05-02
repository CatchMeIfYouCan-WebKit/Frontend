// src/pages/Main/Main.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Main.css';
import Footer from '../../../shared/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import logo from '../../../assets/logo2.png';
import petImage from '../../../assets/수완강아지.jpeg';
import ChartBox from '../components/ChartBox';
import reportFoundIcon from '../../../assets/목격신고.svg';
import medicalReservationImage from '../../../assets/진료예약.svg';
import reportMissingImage from '../../../assets/실종신고.svg';
import shelterBoardImage from '../../../assets/보호소게시판.svg';

library.add(faBell, faUser);

export default function Main() {
    const navigate = useNavigate();

    return (
        <div className="main-page">
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

            <main className="main-content">
                <section className="pet-card">
                    <div className="pet-info-wrapper">
                        <img src={petImage} alt="프로필" className="pet-image" />
                        <div className="pet-text">
                            <h2>나비</h2>
                            <p>3살 / 남아</p>
                            <p>비숑</p>
                            <p>태어난지 920일</p>
                        </div>
                    </div>
                    <button className="register-button" onClick={() => navigate('/animal-profile')}>
                        등록번호 조회 안함
                    </button>
                </section>

                <section className="stat-section">
                    <ChartBox />
                </section>

                <section className="action-grid">
                    <div className="action-box tall" onClick={() => navigate('/report-missing')}>
                        <div className="action-content">
                            <div className="action-text red">
                                <div className="action-title">실종 신고</div>
                                <div className="action-desc">
                                    강아지를
                                    <br />
                                    잃었다면
                                    <br />
                                    바로 신고!
                                </div>
                            </div>
                            <img src={reportMissingImage} alt="실종신고" className="action-img" />
                        </div>
                    </div>

                    <div className="action-box tall" onClick={() => navigate('/report-found')}>
                        <div className="action-content">
                            <div className="action-text blue">
                                <div className="action-title">목격 신고</div>
                                <div className="action-desc">
                                    강아지를
                                    <br />
                                    발견하면
                                    <br />
                                    찰칵!
                                </div>
                            </div>
                            <img src={reportFoundIcon} alt="목격신고" className="action-img" />
                        </div>
                    </div>

                    <div className="action-box tall" onClick={() => navigate('/medical')}>
                        <div className="action-content">
                            <div className="action-text yellow">
                                <div className="action-title">진료 예약</div>
                                <div className="action-desc">
                                    강아지가 <br />
                                    아프다면
                                    <br />
                                    바로 예약!
                                </div>
                            </div>
                            <img src={medicalReservationImage} alt="진료예약" className="action-img" />
                        </div>
                    </div>

                    <div className="action-box tall" onClick={() => navigate('/shelter-board')}>
                        <div className="action-content">
                            <div className="action-text green">
                                <div className="action-title">보호소 게시판</div>
                                <div className="action-desc">
                                    잃어버렸다면
                                    <br />
                                    확인!
                                </div>
                            </div>
                            <img src={shelterBoardImage} alt="보호소게시판" className="action-img" />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
