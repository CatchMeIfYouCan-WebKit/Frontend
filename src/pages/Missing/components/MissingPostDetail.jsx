import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import '../MissingPostDetail.css';
import testdog from '../../../assets/수완강아지.jpeg';
import mapimg from '../../../assets/map-example.svg';
import calender from '../../../assets/uit_calender.svg';
import location from '../../../assets/location.svg';
import send from '../../../assets/send.svg';
import user from '../../../assets/users.svg';

export default function MissingPostDetail() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [commentInput, setCommentInput] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        date: '2025년 4월 15일 오전 9:00 실종',
        location: '경북 구미시 경상북도 구미시 대학로 61',
        description:
            '집에서 나가 도서관 위 빌라에서 발견후 아무소식 없다가 3일 후 도서관 앞에서 주민분이 강아지 봤다하심 이후 제보없음',
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
                <button className="missing-back-button" onClick={goBack}>
                    <IoIosArrowBack />
                </button>
                <h1>실종게시글</h1>
            </header>

            <div className={`missing-detail-container ${fadeOut ? 'missing-fade-out' : ''}`}>
                <div className="missing-user-info">
                    <div className="missing-left-part">
                        <img src={user} alt="프로필" className="missing-profile-circle" />
                    </div>

                    <div className="missing-right-part">
                        <div className="missing-nickname-row">
                            <span className="missing-nickname">{post.author}</span>
                            <button className="missing-more-btn" onClick={() => setIsDropdownOpen((prev) => !prev)}>
                                &#8942;
                            </button>
                            {isDropdownOpen && (
                                <div className="missing-dropdown">
                                    <div className="missing-dropdown-item" onClick={() => alert('게시글 수정')}>
                                        게시글 수정
                                    </div>
                                    <div className="missing-dropdown-item" onClick={() => alert('게시글 삭제')}>
                                        게시글 삭제
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="missing-dog-row">
                            <div className="missing-dog-info">
                                <span className="missing-dog-name">{post.dogName}</span>
                                <span className="missing-breed">{post.breed}</span>
                            </div>
                            <div className="missing-time-ago">{post.timeAgo}</div>
                        </div>
                    </div>
                </div>

                <div className="missing-image-slider" onScroll={handleScroll}>
                    {post.images.map((img, idx) => (
                        <div className="missing-slide" key={idx}>
                            <img src={img} alt={`강아지${idx}`} />
                            {idx === currentImageIndex && (
                                <div className="missing-image-counter">
                                    {currentImageIndex + 1}/{post.images.length}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="missing-thumbnail-slider">
                    {post.images.map((img, idx) => (
                        <div className="missing-thumbnail-card" key={idx}>
                            <img src={img} alt={`썸네일${idx}`} />
                            <div className="missing-thumbnail-text">
                                <div>목격 - 2025년 4월 30일</div>
                                <div>품종</div>
                                <div>털색</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="missing-detail-info">
                    <div className="missing-date-row">
                        <img src={calender} alt="calender" className="missing-calender-image" /> {post.date}
                    </div>
                    <div className="missing-location-row">
                        <img src={location} alt="location" className="missing-location-image" />
                        {post.location}
                    </div>
                    <p className="missing-description">{post.description}</p>
                </div>

                <div className="missing-map-section">
                    <img src={mapimg} alt="map" className="missing-map-image" />
                </div>

                <div className="missing-comment-section">
                    <div className="missing-comment-count">댓글 {commentList.length}개</div>
                    {commentList.map((cmt, idx) => (
                        <div className="missing-comment" key={idx}>
                            <img src={user} alt="댓글 작성자" className="missing-comment-profile-circle" />
                            <div className="missing-comment-content">
                                <div className="missing-comment-meta">
                                    <span className="missing-comment-author">{cmt.author}</span>
                                    <span className="missing-comment-date">{cmt.date}</span>
                                </div>
                                <div className="missing-comment-text">{cmt.content}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="missing-comment-input-box">
                    <input
                        type="text"
                        placeholder="댓글을 작성해주세요"
                        className="missing-comment-input"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button className="missing-submit-btn" onClick={handleCommentSubmit}>
                        <img src={send} alt="send" className="missing-send-image" />
                    </button>
                </div>
            </div>
        </>
    );
}
