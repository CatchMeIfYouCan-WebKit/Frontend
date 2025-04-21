import React from 'react';
import '../styles/LandingPage.css';
import logo from '../assets/logo.png';

const LandingPage = () => {
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
