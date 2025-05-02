import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupBody() {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userPwConfirm, setUserPwConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');

    const [idMessage, setIdMessage] = useState('');
    const [pwMessage, setPwMessage] = useState('');
    const [pwConfirmMessage, setPwConfirmMessage] = useState('');
    const [nickMessage, setNickMessage] = useState('');
    const [phoneMessage, setPhoneMessage] = useState('');

    const navigate = useNavigate();

    // 회원가입 api 요청
    const handleSignup = async () => {
        if (!isFormValid) return;

        try {
            const response = await fetch('/api/member/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    loginId: userId,
                    password: userPw,
                    nickname,
                    phone,
                }),
            });

            const result = await response.json();
            console.log(result); // 응답 결과 확인용

            if (response.ok && result.body.rsltCode === '0000') {
                navigate('/successsignup');
            } else {
                alert(result.body.rsltMsg || '회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            alert('오류 발생');
        }
    };

    useEffect(() => {
        if (userId.trim() === '') {
            setIdMessage('');
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch('/api/member/duplicate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ loginId: userId }),
                });

                const result = await res.json();
                const { rsltCode, rsltMsg, dupYn } = result.body;

                if (rsltCode === '0000' && dupYn === 'N') {
                    setIdMessage('사용 가능한 아이디입니다.');
                } else if (rsltCode === '2002' && dupYn === 'Y') {
                    setIdMessage('중복된 아이디입니다.');
                } else if (rsltCode === '2001') {
                    setIdMessage('아이디 형식이 올바르지 않습니다. (5자 이상)');
                } else {
                    setIdMessage(rsltMsg || '아이디 확인 실패');
                }
            } catch (e) {
                setIdMessage('서버 오류');
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

        const timer = setTimeout(async () => {
            try {
                const res = await fetch('/api/member/duplicate/nickname', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nickname }),
                });

                const result = await res.json();
                const { rsltCode, rsltMsg, dupYn } = result.body;

                if (rsltCode === '0000' && dupYn === 'N') {
                    setNickMessage('사용 가능한 닉네임입니다.');
                } else if (rsltCode === '2002' && dupYn === 'Y') {
                    setNickMessage('중복된 닉네임입니다.');
                } else {
                    setNickMessage(rsltMsg || '닉네임 확인 실패');
                }
            } catch (e) {
                setNickMessage('서버 오류');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [nickname]);

    useEffect(() => {
        if (phone.trim() === '') {
            setPhoneMessage('');
            return;
        }
        const phoneRegex = /^010\d{8}$/;
        if (phoneRegex.test(phone)) {
            setPhoneMessage('올바른 형식입니다.');
        } else {
            setPhoneMessage('010으로 시작하는 11자리 숫자를 입력하세요.');
        }
    }, [phone]);

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
                {nickMessage && (
                    <p className={nickMessage.includes('사용 가능') ? 'success' : 'error'}>{nickMessage}</p>
                )}
            </div>

            <div className="input-group">
                <label>휴대전화</label>
                <input
                    type="tel"
                    placeholder="휴대전화 입력"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                {phoneMessage && (
                    <p className={phoneMessage.includes('올바른') ? 'success' : 'error'}>{phoneMessage}</p>
                )}
            </div>

            <button className="next-button" onClick={handleSignup} disabled={!isFormValid}>
                다음
            </button>
        </div>
    );
}
