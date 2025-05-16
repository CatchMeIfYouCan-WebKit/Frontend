// src/pages/MyPage/components/MyPage.jsx
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { FaCog, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../MyPage.css';
import user from '../../../assets/users.svg';
import option from '../../../assets/options.svg';
import BackHeader from '../../../shared/BackHeader/components/BackHeader';
import axios from 'axios';

export default function MyPage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    // API : 회원정보 조회
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('accessToken');
            console.log('토큰:', token);

            if (!token) {
                console.warn('토큰이 없습니다.');
                return;
            }

            try {
                const payloadBase64 = token.split('.')[1];
                const payloadJson = atob(payloadBase64);
                const payload = JSON.parse(payloadJson);

                const id = payload.id;

                const response = await axios.post('/api/member/info', { id });
                setUserInfo(response.data);
            } catch (err) {
                console.error('토큰 파싱 에러:', err);
            }
        };

        fetchUserInfo();
    }, []);

    console.log('회원 정보:', userInfo);

    return (
        <div className="my-page">
            <BackHeader title="마이페이지" />

            <section className="profile-section">
                <div className="avatar-wrapper">
                    <div className="avatar">
                        <img src={user} alt="사용자 이미지" className="avatar-image" />
                    </div>
                    <button className="avatar-edit" aria-label="프로필 사진 변경">
                        <FaCamera size={32} color="#F0F0F0" />
                    </button>
                </div>

                <div className="user-info">
                    <div className="user-text">
                        <div className="user-greeting">안녕하세요!</div>
                        <div className="user-name">
                            {userInfo ? (
                                <p>{userInfo.nickname}님</p>
                            ) : (
                                <p>회원 정보를 불러오는 중...</p> // 또는 로딩 스피너 표시
                            )}
                        </div>
                    </div>
                </div>
                <button className="settings-button" aria-label="설정">
                    <div className="icon-circle">
                        <img src={option} alt="설정 아이콘" className="settings-icon" />
                    </div>
                </button>
            </section>

            {/* 내 정보 수정 */}
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

            {/* 이용안내 */}
            <div className="menu-group2">
                <div className="group-title">이용안내</div>
                <div className="menu-item" onClick={() => navigate('/app-version')}>
                    앱 버전
                </div>
                <div className="menu-item" onClick={() => navigate('/privacy-info')}>
                    개인정보 처리방침
                </div>
                <div className="menu-item" onClick={() => navigate('/community-rules')}>
                    커뮤니티 규칙
                </div>
                <div className="menu-item" onClick={() => navigate('/terms-of-service')}>
                    서비스 이용약관
                </div>
                <div className="menu-item" onClick={() => navigate('/contact')}>
                    문의하기
                </div>
            </div>

            {/* 기타 */}
            <div className="menu-group3">
                <div className="group-title">기타</div>
                <div className="menu-item" onClick={() => navigate('/privacy-settings')}>
                    정보동의 설정
                </div>
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
