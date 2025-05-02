// src/pages/MyPage/components/MyPage.jsx
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { FaCog, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../MyPage.css';

export default function MyPage() {
    const navigate = useNavigate();

    return (
        <div className="my-page">
            <header className="my-page-header">
                <button className="back-button" onClick={() => window.history.back()}>
                    <IoIosArrowBack size={24} />
                </button>
                <h1>마이페이지</h1>
            </header>

            <section className="profile-section">
                <div className="avatar-wrapper">
                    <div className="avatar" />
                    <button className="avatar-edit" aria-label="프로필 사진 변경">
                        <FaCamera size={16} color="#888" />
                    </button>
                </div>
                <div className="user-info">
                    <div className="user-greeting">안녕하세요!</div>
                    <div className="user-name">금오공대님</div>
                </div>
                <button className="settings-button" aria-label="설정">
                    <FaCog size={20} color="#888" />
                </button>
            </section>

            <div className="menu-group1">
                <div className="group-title">내 정보 수정</div>
                <div className="menu-item" onClick={() => navigate('/change-password')}>
                    비밀번호 변경
                </div>
                <div className="menu-item" onClick={() => navigate('/change-nickname')}>
                    닉네임 변경
                </div>
                <div className="menu-item" onClick={() => navigate('/verify-phone')}>
                    휴대전화 인증 변경
                </div>
            </div>

            <div className="menu-group2">
                <div className="group-title">이용안내</div>
                <div className="menu-item" onClick={() => navigate('/app-version')}>
                    앱 버전
                </div>
                <div className="menu-item" onClick={() => navigate('/catchme-info')}>
                    캐치미 안내
                </div>
                <div className="menu-item" onClick={() => navigate('/community-rules')}>
                    커뮤니티 규칙
                </div>
                <div className="menu-item" onClick={() => navigate('/terms-of-service')}>
                    서비스 이용약관
                </div>
                <div className="menu-item" onClick={() => navigate('/privacy-settings')}>
                    정보동의 설정
                </div>
            </div>

            <div className="menu-group3">
                <div className="group-title">기타</div>

                <div className="menu-item" onClick={() => navigate('/delete-account')}>
                    회원 탈퇴
                </div>
                <div className="menu-item" onClick={() => navigate('/logout')}>
                    로그아웃
                </div>
            </div>
        </div>
    );
}
