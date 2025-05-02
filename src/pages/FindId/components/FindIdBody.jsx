import React from 'react';
import useFindIdStore from '../../../store/findIdStore';

export default function FindIdBody({ onSendCode, onCheckCode }) {
    const { phone, code, setPhone, setCode } = useFindIdStore();

    return (
        <div className="find-id-body">
            <h2>휴대전화 번호 입력</h2>

            <div className="phone-row">
                <input
                    type="tel"
                    placeholder="휴대전화 번호('-'제외)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button className="btn gray" onClick={onSendCode}>
                    인증 요청
                </button>
            </div>

            <input
                type="tel"
                placeholder="인증번호 입력"
                className="auth-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <p className="info-text full">
                <p>
                    인증번호가 도착하지 않았을 경우
                    <br />
                    인증번호 받기 버튼을 다시 한 번 눌러주세요
                </p>
            </p>

            <button className="btn orange" onClick={onCheckCode}>
                아이디 찾기
            </button>
        </div>
    );
}
