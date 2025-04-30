import React, { useState } from 'react';
import '../SuccessFindPassword.css'; // 새 CSS 파일
import { useNavigate } from 'react-router-dom';

export default function SuccessFindPassword() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    const goLogin = () => {
        setFadeOut(true);
        setTimeout(() => {
            navigate('/login');
        }, 200);
    };

    return (
        <div className={`success-findpw-body ${fadeOut ? 'fade-out' : ''}`}>
            <h2 className="title">비밀번호 재설정 완료</h2>
            <p className="subtitle">
                비밀번호가 성공적으로 변경되었습니다.
                <br />
                로그인 페이지로 이동해주세요.
            </p>
            <hr />
            <div className="button-group">
                <button className="btn login-btn" onClick={goLogin}>
                    로그인
                </button>
            </div>
        </div>
    );
}
