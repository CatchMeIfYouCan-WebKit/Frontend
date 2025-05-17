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

    // ✅ 더미 채팅방 데이터
    const dummyRooms = [
        {
            id: 1,
            user1Id: myId,
            user2Id: 24,
            type: 'ADOPTION',
            relatedId: 101,
            createdAt: new Date().toISOString(),
            lastMessage: '입양 문의드립니다!',
        },
        {
            id: 2,
            user1Id: 99,
            user2Id: myId,
            type: 'WALK',
            relatedId: 202,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            lastMessage: '산책 시간 괜찮으신가요?',
        },
    ];

    useEffect(() => {
        // 임시로 더미 데이터 사용
        if (myId) setRooms(dummyRooms);
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
    function formatRelativeTime(dateString) {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past; // 차이(ms)
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffMin < 1) return '방금 전';
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffHour < 24) return `${diffHour}시간 전`;
        return `${diffDay}일 전`;
    }
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);
    let holdTimer = null;
    const handlePressStart = (room) => {
        holdTimer = setTimeout(() => {
            setSelectedRoom(room);
            setShowModal(true);
        }, 600); // 600ms 이상 누르면 모달 열림
    };

    const handlePressEnd = () => {
        clearTimeout(holdTimer);
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
                        <div
                            key={room.id}
                            className="chat-item"
                            onMouseDown={() => handlePressStart(room)}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            onTouchStart={() => handlePressStart(room)}
                            onTouchEnd={handlePressEnd}
                        >
                            <img src={dogAvatar} alt="" className="chat-avatar" />
                            <div className="chat-content" onClick={() => openChat(room)}>
                                <div className="chat-info">
                                    {/* 상대방 user정보 받아오기  */}
                                    <span className="chat-name">User</span>
                                    <span className="chat-time">{formatRelativeTime(room.createdAt)}</span>
                                </div>
                                {/* 마지막으로 채팅한  message  //createdAt으로   */}
                                <p className="chat-message">{room.lastMessage || ''}</p>
                            </div>
                        </div>
                    );
                })}
                {showModal && selectedRoom && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>정말 이 채팅방을 삭제하시겠습니까?</p>
                            <div className="modal-actions">
                                <button
                                    onClick={async () => {
                                        const res = await fetch(`/api/chat/rooms/${selectedRoom.id}`, {
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                                            },
                                        });
                                        if (res.ok) {
                                            setRooms((prev) => prev.filter((r) => r.id !== selectedRoom.id));
                                            setShowModal(false);
                                            setSelectedRoom(null);
                                        } else {
                                            alert('삭제에 실패했습니다.');
                                        }
                                    }}
                                >
                                    삭제
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedRoom(null);
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {rooms.length === 0 && <div style={{ padding: 16, color: '#666' }}>아직 열린 채팅방이 없습니다.</div>}
            </div>

            <Footer />
        </div>
    );
}
