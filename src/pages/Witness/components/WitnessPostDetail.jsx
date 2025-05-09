import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import '../WitnessPostDetail.css';
import testdog from '../../../assets/수완강아지.jpeg';
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        location: '경북 구미시 대학로 61',
        description:
            '도서관 앞 횡단보도에서 흰색 말티즈 목격했습니다. 주위에 사람이 많았고 겁에 질린 듯한 모습이었습니다.',
        images: [testdog, testdog, testdog],
        latitude: 36.1195,
        longitude: 128.3446,
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

    // ✅ 지도 관련
    const mapRef = useRef(null);
    useEffect(() => {
        const { latitude, longitude } = post;
        if (!latitude || !longitude) return;

        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const map = new kakao.maps.Map(mapRef.current, {
                    center: new kakao.maps.LatLng(latitude, longitude),
                    level: 4,
                });
                new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(latitude, longitude),
                    map,
                });
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [post.latitude, post.longitude]);

    return (
        <>
            <header className="witness-header">
                <button className="witness-back-button" onClick={goBack}>
                    <IoIosArrowBack />
                </button>
                <h1>목격게시글</h1>
            </header>

            <div className={`witness-detail-container ${fadeOut ? 'witness-fade-out' : ''}`}>
                <div className="witness-user-info">
                    <div className="witness-left-part">
                        <img src={user} alt="프로필 이미지" className="witness-profile-circle" />
                    </div>

                    <div className="witness-right-part">
                        <div className="witness-nickname-row" style={{ position: 'relative' }}>
                            <span className="witness-nickname">{post.author}</span>
                            <button className="witness-more-btn" onClick={() => setIsDropdownOpen((prev) => !prev)}>
                                &#8942;
                            </button>
                            {isDropdownOpen && (
                                <div className="witness-dropdown">
                                    <div
                                        className="witness-dropdown-item"
                                        onClick={() => {
                                            alert('게시글 수정');
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        게시글 수정
                                    </div>
                                    <div
                                        className="witness-dropdown-item"
                                        onClick={() => {
                                            alert('게시글 삭제');
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        게시글 삭제
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="witness-dog-row">
                            <div className="witness-dog-info">
                                <span className="witness-dog-name">{post.dogName}</span>
                                <span className="witness-breed">{post.breed}</span>
                            </div>
                            <div className="witness-time-ago">{post.timeAgo}</div>
                        </div>
                    </div>
                </div>

                <div className="witness-image-slider" onScroll={handleScroll}>
                    {post.images.map((img, idx) => (
                        <div className="witness-slide" key={idx}>
                            <img src={img} alt={`강아지${idx}`} />
                            {idx === currentImageIndex && (
                                <div className="witness-image-counter">
                                    {currentImageIndex + 1}/{post.images.length}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="witness-thumbnail-slider">
                    {post.images.map((img, idx) => (
                        <div className="witness-thumbnail-card" key={idx}>
                            <img src={img} alt={`썸네일${idx}`} />
                            <div className="witness-thumbnail-text">
                                <div>목격 - 2025년 4월 30일</div>
                                <div>품종</div>
                                <div>털색</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="witness-detail-info">
                    <div className="witness-date-row">
                        <img src={calender} alt="calender" className="witness-calender-image" /> {post.date}
                    </div>
                    <div className="witness-location-row">
                        <img src={location} alt="location" className="witness-location-image" />
                        {post.location}
                    </div>
                    <p className="witness-description">{post.description}</p>
                </div>

                {/* ✅ 지도 적용 */}
                <div className="witness-map-section">
                    <div ref={mapRef} className="witness-map-image" />
                </div>

                <div className="witness-comment-section">
                    <div className="witness-comment-count">댓글 {commentList.length}개</div>
                    {commentList.map((cmt, idx) => (
                        <div className="witness-comment" key={idx}>
                            <img src={user} alt="댓글 작성자" className="witness-comment-profile-circle" />
                            <div className="witness-comment-content">
                                <div className="witness-comment-meta">
                                    <span className="witness-comment-author">{cmt.author}</span>
                                    <span className="witness-comment-date">{cmt.date}</span>
                                </div>
                                <div className="witness-comment-text">{cmt.content}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="witness-comment-input-box">
                    <input
                        type="text"
                        placeholder="댓글을 작성해주세요"
                        className="witness-comment-input"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button className="witness-submit-btn" onClick={handleCommentSubmit}>
                        <img src={send} alt="send" className="witness-send-image" />
                    </button>
                </div>
            </div>
        </>
    );
}
