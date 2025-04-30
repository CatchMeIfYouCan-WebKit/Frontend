import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Map from '../../assets/Map.svg';
import MapActive from '../../assets/MapSelect.svg';
import Home from '../../assets/Home.svg';
import HomeActive from '../../assets/HomeSelect.svg';
import Chat from '../../assets/Chat.svg';
import ChatActive from '../../assets/ChatSelect.svg';
import Adoption from '../../assets/Adoption.svg';
import AdoptionActive from '../../assets/AdoptionSelect.svg';
import Medical from '../../assets/Medical.svg';
import MedicalActive from '../../assets/MedicalSelect.svg';
import './Footer.css';

export default function Footer() {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/mapmain', label: '지도', icon: Map, activeIcon: MapActive },
        { path: '/adoption', label: '입양', icon: Adoption, activeIcon: AdoptionActive },
        { path: '/main', label: '홈', icon: Home, activeIcon: HomeActive },
        { path: '/chat', label: '채팅', icon: Chat, activeIcon: ChatActive },
        { path: '/medical', label: '진료', icon: Medical, activeIcon: MedicalActive },
    ];

    return (
        <div className="Footer-container">
            <div className="Footer-wrapper">
                {navItems.map(({ path, label, icon, activeIcon }) => {
                    const isActive = currentPath === path;
                    return (
                        <Link to={path} key={label} className="Footer-item">
                            <img src={isActive ? activeIcon : icon} alt={label} className="icon" />
                            <p className={isActive ? 'active' : ''}>{label}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
