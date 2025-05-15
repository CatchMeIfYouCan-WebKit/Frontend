import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('accessToken');

        navigate('/login');
    }, [navigate]);

    return <div>로그아웃 처리 중...</div>;
}
