// src/pages/MyPage/componets/MyPage.jsx
import React from 'react';
import { IoIosSettings } from 'react-icons/io';
import '../MyPage.css';

export default function MyPage() {
    const username = '금붕대'; // 실제 로그인 정보에 맞춰 바인딩하세요

    return (
        <div className="my-page">
            {/* 상단 헤더 */}
            <header className="my-header">
                <h1>마이페이지</h1>
            </header>

            {/* 프로필 요약 */}
            <div className="profile-section">
                <div className="avatar">
                    {/* 실제 프로필 이미지가 있다면 src를 교체하세요 */}
                    <img src="https://via.placeholder.com/80" alt="avatar" />
                </div>
                <div className="greeting">
                    <p>안녕하세요!</p>
                    <strong>{username}님</strong>
                </div>
                <button className="settings-btn">
                    <IoIosSettings />
                </button>
            </div>

            {/* 섹션 리스트 */}
            <div className="section">
                <h2>내 정보 수정</h2>
                <ul>
                    <li>비밀번호 변경</li>
                    <li>닉네임 변경</li>
                    <li>휴대전화 인증 변경</li>
                </ul>
            </div>

            <div className="section">
                <h2>이용안내</h2>
                <ul>
                    <li>앱 버전</li>
                    <li>캐치미 안내</li>
                    <li>커뮤니티 규칙</li>
                    <li>서비스 이용약관</li>
                </ul>
            </div>

            <div className="section">
                <h2>기타</h2>
                <ul>
                    <li>정보동의 설정</li>
                    <li>캐치미 안내</li>
                    <li>서비스 이용약관</li>
                </ul>
            </div>
        </div>
    );
}
