// src/pages/Witness/components/WitnessPostDetail.jsx

import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import '../WitnessPostDetail.css';
import testdog from '../../../assets/수완강아지.jpeg';
import mapimg from '../../../assets/map-example.svg';
import calender from '../../../assets/uit_calender.svg';
import location from '../../../assets/location.svg';
import send from '../../../assets/send.svg';
import user from '../../../assets/users.svg';

export default function WitnessPostDetail() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [commentInput, setCommentInput] = useState('');
    const [commentList, setCommentList] = useState([
        {
            author: '조진혁',
            date: '2025년 10월 21일',
            content: '빨리 찾았으면 좋겠네요!',
        },
    ]);

    const goBack = () => {
        setFadeOut(true);
        setTimeout(() => navigate(-1), 400);
    };

    const post = {
        author: '금오H',
        dogName: '벨아키마야',
        breed: '말티즈',
        timeAgo: '7일 전',
        date: '2025년 4월 15일 오전 9:00 목격',
        location: '경북 구미시 경상북도 구미시 대학로 61',
        description:
            '도서관 앞 횡단보도에서 흰색 말티즈 목격했습니다. 주위에 사람이 많았고 겁에 질린 듯한 모습이었습니다.',
        images: [testdog, testdog, testdog, testdog, testdog],
    };

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        setCurrentImageIndex(Math.round(scrollLeft / width));
    };

    const handleCommentSubmit = () => {
        if (!commentInput.trim()) return;

        const newComment = {
            author: '익명',
            date: new Date().toISOString().split('T')[0],
            content: commentInput,
        };

        setCommentList((prev) => [...prev, newComment]);
        setCommentInput('');
    };

    return (
        <>
            <header className="missing-header">
                <button className="back-button" onClick={goBack}>
                    <IoIosArrowBack />
                </button>
                <h1>목격게시글</h1>
            </header>

            <div className={`missing-detail-container ${fadeOut ? 'fade-out' : ''}`}>
                <div className="user-info">
                    <img src={user} alt="프로필 이미지" className="profile-circle" />
                    <div className="info-wrapper">
                        <div className="first-row">
                            <div className="nickname">{post.author}</div>
                        </div>
                        <div className="second-row">
                            <div className="dog-info">
                                <span className="dog-name">{post.dogName}</span>
                                <span className="breed">{post.breed}</span>
                            </div>
                            <div className="time-ago">{post.timeAgo}</div>
                        </div>
                    </div>
                    <button className="more-btn">&#8942;</button>
                </div>

                <div className="image-slider" onScroll={handleScroll}>
                    {post.images.map((img, idx) => (
                        <div className="slide" key={idx}>
                            <img src={img} alt={`강아지${idx}`} />
                            {idx === currentImageIndex && (
                                <div className="image-counter">
                                    {currentImageIndex + 1}/{post.images.length}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="thumbnail-slider">
                    {post.images.map((img, idx) => (
                        <div className="thumbnail-card" key={idx}>
                            <img src={img} alt={`썸네일${idx}`} />
                            <div className="thumbnail-text">
                                <div>목격 - 2025년 4월 30일</div>
                                <div>품종</div>
                                <div>털색</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="detail-info">
                    <div className="date-row">
                        <img src={calender} alt="calender" className="calender-image" /> {post.date}
                    </div>
                    <div className="location-row">
                        <img src={location} alt="location" className="location-image" />
                        {post.location}
                    </div>
                    <p className="description">{post.description}</p>
                </div>

                <div className="map-section">
                    <img src={mapimg} alt="map" className="map-image" />
                </div>

                <div className="comment-section">
                    <div className="comment-count">댓글 {commentList.length}개</div>
                    {commentList.map((cmt, idx) => (
                        <div className="comment" key={idx}>
                            <img src={user} alt="댓글 작성자" className="comment-profile-circle" />
                            <div className="comment-content">
                                <div className="comment-meta">
                                    <span className="comment-author">{cmt.author}</span>
                                    <span className="comment-date">{cmt.date}</span>
                                </div>
                                <div className="comment-text">{cmt.content}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="comment-input-box">
                    <input
                        type="text"
                        placeholder="댓글을 작성해주세요"
                        className="comment-input"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button className="submit-btn" onClick={handleCommentSubmit}>
                        <img src={send} alt="send" className="send-image" />
                    </button>
                </div>
            </div>
        </>
    );
}
