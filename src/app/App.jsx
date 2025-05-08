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
import ShelterDetail from '../pages/Map/components/ShelterDetail';
import ShelterFilter from '../pages/Map/components/ShelterFilter';
import MissingPostDetail from '../pages/Missing/components/MissingPostDetail';
import Adoption from '../pages/Adoption/components/Adoption';
import MissingPostForm from '../pages/MissingForm/components/MissingPostForm';
import WitnessPostDetail from '../pages/Witness/components/WitnessPostDetail';
import AdoptionPost from '../pages/Adoption/components/AdoptionPost';

import WitnessPostForm from '../pages/WitnessForm/components/WitnessPostForm';
import RegisterPost from '../pages/Adoption/components/RegisterPost';
import LocationSelect from '../pages/Adoption/components/LocationSelect';
import PostDetail from '../pages/Adoption/components/PostDetail';

import ChatRoom from '../pages/Chat/components/ChatRoom';
import ChatRoomTest from '../pages/Chat/components/ChatRoomTest';
import AdoptionPostEdit from '../pages/Adoption/components/AdoptionPostEdit';

import MissingLocationSelect from '../pages/MissingForm/components/MissingLocationSelect';
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

                {/* 보호소 동물 상세페이지 */}
                <Route path="/shelterdetail" element={<ShelterDetail />} />
                <Route path="/shelterdetail/filter" element={<ShelterFilter />} />

                {/* 입양 게시판 */}
                <Route path="/adoptionpost" element={<Adoption />} />
                <Route path="/adoptionpost/add" element={<AdoptionPost />} />
                <Route path="/adoptionpost/add/details" element={<RegisterPost />} />
                <Route path="/adoptionpost/add/select-location" element={<LocationSelect />} />
                <Route path="/adoptionpost/:id" element={<PostDetail />} />
                <Route path="/adoption/post/edit/:id" element={<AdoptionPostEdit />} />

                {/* 반려동물 프로필 등록 */}
                <Route path="/animal-profile" element={<AnimalProfile />} />

                {/* ✅ 마이페이지 하위 라우트 추가 */}
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

                {/* ✅ 실종 하위 라우트 추가 */}
                <Route path="/missingpostDetail" element={<MissingPostDetail />} />
                <Route path="/report-missing" element={<MissingPostForm />} />
                <Route path="/report-missing/select-location" element={<MissingLocationSelect />} />

                {/* ✅ 목격 하위 라우트 추가 */}
                <Route path="/witnesspostDetail" element={<WitnessPostDetail />} />
                <Route path="/report-found" element={<WitnessPostForm />} />

                {/* ✅ 실시간 채팅방 */}
                <Route path="/chat/:type/:relatedId" element={<ChatRoom />} />
                <Route path="/chat/test" element={<ChatRoomTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
