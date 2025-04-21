import React, { useState } from 'react';
import '../styles/LoginPage.css';
import logo from '../assets/logo2.png';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');

    const isValid = userId.trim() !== '' && userPw.trim() !== '';

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h1 className="login-title">Login</h1>
                <img src={logo} alt="logo" className="login-logo" />

                <input
                    type="text"
                    placeholder="아이디를 입력해주세요."
                    className="login-input"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="************"
                    className="login-input"
                    value={userPw}
                    onChange={(e) => setUserPw(e.target.value)}
                />

                <div className="login-links">
                    <a href="#">회원가입</a> | <a href="#">비밀번호 찾기</a> | <a href="#">아이디 찾기</a>
                </div>

                <button className="login-button" disabled={!isValid}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
