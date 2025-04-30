import React from 'react';
import { useNavigate } from 'react-router-dom';
import dogLogo from '../../../assets/logo2.png';
import '../SuccessSignup.css';

export default function SuccessSignup() {
    const navigate = useNavigate();

    return (
        <div className="success-signup-container">
            <h1 className="title">회원가입완료</h1>
            <hr className="divider" />
            <h2 className="subtitle">회원가입이 완료되었습니다</h2>
            <p className="description">
                지금부터 다양한 기능을 <br /> 이용하실 수 있습니다!
            </p>

            <img src={dogLogo} alt="완료 로고" className="dog-logo" />

            <div className="login-button-wrapper">
                <button className="login-button" onClick={() => navigate('/login')}>
                    로그인
                </button>
            </div>
        </div>
    );
}
