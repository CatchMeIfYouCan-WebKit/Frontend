import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../FindPassword.css'; // ← ✅ 고쳤음
import EnterIdForPassword from './EnterIdForPassword';
import FindPasswordBody from './FindPasswordBody';
import ResetPasswordBody from './ResetPasswordBody';
import SuccessFindPassword from './SuccessFindPassword';
import FailFindPassword from './FailFindPassword';
import useFindPasswordStore from '../../../store/findPasswordStore';
import { IoIosArrowBack } from 'react-icons/io';

export default function FindPassword() {
    const [fadeOut, setFadeOut] = useState(false);
    const [status, setStatus] = useState('enterId');
    const { phone, code, loginId, setPhone, setCode, setLoginId } = useFindPasswordStore();
    const [enteredId, setEnteredId] = useState('');
    const [idError, setIdError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setPhone('');
        setCode('');
    }, []);

    // 해당 아이디 존재 여부 api
    const checkIdExists = async () => {
        if (!enteredId.trim()) {
            setIdError('아이디를 입력해주세요.');
            return;
        }

        try {
            const res = await fetch('/api/member/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loginId: enteredId }),
            });

            const result = await res.json();
            console.log('아이디 확인 응답:', result);

            const { rsltCode, rsltMsg } = result.body;

            if (rsltCode === '0000') {
                setIdError('');
                setLoginId(enteredId);
                setStatus('verifyPhone');
            } else if (rsltCode === '2003') {
                setIdError('존재하지 않는 아이디입니다.');
            } else {
                setIdError(rsltMsg || '확인 실패');
            }
        } catch (error) {
            console.error('아이디 확인 에러:', error);
            setIdError('서버 오류');
        }
    };

    const sendAuthCode = () => {
        alert('인증번호가 발송되었습니다.');
    };

    const checkAuthCode = async () => {
        const serverCode = '1234';
        if (code !== serverCode) {
            alert('인증번호가 일치하지 않습니다.');
            return;
        }

        try {
            const res = await fetch('/api/member/findId', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            const result = await res.json();
            console.log('전화번호로 찾은 아이디:', result);

            const { rsltCode, loginId } = result.body;

            if (rsltCode === '0000' && loginId === enteredId) {
                setStatus('resetPassword'); // 아이디 일치 → 인증 성공
            } else {
                setStatus('fail'); // 인증 실패
            }
        } catch (error) {
            console.error('인증 확인 중 오류:', error);
            alert('서버 오류');
        }
    };

    const onResetPassword = async (newPassword) => {
        const res = await fetch('/api/member/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId, password: newPassword }),
        });

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
