// src/shared/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import logo from '../../../assets/logo2.png';

export default function Header() {
  const navigate = useNavigate();  // ← 추가

  return (
    <header className="main-header">
      <div className="logo-section">
        <img src={logo} alt="logo" className="logo" />
        <span className="brand">CatchMe</span>
      </div>
      <div className="icons">
        <button
          className="icon-button"
          onClick={() => navigate('/notifications')}
        >
          <FontAwesomeIcon icon={faBell} style={{ color: '#f29b30' }} />
        </button>
        <button
          className="icon-button"
          onClick={() => navigate('/mypage')}  // 이제 정상 동작
        >
          <FontAwesomeIcon icon={faUser} style={{ color: '#f29b30' }} />
        </button>
      </div>
    </header>
  );
}
