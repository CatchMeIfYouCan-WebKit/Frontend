import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stompClient from '../socket';
import 사용자사진 from '../../../assets/userPicture.png';
import '../ChatRoomStyled.css';

const ChatRoomTest = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // 임시 사용자 ID
  const senderId = 23;
  const receiverId = 24;
  const currentUserId = senderId;

  const relatedId = '1';
  const chatType = 'VET';

  useEffect(() => {
    // ✅ WebSocket 연결
    stompClient.onConnect = () => {
      console.log('✅ WebSocket 연결됨');

      stompClient.subscribe(`/user/${senderId}/queue/messages`, (msg) => {
        const body = JSON.parse(msg.body);
        setMessages((prev) => [...prev, body]);
      });
      
    };

    stompClient.activate();

    // ✅ 초기 메시지 불러오기 (토큰 없음)
    fetch(`/api/chat/messages?roomType=${chatType}&relatedId=${relatedId}&senderId=${senderId}&receiverId=${receiverId}`, {
      method: 'GET',
    })
      .then((res) => {
        if (!res.ok) throw new Error('메시지 로딩 실패');
        return res.json();
      })
      .then((data) => {
        console.log('📜 초기 메시지 로딩 완료:', data);
        setMessages(data);
      })
      .catch((err) => console.error('❌ 초기 메시지 불러오기 실패', err));

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      type: chatType,
      relatedId: relatedId,
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
          const isMine = Number(msg.senderId) === currentUserId;

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
        <button className="send-button" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomTest;
