// src/pages/ChatList/components/ChatList.jsx
import React, { useEffect, useState, useRef } from 'react';
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
    const [nicknames, setNicknames] = useState({});
    const holdTimer = useRef(null);

    // 상대방 닉네임을 포함한 방 목록 가져오기
    useEffect(() => {
        if (!myId) return;

        fetch(`/api/chat/rooms?userId=${myId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        })
            .then((res) => res.json())
            .then(async (data) => {
                setRooms(data);

                // 상대방 닉네임 조회
                const names = {};
                for (const room of data) {
                    const otherId = room.user1Id === myId ? room.user2Id : room.user1Id;
                    if (!names[otherId]) {
                        try {
                            const res = await fetch(`/api/member/info`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                                },
                                body: JSON.stringify({ id: String(otherId) }),
                            });
                            const body = await res.json();
                            names[otherId] = body.nickname || `User #${otherId}`;
                        } catch {
                            names[otherId] = `User #${otherId}`;
                        }
                    }
                }
                setNicknames(names);
            })
            .catch(console.error);
    }, [myId]);

    // 상대방과 방 이동
    const openChat = (room) => {
        const otherId = room.user1Id === myId ? room.user2Id : room.user1Id;
        navigate(`/chat/${room.type}/${room.relatedId}`, {
            state: { receiverId: otherId },
        });
    };

    // 방 삭제 API 호출
    const deleteRoom = async (roomId) => {
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

    // 롱프레스 시작
    const handlePressStart = (room) => {
        holdTimer.current = setTimeout(async () => {
            if (window.confirm('정말 이 채팅방을 삭제하시겠습니까?')) {
                await deleteRoom(room.id);
            }
        }, 600);
    };

    // 롱프레스 취소
    const handlePressEnd = () => {
        clearTimeout(holdTimer.current);
    };

    // 상대방 최근 시간 혹은 방 생성 시간 포맷
    const formatRelativeTime = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffSec = Math.floor((now - past) / 1000);
        if (diffSec < 60) return '방금 전';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}분 전`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour}시간 전`;
        const diffDay = Math.floor(diffHour / 24);
        return `${diffDay}일 전`;
    };

    return (
        <div className="chatlist-container">
            <Header />

            {/* 알림 배너 */}
            <div className="chatlist-alert">
                알림을 켜주세요.
                <br />
                알림이 ON 되어야 채팅 알림을 받을 수 있어요.
            </div>

            <div className="chatlist-list">
                {rooms.map((room) => {
                    const otherId = room.user1Id === myId ? room.user2Id : room.user1Id;
                    return (
                        <div
                            key={room.id}
                            className="chat-item"
                            onMouseDown={() => handlePressStart(room)}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            onTouchStart={() => handlePressStart(room)}
                            onTouchEnd={handlePressEnd}
                        >
                            <img src={dogAvatar} alt="avatar" className="chat-avatar" />

                            <div className="chat-content" onClick={() => openChat(room)}>
                                <div className="chat-info">
                                    {/* 1. 상대방 닉네임 */}
                                    <span className="chat-name">{nicknames[otherId] || `User #${otherId}`}</span>
                                    {/* 2. 마지막 작성 시간 */}
                                    <span className="chat-time">
                                        {formatRelativeTime(room.lastMessageAt || room.createdAt)}
                                    </span>
                                </div>
                                {/* 3. 마지막 채팅 메시지 */}
                                <p className="chat-message">{room.lastMessage || '아직 대화 내용이 없습니다.'}</p>
                            </div>

                            {/* 삭제 버튼 */}
                            <button
                                className="chat-delete-button"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (window.confirm('정말 이 채팅방을 삭제하시겠습니까?')) {
                                        await deleteRoom(room.id);
                                    }
                                }}
                            >
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
