// src/app/App.jsx
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 페이지 임포트
import LandingPage from '../pages/Landing/components/LandingPage';
import LoginPage from '../pages/Login/components/LoginPage';
import MyPage from '../pages/MyPage/components/MyPage';
import Signup from '../pages/Signup/components/Signup';
import SuccessSignup from '../pages/Signup/components/SuccessSignup';
import MapMain from '../pages/Map/components/MapMain';

import FindId from '../pages/FindId/components/FindId';
import SuccessFindId from '../pages/FindId/components/SuccessFindId';
import FailFindId from '../pages/FindId/components/FailFindId';

import SuccessFindPassword from '../pages/FindPassword/components/SuccessFindPassword';
import FailFindPassword from '../pages/FindPassword/components/FailFindPassword';
import FindPassword from '../pages/FindPassword/components/FindPassword';

import Main from '../pages/Main/components/Main';
import Filtering from '../pages/Map/components/Filtering';
import MarkerPick from '../pages/board/components/MarkerPick';
import AnimalProfile from '../pages/AnimalProfile/components/AnimalProfile';

// ✅ 마이페이지 서브 메뉴 라우팅
import ChangePassword from '../pages/MyPage/components/ChangePassword';
import ChangeNickname from '../pages/MyPage/components/ChangeNickname';
import VerifyPhone from '../pages/MyPage/components/VerifyPhone';
import AppVersion from '../pages/MyPage/components/AppVersion';
import PrivacyInfo from '../pages/MyPage/components/PrivacyInfo';
import CommunityRules from '../pages/MyPage/components/CommunityRules';
import TermsOfService from '../pages/MyPage/components/TermsOfService';
import PrivacySettings from '../pages/MyPage/components/PrivacySettings';
import DeleteAccount from '../pages/MyPage/components/DeleteAccount';
import Logout from '../pages/MyPage/components/Logout';
import Contact from '../pages/MyPage/components/Contact';

// ***** 👇 진료 페이지 임포트 추가 *****
// 경로 예시: src/pages/MedicalPage/MedicalPage.jsx
// 실제 파일 위치에 따라 경로를 정확하게 수정해주세요.
// 예: import MedicalPage from "../pages/진료페이지/MedicalPage";
import MedicalPage from '../pages/Medical/components/MedicalPage';
import ReservationPage from '../pages/Reservation/components/ReservationPage';
import NearbyHospitalPage from '../pages/NearbyHospital/components/NearbyHospitalPage';
import HospitalDetailPage from '../pages/HospitalDetail/components/HospitalDetailPage.';
import VetDetailPage from '../pages/VetDetail/components/VetDetailPage';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 기본 페이지들 */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/successsignup" element={<SuccessSignup />} />
                <Route path="/mapmain" element={<MapMain />} />
                <Route path="/main" element={<Main />} />

                {/* 아이디 찾기 */}
                <Route path="/findid" element={<FindId />} />
                <Route path="/successfindid" element={<SuccessFindId />} />
                <Route path="/failfindid" element={<FailFindId />} />

                {/* 비밀번호 찾기 */}
                <Route path="/findpw" element={<FindPassword />} />
                <Route path="/successfindpw" element={<SuccessFindPassword />} />
                <Route path="/failfindpw" element={<FailFindPassword />} />

                {/* 지도 필터링, 마커 선택 */}
                <Route path="/filters" element={<Filtering />} />
                <Route path="/board/markerpick" element={<MarkerPick />} />

                {/* 반려동물 프로필 등록 */}
                <Route path="/animal-profile" element={<AnimalProfile />} />

                {/* 실종게시글 상세 페이지 라우트 */}

                {/* ✅ 마이페이지 하위 라우트 */}
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/change-nickname" element={<ChangeNickname />} />
                <Route path="/verify-phone" element={<VerifyPhone />} />
                <Route path="/app-version" element={<AppVersion />} />
                <Route path="/privacy-info" element={<PrivacyInfo />} />
                <Route path="/community-rules" element={<CommunityRules />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-settings" element={<PrivacySettings />} />
                <Route path="/delete-account" element={<DeleteAccount />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/contact" element={<Contact />} />

                {/* ***** 👇 진료 페이지 라우트 추가 ***** */}
                <Route path="/medical" element={<MedicalPage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/nearby-hospital" element={<NearbyHospitalPage />} />
                <Route path="/hospital/:id" element={<HospitalDetailPage />} />
                <Route path="/vet/:name" element={<VetDetailPage />} />
                {/* 예: /medical URL로 접속 시 MedicalPage 컴포넌트 렌더링 */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
