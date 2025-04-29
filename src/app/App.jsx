import './App.css';
import React from 'react';
import LandingPage from '../pages/Landing/components/LandingPage';
import MyPage from '../pages/MyPage/MyPage';
import FindId from '../pages/FindId/components/FindId';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/login/components/LoginPage';
import SuccessFindId from '../pages/FindId/components/SuccessFindId';
import FailFindId from '../pages/FindId/components/FailFindId';
import Signup from '../pages/Signup/components/Signup';
import SuccessSignup from '../pages/Signup/components/SuccessSignup';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/findid" element={<FindId />} />
                <Route path="/successfindid" element={<SuccessFindId />} />
                <Route path="/failfindid" element={<FailFindId />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/successsignup" element={<SuccessSignup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
