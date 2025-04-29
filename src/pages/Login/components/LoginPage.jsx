import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage.css';
import logo from '../../../assets/logo2.png';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [fade, setFade] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isValid = userId.trim() !== '' && userPw.trim() !== '';

    const handleNavigate = (path) => {
        setFade(true);
        setTimeout(() => {
            navigate(path);
        }, 200);
    };

    const handleLogin = () => {
        if (!isValid) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/home');
        }, 500);
    };

    return (
        <div className={`login-container ${fade ? 'fade-out' : ''}`}>
            <div className="login-wrapper">
                <img src={logo} alt="logo" className="login-logo" />

                <form className="form-container">
                    <div className="form-group-custom">
                        <input
                            type="text"
                            placeholder="아이디 입력"
                            className="login-input"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>

                    <div className="form-group-custom">
                        <input
                            type="password"
                            placeholder="비밀번호 입력"
                            className="login-input"
                            value={userPw}
                            onChange={(e) => setUserPw(e.target.value)}
                        />
                    </div>

                    <div className="button-wrapper">
                        <button
                            className="login-button"
                            onClick={handleLogin}
                            disabled={!isValid || isLoading}
                            type="button"
                        >
                            {isLoading ? (
                                <span className="spinner-wrapper">
                                    <span className="spinner"></span>
                                    <span className="loading-text">로그인 중...</span>
                                </span>
                            ) : (
                                '로그인'
                            )}
                        </button>
                    </div>
                </form>

                <div className="login-links">
                    <span className="link-button" onClick={() => handleNavigate('/signup')}>
                        회원가입
                    </span>{' '}
                    |
                    <span className="link-button" onClick={() => handleNavigate('/findid')}>
                        아이디 찾기
                    </span>{' '}
                    |
                    <span className="link-button" onClick={() => handleNavigate('/findpw')}>
                        비밀번호 찾기
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
