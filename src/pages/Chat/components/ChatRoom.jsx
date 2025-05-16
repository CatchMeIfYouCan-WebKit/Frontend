// src/pages/Chat/components/ChatRoom.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import client from './socket';
import '../ChatRoomStyled.css';

export default function ChatRoom() {
    const { type, relatedId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const receiverId = state?.receiverId;

    // JWT 디코딩해서 내 아이디 구하기
    const token = localStorage.getItem('accessToken');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    // payload.userId 우선, 없으면 payload.id, 없으면 payload.sub
    const myId = Number(payload.userId ?? payload.id ?? payload.sub);

    // 로컬 상태
    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connected, setConnected] = useState(false);

    // STOMP 클라이언트 레퍼런스
    const clientRef = useRef(client);

    useEffect(() => {
        if (!myId || !receiverId) return;

        async function initChat() {
            // 1) 채팅방 조회 또는 생성
            const roomRes = await fetch('/api/chat/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user1Id: myId,
                    user2Id: Number(receiverId),
                    type,
                    relatedId: Number(relatedId),
                }),
            });
            const room = await roomRes.json();
            setRoomId(room.id);

            // 2) 이전 메시지 불러오기
            const msgRes = await fetch(`/api/chat/rooms/${room.id}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (msgRes.ok) {
                const history = await msgRes.json();
                setMessages(Array.isArray(history) ? history : []);
            }

            // 3) STOMP 연결 & 구독
            clientRef.current.onConnect = () => {
                setConnected(true);
                clientRef.current.subscribe(`/topic/chat/${room.id}`, (frame) => {
                    const incoming = JSON.parse(frame.body);
                    setMessages((prev) => [...prev, incoming]);
                });
            };
            clientRef.current.activate();
        }

        initChat().catch(console.error);

        return () => {
            clientRef.current.deactivate();
        };
    }, [myId, receiverId, type, relatedId, token]);

    // 메시지 전송
    const sendMessage = () => {
        if (!connected || !message.trim() || roomId == null) return;
        clientRef.current.publish({
            destination: `/app/chat/${roomId}`,
            body: JSON.stringify({ senderId: myId, message }),
        });
        setMessage('');
    };

    return (
        <div className="chat-room-container">
            {/* 헤더 */}
            <div className="chat-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    &lt;
                </button>
                <span className="header-title">실시간 채팅</span>
            </div>

            {/* 메시지 박스 */}
            <div className="chat-box">
                {messages.map((msg, idx) => {
                    const isMine = Number(msg.senderId) === myId;
                    return (
                        <div key={idx} className={`chat-bubble-wrapper ${isMine ? 'mine' : 'other'}`}>
                            {/* 상대 메시지일 때만 프로필/닉네임 */}
                            {!isMine && (
                                <div className="profile-area">
                                    <img src="/assets/userPicture.png" alt="상대방" className="profile-image" />
                                    <span className="chat-nickname">{msg.senderNickname || '상대'}</span>
                                </div>
                            )}

                            {/* 말풍선 */}
                            <div className={`chat-bubble ${isMine ? 'mine' : 'other'}`}>{msg.message}</div>

                            {/* 내 메시지는 오른쪽으로 밀기 */}
                            {isMine && <div className="spacer" />}
                        </div>
                    );
                })}
            </div>

            {/* 입력 영역 */}
            <div className="chat-input-wrapper">
                <input
                    type="text"
                    className="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!connected}
                    placeholder={connected ? '메시지 입력' : '연결 중…'}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="send-button" onClick={sendMessage} disabled={!connected || !message.trim()}>
                    전송
                </button>
            </div>
        </div>
    );
}
