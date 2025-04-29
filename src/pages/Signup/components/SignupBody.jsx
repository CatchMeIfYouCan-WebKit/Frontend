import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupBody() {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userPwConfirm, setUserPwConfirm] = useState('');
    const [nickname, setNickname] = useState('');

    const [idMessage, setIdMessage] = useState('');
    const [pwMessage, setPwMessage] = useState('');
    const [pwConfirmMessage, setPwConfirmMessage] = useState('');
    const [nickMessage, setNickMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (userId.trim() === '') {
            setIdMessage('');
            return;
        }
        const timer = setTimeout(() => {
            if (userId === 'testuser') {
                setIdMessage('중복된 아이디입니다.');
            } else {
                setIdMessage('사용 가능한 아이디입니다.');
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [userId]);

    useEffect(() => {
        if (userPw.trim() === '') {
            setPwMessage('');
            return;
        }
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (pwRegex.test(userPw)) {
            setPwMessage('');
        } else {
            setPwMessage('영문, 숫자, 특수문자 포함 8자 이상 입력하세요.');
        }
    }, [userPw]);

    useEffect(() => {
        if (userPwConfirm.trim() === '') {
            setPwConfirmMessage('');
            return;
        }
        if (userPw === userPwConfirm) {
            setPwConfirmMessage('비밀번호가 일치합니다.');
        } else {
            setPwConfirmMessage('비밀번호가 일치하지 않습니다.');
        }
    }, [userPw, userPwConfirm]);

    useEffect(() => {
        if (nickname.trim() === '') {
            setNickMessage('');
            return;
        }
        const timer = setTimeout(() => {
            if (nickname === 'nickname1') {
                setNickMessage('중복된 닉네임입니다.');
            } else {
                setNickMessage('사용 가능한 닉네임입니다.');
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [nickname]);

    const isFormValid =
        idMessage === '사용 가능한 아이디입니다.' &&
        pwMessage === '' &&
        pwConfirmMessage === '비밀번호가 일치합니다.' &&
        nickMessage === '사용 가능한 닉네임입니다.';

    return (
        <div className="signup-body">
            <div className="input-group">
                <label>아이디</label>
                <input
                    type="text"
                    placeholder="아이디 입력"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                {idMessage && <p className={idMessage.includes('사용 가능') ? 'success' : 'error'}>{idMessage}</p>}{' '}
            </div>

            <div className="input-group">
                <label>비밀번호</label>
                <input
                    type="password"
                    placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
                    value={userPw}
                    onChange={(e) => setUserPw(e.target.value)}
                />
                {pwMessage && <p className="error">{pwMessage}</p>}
            </div>

            <div className="input-group">
                <label>비밀번호 확인</label>
                <input
                    type="password"
                    placeholder="비밀번호 다시 입력"
                    value={userPwConfirm}
                    onChange={(e) => setUserPwConfirm(e.target.value)}
                />
                {pwConfirmMessage && (
                    <p className={pwConfirmMessage.includes('일치합니다') ? 'success' : 'error'}>{pwConfirmMessage}</p>
                )}
            </div>

            <div className="input-group">
                <label>닉네임</label>
                <input
                    type="text"
                    placeholder="닉네임 입력"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <p className={nickMessage.includes('사용 가능') ? 'success' : 'error'}>{nickMessage}</p>
            </div>

            <button className="next-button" onClick={() => navigate('/successsignup')} disabled={!isFormValid}>
                다음
            </button>
        </div>
    );
}
