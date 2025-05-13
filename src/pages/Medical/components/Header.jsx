import React from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../../assets/search.svg';
import calenderIcon from '../../../assets/calender.svg';
import receiptIcon from '../../../assets/receipt.svg';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="medical-header">
            <div className="location-selector">
                <span>구미시 거의동</span>
                <span className="dropdown-icon" style={{ fontSize: '12px' }}>
                    ▼
                </span>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="찾으시는 병원을 검색하세요" />
                <button className="search-button">
                    <img src={searchIcon} alt="검색" style={{ width: '3.2vh', height: '3.2vh' }} />
                </button>
            </div>
            <div className="icon-buttons">
                {/* ✅ 첫 번째 진료예약 클릭 시 이동 */}
                <div className="icon" onClick={() => navigate('/nearby-hospital')}>
                    <img src={calenderIcon} alt="진료예약" style={{ width: '4vh', height: '4vh' }} />
                    <div>진료예약</div>
                </div>
                {/* 나머지는 동작 없음 */}
                <div className="icon">
                    <img src={receiptIcon} alt="진료내역" style={{ width: '4.0vh', height: '4.0\\vh' }} />
                    <div>진료내역</div>
                </div>
                <div className="icon">
                    <img src={calenderIcon} alt="진료예약" style={{ width: '4.0vh', height: '4.0vh' }} />
                    <div>진료예약</div>
                </div>
                <div className="icon">
                    <img src={calenderIcon} alt="진료예약" style={{ width: '4.0vh', height: '4.0vh' }} />
                    <div>진료예약</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
