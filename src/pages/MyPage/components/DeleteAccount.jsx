import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteAccount() {
    const navigate = useNavigate();
    const hasConfirmed = useRef(false); // 리렌더링에도 값 유지

    useEffect(() => {
        if (!hasConfirmed.current) {
            const confirmed = window.confirm('정말로 회원 탈퇴하시겠습니까?');

            if (confirmed) {
                localStorage.removeItem('accessToken');
                navigate('/login');
            } else {
                navigate('/mypage');
            }

            hasConfirmed.current = true; // 한 번만 실행
        }
    }, [navigate]);

    return <div>회원 탈퇴 처리 중...</div>;
}
