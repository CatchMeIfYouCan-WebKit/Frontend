import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import stompClient from '../socket';
import 사용자사진 from '../../../assets/userPicture.png';
import '../ChatRoomStyled.css';

const ChatRoom = () => {
  const { type, relatedId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // JWT에서 userId 추출
  const token = localStorage.getItem('accessToken');
  const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const senderId = decoded?.id;
  const receiverId = location.state?.receiverId;

  useEffect(() => {
    if (!senderId || !receiverId) return;

    stompClient.onConnect = () => {
      console.log('✅ WebSocket 연결됨');
      stompClient.subscribe(`/user/${senderId}/queue/messages`, (msg) => {
        const body = JSON.parse(msg.body);
        setMessages((prev) => [...prev, body]);
      });
    };

    stompClient.activate();

    // 초기 메시지 로딩
    fetch(`/api/chat/messages?roomType=${type}&relatedId=${relatedId}&senderId=${senderId}&receiverId=${receiverId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => console.error('❌ 초기 메시지 불러오기 실패', err));

    return () => {
      stompClient.deactivate();
    };
  }, [senderId, receiverId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      type,
      relatedId,
      content: message,
    };

    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(payload),
    });

    setMessage('');
  };

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <span className="header-title">실시간 채팅</span>
      </div>

      <div className="chat-box">
        {messages.map((msg, idx) => {
          const isMine = Number(msg.senderId) === senderId;
          return (
            <div key={idx} className={`chat-bubble-wrapper ${isMine ? 'mine' : 'other'}`}>
              {!isMine && (
                <div className="profile-area">
                  <img
                    src={사용자사진}
                    alt="상대방"
                    className="profile-image"
                  />
                  <span className="chat-nickname">{msg.senderNickname || '상대방'}</span>
                </div>
              )}
              <div className={`chat-bubble ${isMine ? 'mine' : 'other'}`}>
                <div className="chat-message">{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input-wrapper">
        <input
          type="text"
          className="chat-input"
          placeholder="메시지 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
