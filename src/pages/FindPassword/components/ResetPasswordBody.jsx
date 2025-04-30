import React, { useState, useEffect } from 'react';

export default function ResetPasswordBody({ onResetPassword }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    // 비밀번호 형식 검사 - 3초 디바운싱
    useEffect(() => {
        if (!newPassword) {
            setPasswordError('');
            return;
        }

        const timer = setTimeout(() => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
            if (passwordRegex.test(newPassword)) {
                setPasswordError('');
            } else {
                setPasswordError('유효한 비밀번호 형식이 아닙니다');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [newPassword]);

    // 비밀번호 확인 검사 - 3초 디바운싱
    useEffect(() => {
        if (!confirmPassword) {
            setConfirmError('');
            return;
        }

        const timer = setTimeout(() => {
            if (newPassword === confirmPassword) {
                setConfirmError('');
            } else {
                setConfirmError('암호를 다시 확인하세요');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [confirmPassword, newPassword]);

    const handleSubmit = () => {
        if (!passwordError && !confirmError && newPassword && confirmPassword) {
            onResetPassword(newPassword);
        }
    };

    return (
        <div className="find-password-body">
            <h2>비밀번호 재설정</h2>

            <input
                type="password"
                placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
                className="auth-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}

            <input
                type="password"
                placeholder="비밀번호 재확인"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmError && <p className="error-message">{confirmError}</p>}

            <button className="btn orange" onClick={handleSubmit}>
                확인
            </button>
        </div>
    );
}
