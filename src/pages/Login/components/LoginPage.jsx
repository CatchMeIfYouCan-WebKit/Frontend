import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage.css';
import logo from '../../../assets/logo2.png';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  const isValid = userId.trim() !== '' && userPw.trim() !== '';

  const handleNavigate = (path) => {
    setFade(true); 
    setTimeout(() => {
      navigate(path); 
    }, 200); 
  };

  return (
    <div className={`login-container ${fade ? 'fade-out' : ''}`}>
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
          placeholder="비밀번호를 입력해주세요."
          className="login-input"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
        />

        <div className="login-links">
          <span className="link-button" onClick={() => handleNavigate('/signup')}>회원가입</span> | 
          <span className="link-button" onClick={() => handleNavigate('/findpw')}>비밀번호 찾기</span> | 
          <span className="link-button" onClick={() => handleNavigate('/findid')}>아이디 찾기</span>
        </div>

        <button className="login-button" disabled={!isValid}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
