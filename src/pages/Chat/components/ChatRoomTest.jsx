// src/pages/Chat/components/ChatRoom.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ChatRoomStyled.css';
import { IoIosArrowBack } from 'react-icons/io';
import otherImg from '../../../assets/other.svg'; // 파일 확장자 확인!
import send from '../../../assets/send.svg';

export default function ChatRoom() {
    const navigate = useNavigate();

    // 내 ID를 하드코딩 (디자인 테스트용)
    const myId = 999;

    // 더미 메시지
    const [messages] = useState([
        { senderId: 1, senderNickname: '상대방', message: '안녕하세요! 처음 뵙겠습니다.' },
        { senderId: 999, message: '안녕하세요. 반갑습니다!' },
        { senderId: 1, senderNickname: '상대방', message: '이 플랫폼을 통해 연락드렸어요.' },
        { senderId: 999, message: '네, 궁금한 점 있으시면 말씀해주세요.' },
        { senderId: 1, senderNickname: '상대방', message: '혹시 오늘 저녁에 통화 가능하신가요?' },
        { senderId: 999, message: '네 가능합니다. 몇 시쯤이 좋으세요?' },
        { senderId: 1, senderNickname: '상대방', message: '8시쯤이면 괜찮을까요?' },
        { senderId: 999, message: '좋습니다. 그때 연락드릴게요!' },
        { senderId: 999, message: '좋습니다. 그때 연락드릴게요!' },
        { senderId: 1, senderNickname: '상대방', message: '8시쯤이면 괜찮을까요?' },
        { senderId: 1, senderNickname: '상대방', message: '8시쯤이면 괜찮을까요?' },
        { senderId: 1, senderNickname: '상대방', message: '8시쯤이면 괜찮을까요?' },
        { senderId: 1, senderNickname: '상대방', message: '8시쯤이면 괜찮을까요?' },
        { senderId: 999, message: '좋습니다. 그때 연락드릴게요!' },
        { senderId: 999, message: '좋습니다. 그때 연락드릴게요!' },
        { senderId: 999, message: '좋습니다. 그때 연락드릴게요!fds6f4dsㄴ65dfsㅂㅂㅂfdfd5f4s5s5465fds45fsd6545d4' },
        { senderId: 1, message: '좋습니다그ㄴㅁㅇㄴㅁ때 연락dsㄴㅇㄹfds6f4ds65dㅇㅁㅇfsfdfd5f4s5s5465fds45fsd6545d4' },
    ]);

    const receiverNickname = '홍길동'; // 채팅방 상단에 표시할 상대방 이름

    const goBack = () => {
        setFadeOut(true);
        setTimeout(() => navigate('/chatlist'), 400);
    };

    const [message, setMessage] = useState('');
    const [fadeOut, setFadeOut] = useState(false);

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
                                    {/* 이미지 불러오기  닉네임은 뺌뺌*/}
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
            <div className="missing-comment-input-box">
                <input
                    type="text"
                    className="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled
                    placeholder="메시지 보내기"
                />
                <button className="missing-submit-btn">
                    <img src={send} alt="send" className="missing-send-image" />
                </button>
            </div>
            {/* 입력창 (비활성화) */}
        </div>
    );
}
