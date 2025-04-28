import React from 'react';
import useFindIdStore from '../../../store/findIdStore'; 

export default function FindIdBody({ onSendCode, onCheckCode }) {
  const { phone, code, setPhone, setCode } = useFindIdStore(); 

  return (
    <div className="find-id-body">
      <h2>휴대전화 번호 입력</h2>

      <div className="phone-row full">
        <input
          type="text"
          placeholder="휴대전화 번호('-'제외)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="btn gray" onClick={onSendCode}>
          인증번호 받기
        </button>
      </div>

      <input
        type="text"
        placeholder="인증번호 입력"
        className="auth-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <p className="info-text full">
        인증번호가 도착하지 않았을 경우 인증번호 받기 버튼을 다시 한 번 눌러주세요
      </p>

      <button className="btn orange" onClick={onCheckCode}>
        아이디 찾기
      </button>
    </div>
  );
}
