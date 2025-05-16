// src/pages/ChatList/components/ChatList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../shared/Header/components/Header';
import Footer from '../../../shared/Footer/Footer';
import dogAvatar from '../../../assets/testdog.png';
import '../ChatList.css';

function getMyId() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Number(payload.userId ?? payload.id ?? payload.sub);
}

export default function ChatList() {
    const navigate = useNavigate();
    const myId = getMyId();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (!myId) return;
        fetch(`/api/chat/rooms?userId=${myId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        })
            .then((r) => r.json())
            .then(setRooms)
            .catch(console.error);
    }, [myId]);

    const openChat = (room) => {
        const otherId = room.user1Id === myId ? room.user2Id : room.user1Id;
        navigate(`/chat/${room.type}/${room.relatedId}`, {
            state: { receiverId: otherId },
        });
    };

    const deleteRoom = async (roomId) => {
        if (!window.confirm('정말 이 채팅방을 삭제하시겠습니까?')) return;
        const res = await fetch(`/api/chat/rooms/${roomId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        if (res.ok) {
            setRooms((prev) => prev.filter((r) => r.id !== roomId));
        } else {
            alert('삭제에 실패했습니다.');
        }
    };

    return (
        <div className="chatlist-container">
            <Header />

            <div className="chatlist-alert">
                알림을 켜주세요.
                <br />
                알림이 ON 되어야 채팅 알림을 받을 수 있어요.
            </div>

            <div className="chatlist-list">
                {rooms.map((room) => {
                    const otherId = room.user1Id === myId ? room.user2Id : room.user1Id;
                    return (
                        <div key={room.id} className="chat-item">
                            <img src={dogAvatar} alt="" className="chat-avatar" />

                            <div className="chat-content" onClick={() => openChat(room)}>
                                <div className="chat-info">
                                    <span className="chat-name">User #{otherId}</span>
                                    <span className="chat-time">
                                        {room.type} · {new Date(room.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="chat-message">{room.lastMessage || ''}</p>
                            </div>

                            {/* 삭제 버튼 */}
                            <button className="chat-delete-button" onClick={() => deleteRoom(room.id)}>
                                ✕
                            </button>
                        </div>
                    );
                })}

                {rooms.length === 0 && <div style={{ padding: 16, color: '#666' }}>아직 열린 채팅방이 없습니다.</div>}
            </div>

            <Footer />
        </div>
    );
}
