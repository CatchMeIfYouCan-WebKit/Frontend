// src/pages/Chat.jsx
import React from 'react';
import '../Chat.css';
import love from '../../../assets/love.svg';

export default function Chat() {
  return (
    <div className="chat-container">
      <div className="chat-button-wrapper">
        <img src={love} alt="" className='love-button'/>
        <button className="chat-button">채팅하기</button>
      </div>
    </div>
  );
}