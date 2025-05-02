import React, { useState, useEffect } from 'react';
import useFindPasswordStore from '../../../store/findPasswordStore';

export default function ResetPasswordBody({ onResetPassword }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const { loginId } = useFindPasswordStore;

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
        }, 500);

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
                setConfirmError('비밀번호가 일치하지 않습니다.');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [confirmPassword, newPassword]);

    const handleSubmit = () => {
        if (!newPassword || !confirmPassword) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        if (newPassword != confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwordError || confirmError) {
            alert('비밀번호 형식을 다시 확인해주세요.');
            return;
        }

        onResetPassword(newPassword);
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
