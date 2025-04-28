import React, { useState } from 'react';
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
  const { phone, code } = useFindIdStore();
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

  const checkAuthCode = () => {
    const serverCode = '1234'; // 예시 서버 인증코드
    const userExists = true;   // 예시로 아이디가 있다고 가정

    if (code === serverCode) {
      if (userExists) {
        setStatus('success'); // 성공 시 SuccessFindId로 교체
      } else {
        setStatus('fail'); // 실패 시 FailFindId로 교체
      }
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const goBack = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate(-1);
    }, 400);
  };

  return (
    <div className={`find-id ${fadeOut ? 'fade-out' : ''}`}>
      <header className="find-id-header">
        <button className="back-button" onClick={goBack}>
          <IoIosArrowBack />
        </button>
        <h1>아이디 찾기</h1>
      </header>

      {status === 'input' && (
        <FindIdBody onSendCode={sendAuthCode} onCheckCode={checkAuthCode} />
      )}
      {status === 'success' && <SuccessFindId />}
      {status === 'fail' && <FailFindId />}
    </div>
  );
}
