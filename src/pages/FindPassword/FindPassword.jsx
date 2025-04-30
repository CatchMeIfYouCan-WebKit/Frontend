import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindPassword.css'; // ← ✅ 고쳤음
import EnterIdForPassword from './components/EnterIdForPassword';
import FindPasswordBody from './components/FindPasswordBody';
import ResetPasswordBody from './components/ResetPasswordBody';
import SuccessFindPassword from './components/SuccessFindPassword';
import FailFindPassword from './components/FailFindPassword';
import useFindPasswordStore from '../../store/findPasswordStore';
import { IoIosArrowBack } from 'react-icons/io';

export default function FindPassword() {
    const [fadeOut, setFadeOut] = useState(false);
    const [status, setStatus] = useState('enterId');
    const { phone, code } = useFindPasswordStore();
    const [enteredId, setEnteredId] = useState('');
    const [idError, setIdError] = useState('');
    const navigate = useNavigate();

    const checkIdExists = () => {
        if (enteredId.trim()) {
            setStatus('verifyPhone'); // 어떤 아이디든 통과
            setIdError('');
        } else {
            setIdError('아이디를 입력해주세요.');
        }
    };

    const sendAuthCode = () => {
        alert('인증번호가 발송되었습니다.');
    };

    const checkAuthCode = () => {
        const serverCode = '1234';
        if (code === serverCode) {
            setStatus('resetPassword');
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    };

    const onResetPassword = (newPassword) => {
        console.log('비밀번호 재설정 성공:', newPassword);
        setStatus('success');
    };

    const goBack = () => {
        setFadeOut(true);
        setTimeout(() => {
            navigate(-1);
        }, 400);
    };

    return (
        <div className={`find-password ${fadeOut ? 'fade-out' : ''}`}>
            <header className="find-password-header">
                <button className="back-button" onClick={goBack}>
                    <IoIosArrowBack />
                </button>
                <h1>비밀번호 찾기</h1>
            </header>

            {status === 'enterId' && (
                <EnterIdForPassword
                    enteredId={enteredId}
                    setEnteredId={setEnteredId}
                    idError={idError}
                    checkIdExists={checkIdExists}
                />
            )}
            {status === 'verifyPhone' && <FindPasswordBody onSendCode={sendAuthCode} onCheckCode={checkAuthCode} />}
            {status === 'resetPassword' && <ResetPasswordBody onResetPassword={onResetPassword} />}
            {status === 'success' && <SuccessFindPassword />}
            {status === 'fail' && <FailFindPassword />}
        </div>
    );
}
