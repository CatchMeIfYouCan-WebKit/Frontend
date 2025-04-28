import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import '../Signup.css';
import SignupBody from './SignupBody'; // ✅ 새 컴포넌트 가져오기

export default function Signup() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate(-1);
    }, 400);
  };

  return (
    <div className={`signup-container ${fadeOut ? 'fade-out' : ''}`}>
      <header className="signup-header">
        <button className="back-button" onClick={goBack}>
          <IoIosArrowBack />
        </button>
        <h1>회원가입</h1>
      </header>

      <SignupBody /> 
    </div>
  );
}
