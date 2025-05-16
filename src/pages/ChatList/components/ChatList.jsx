// src/pages/ChatList/components/ChatList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import Header from '../../../shared/Header/components/Header';

// shared Header의 스타일을 그대로 쓰기 위해 CSS만 불러옵니다.
import '../../../shared/Header/Header.css';

import '../ChatList.css';
import Footer from '../../../shared/Footer/Footer';
import dogAvatar from '../../../assets/testdog.png';

const chatData = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    avatar: dogAvatar,
    name: '금오동물병원',
    location: '지산동',
    time: '7일전',
    lastMessage: '금방 갈게요!!',
}));

export default function ChatList() {
    const navigate = useNavigate();

    return (
        <div className="chatlist-container">
            {/* === Header 시작 === */}
            <Header />
            {/* === Header 끝 === */}

            <div className="chatlist-alert">
                알림을 켜주세요. <br></br>알림이 시스템에서 ON설정이 되었어야 채팅 알림을 받을 수 있어요.
            </div>

            <div className="chatlist-list">
                {chatData.map((item) => (
                    <div key={item.id} className="chat-item" onClick={() => navigate('/chat/test')}>
                        <img src={item.avatar} alt="avatar" className="chat-avatar" />
                        <div className="chat-content">
                            <div className="chat-info">
                                <span className="chat-name">{item.name}</span>
                                <span className="chat-time">
                                    {item.location} {item.time}
                                </span>
                            </div>
                            <p className="chat-message">{item.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
