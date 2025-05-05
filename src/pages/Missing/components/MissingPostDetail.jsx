// src/pages/Missing/components/MissingPostDetail.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../MissingPostDetail.css';
import testdog from '../../../assets/testdog.png';

export default function MissingPostDetail() {
    const navigate = useNavigate();

    const post = {
        status: '실종',
        location: '경상북도 구미시 대학로 61',
        date: '2025년 4월 15일 오전 9:00 접수',
        imageUrl: testdog,
        description: '사라졌어요! 주변에서 보신 분은 연락 주세요.',
    };

    return (
        <div className="missing-post-detail">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← 돌아가기
            </button>
            <h2 className="post-title">강아지 {post.status} 제보</h2>
            <img src={post.imageUrl} alt="강아지" className="post-image" />
            <div className="post-info">
                <p>
                    <strong>상태:</strong> {post.status}
                </p>
                <p>
                    <strong>위치:</strong> {post.location}
                </p>
                <p>
                    <strong>접수 시간:</strong> {post.date}
                </p>
                <p>
                    <strong>설명:</strong> {post.description}
                </p>
            </div>
        </div>
    );
}
