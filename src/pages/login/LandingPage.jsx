import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login/LandingPage.css';
import logo from '../../assets/logo.png';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000); // 3초 후 이동

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    }, [navigate]);

    return (
        <div className="landing-container">
            <img src={logo} alt="Logo" className="landing-logo" />
            <h1 className="landing-title">
                Catch Me <br /> If You Can
            </h1>
        </div>
    );
};

export default LandingPage;
