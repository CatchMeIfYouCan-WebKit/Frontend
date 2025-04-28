import React, { useEffect, useState } from 'react';
import '../LandingPage.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [fadeState, setFadeState] = useState('fade-in'); // 초기 페이드인

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setFadeState('fade-out'); // 페이드아웃 시작
        }, 2000); // 2초 동안 보여줌

        const timer2 = setTimeout(() => {
            navigate('/login'); // 페이지 이동
        }, 2600); // 페이드아웃 끝난 뒤 이동

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [navigate]);

    return (
        <div className={`landing-container ${fadeState}`}>
            <img src={logo} alt="Logo" className="landing-logo" />
            <h1 className="landing-title">
                Catch Me <br /> If You Can
            </h1>
        </div>
    );
};

export default LandingPage;
