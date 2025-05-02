import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 페이지 임포트
import LandingPage from '../pages/Landing/components/LandingPage';
import LoginPage from '../pages/Login/components/LoginPage';
import MyPage from '../pages/MyPage/MyPage';
import Signup from '../pages/Signup/components/Signup';
import SuccessSignup from '../pages/Signup/components/SuccessSignup';
import MapMain from '../pages/Map/components/MapMain';

import FindId from '../pages/FindId/components/FindId';
import SuccessFindId from '../pages/FindId/components/SuccessFindId';
import FailFindId from '../pages/FindId/components/FailFindId';

import SuccessFindPassword from '../pages/FindPassword/components/SuccessFindPassword'; // ✅ 비밀번호 찾기 성공
import FailFindPassword from '../pages/FindPassword/components/FailFindPassword'; // ✅ 비밀번호 찾기 실패
import Main from '../pages/Main/components/Main';
import Filtering from '../pages/Map/components/Filtering';

import MarkerPick from '../pages/board/components/MarkerPick';

import FindPassword from '../pages/FindPassword/components/FindPassword';
import AnimalProfile from '../pages/AnimalProfile/components/AnimalProfile';


<Route path="/main" element={<Main />} />;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/successsignup" element={<SuccessSignup />} />
                <Route path="/mapmain" element={<MapMain />} />

                {/* 아이디 찾기 */}
                <Route path="/findid" element={<FindId />} />
                <Route path="/successfindid" element={<SuccessFindId />} />
                <Route path="/failfindid" element={<FailFindId />} />

                {/* 비밀번호 찾기 */}
                <Route path="/findpw" element={<FindPassword />} />
                <Route path="/successfindpw" element={<SuccessFindPassword />} />
                <Route path="/failfindpw" element={<FailFindPassword />} />
                <Route path="/main" element={<Main />} />

                {/* 지도 필터링 */}
                <Route path="/filters" element={<Filtering />} />


                {/* 게시글  */}
                <Route path="/board/markerpick" element={<MarkerPick />} />

                {/* 반려동물 프로필 등록 */}
                <Route path="/animal-profile" element={<AnimalProfile />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
