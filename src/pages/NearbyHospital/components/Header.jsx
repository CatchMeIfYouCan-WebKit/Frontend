import React from 'react';

const Header = () => {
    return (
        <header className="nearby-header">
            <div className="nearby-location-selector">
                <span>구미시 거의동</span>
                <span className="dropdown-icon" style={{ fontSize: '12px' }}>
                    ▼
                </span>
            </div>
            <div className="nearby-subtitle">진료받을 병원을 선택해주세요</div>
        </header>
    );
};

export default Header;
