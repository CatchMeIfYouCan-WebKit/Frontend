import React, { useEffect, useState } from 'react';
import '../FindId.css';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import FindIdBody from './FindIdBody';
import SuccessFindId from './SuccessFindId';
import FailFindId from './FailFindId';
import useFindIdStore from '../../../store/findIdStore';

export default function FindId() {
    const [fadeOut, setFadeOut] = useState(false);
    const [status, setStatus] = useState('input'); // 'input' | 'success' | 'fail'
    const { phone, code, setPhone, setCode } = useFindIdStore();
    const [foundId, setFoundId] = useState('');
    const navigate = useNavigate();

    const sendAuthCode = async () => {
        try {
            // 예시로 axios 요청하는 자리 (실제 구현 시 필요)
            // 성공하면 안내 메시지
            alert('인증번호가 발송되었습니다.');
        } catch (error) {
            console.error(error);
            alert('인증번호 요청 실패');
        }
    };

    const checkAuthCode = async () => {
        if (code !== '1234') {
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
            console.log(result);

            const { rsltCode, rsltMsg, loginId } = result.body;

            if (rsltCode === '0000') {
                setFoundId(loginId); // 아이디 저장
                setStatus('success');
            } else if (rsltCode === '2003') {
                setStatus('fail');
            } else {
                alert(rsltMsg || '아이디 찾기 실패');
            }
        } catch (error) {
            console.error('아이디 찾기 에러:', error);
            alert('서버 오류');
        }
    };

    const goBack = () => {
        setFadeOut(true);
        setTimeout(() => {
            navigate(-1);
        }, 400);
    };

    useEffect(() => {
        setPhone('');
        setCode('');
    }, []);

    return (
        <div className={`find-id ${fadeOut ? 'fade-out' : ''}`}>
            <header className="find-id-header">
                <button className="back-button" onClick={goBack}>
                    <IoIosArrowBack />
                </button>
                <h1>아이디 찾기</h1>
            </header>

            {status === 'input' && <FindIdBody onSendCode={sendAuthCode} onCheckCode={checkAuthCode} />}
            {status === 'success' && <SuccessFindId loginId={foundId} />}
            {status === 'fail' && <FailFindId />}
        </div>
    );
}
