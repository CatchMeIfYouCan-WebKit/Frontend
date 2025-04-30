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
import ChartBox from '../components/ChartBox'; // ✅ 분리된 컴포넌트 가져오기

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
                    <button className="icon-button">
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
                    <button className="register-button">등록번호 조회 안함</button>
                </section>

                <section className="stat-section">
                    <ChartBox />
                </section>

                <section className="action-grid">
                    <div className="action-box red tall" onClick={() => navigate('/report-missing')}>
                        실종 신고
                        <br />
                        강아지를 잃었다면 바로 신고!
                    </div>
                    <div className="action-box blue tall" onClick={() => navigate('/report-found')}>
                        목격 신고
                        <br />
                        강아지를 발견하면 찰칵!
                    </div>
                    <div className="action-box yellow tall" onClick={() => navigate('/medical')}>
                        진료 예약
                        <br />
                        강아지가 아프다면 바로 예약!
                    </div>
                    <div className="action-box green tall" onClick={() => navigate('/shelter-board')}>
                        보호소 게시판
                        <br />
                        잃어버렸다면 확인!
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
