// src/pages/Chat/components/ChatRoom.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import client from './socket';
import otherImg from '../../../assets/other.svg';
import send from '../../../assets/send.svg';
import '../ChatRoomStyled.css';

export default function ChatRoom() {
    const { type, relatedId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const receiverId = state?.receiverId;

    const token = localStorage.getItem('accessToken');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    const myId = Number(payload.userId ?? payload.id ?? payload.sub);

    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [receiverNickname, setReceiverNickname] = useState('상대방');

    const clientRef = useRef(client);

    useEffect(() => {
        if (!myId || !receiverId) return;

        async function initChat() {
            try {
                // 1) 채팅방 생성 또는 조회
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

                // 2) 메시지 기록 불러오기
                const msgRes = await fetch(`/api/chat/rooms/${room.id}/messages`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (msgRes.ok) {
                    const history = await msgRes.json();
                    setMessages(Array.isArray(history) ? history : []);
                }

                // 3) 상대방 닉네임 가져오기 //==============================================여기요
                const nicknameRes = await fetch(`/api/users/${receiverId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (nicknameRes.ok) {
                    const user = await nicknameRes.json();
                    setReceiverNickname(user.nickname || '상대방');
                }

                // 4) WebSocket 연결
                clientRef.current.onConnect = () => {
                    setConnected(true);
                    clientRef.current.subscribe(`/topic/chat/${room.id}`, (frame) => {
                        const incoming = JSON.parse(frame.body);
                        setMessages((prev) => [...prev, incoming]);
                    });
                };
                clientRef.current.activate();
            } catch (error) {
                console.error('채팅방 초기화 실패:', error);
            }
        }

        initChat();

        return () => {
            clientRef.current.deactivate();
        };
    }, [myId, receiverId, type, relatedId, token]);

    const sendMessage = () => {
        if (!connected || !message.trim() || roomId == null) return;
        clientRef.current.publish({
            destination: `/app/chat/${roomId}`,
            body: JSON.stringify({ senderId: myId, message }),
        });
        setMessage('');
    };

    const goBack = () => {
        setFadeOut(true);
        setTimeout(() => navigate('/chatlist'), 400);
    };

    return (
        <div className={`chat-room-container ${fadeOut ? 'missing-fade-out' : ''}`}>
            {/* 헤더 */}
            <div className="sf-header">
                <div className="back-button2" onClick={goBack}>
                    <IoIosArrowBack size={32} />
                </div>
                <div className="filtering-title">{receiverNickname}</div>
            </div>

            {/* 메시지 박스 */}
            <div className="chat-box">
                {messages.map((msg, idx) => {
                    const isMine = Number(msg.senderId) === myId;
                    return (
                        <div key={idx} className={`chat-bubble-wrapper ${isMine ? 'mine' : 'other'}`}>
                            {!isMine && (
                                <div className="profile-area">
                                    <img
                                        src={otherImg}
                                        alt="상대방"
                                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                    />
                                </div>
                            )}
                            <div className={`chat-bubble ${isMine ? 'mine' : 'other'}`}>{msg.message}</div>
                            {isMine && <div className="spacer" />}
                        </div>
                    );
                })}
            </div>

            {/* 입력창 */}
            <div className="missing-comment-input-box">
                <input
                    type="text"
                    className="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={connected ? '메시지 입력' : '연결 중…'}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={!connected}
                />
                <button className="missing-submit-btn" onClick={sendMessage} disabled={!connected || !message.trim()}>
                    <img src={send} alt="send" className="missing-send-image" />
                </button>
            </div>
        </div>
    );
}
