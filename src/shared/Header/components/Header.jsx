// src/shared/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import logo from '../../../assets/logo2.png';

export default function Header() {
    const navigate = useNavigate(); // ← 추가

    return (
        <header className="main-header">
            <div className="logo-section">
                <span className="brand">CatchMe</span>
            </div>
            <div className="icons">
                <button className="icon-button" onClick={() => navigate('/ChatListTest')}>
                    {' '}
                    <FontAwesomeIcon icon={faBell} style={{ color: '#ffffff' }} />
                </button>

                <button
                    className="icon-button"
                    onClick={() => navigate('/mypage')} // 이제 정상 동작
                >
                    <FontAwesomeIcon icon={faUser} style={{ color: '#ffffff' }} />
                </button>
            </div>
        </header>
    );
}
