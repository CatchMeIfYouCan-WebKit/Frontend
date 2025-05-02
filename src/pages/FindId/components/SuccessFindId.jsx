import React, { useState } from 'react';
import '../SuccessFindId.css';
import { useNavigate } from 'react-router-dom';

export default function SuccessFindId({ loginId }) {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    const goLogin = () => {
        setFadeOut(true);
        setTimeout(() => {
            navigate('/login');
        }, 200);
    };

    const goFindPassword = () => {
        setFadeOut(true);
        setTimeout(() => {
            navigate('/findpw');
        }, 200);
    };

    return (
        <div className={`success-findid-body ${fadeOut ? 'fade-out' : ''}`}>
            <h2 className="title">아이디 검색 내역</h2>
            <p className="subtitle">
                고객님의 정보와 일치하는 아이디입니다.
                <br />
                로그인 또는 비밀번호 찾기 버튼을 눌러주세요.
            </p>
            <hr />
            <p className="user-id">{loginId}</p>

            <div className="button-group">
                <button className="btn login-btn" onClick={goLogin}>
                    로그인
                </button>
                <button className="btn findpw-btn" onClick={goFindPassword}>
                    비밀번호 찾기
                </button>
            </div>
        </div>
    );
}
