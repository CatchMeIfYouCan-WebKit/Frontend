import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import '../WitnessPostDetail.css';
import testdog from '../../../assets/수완강아지.jpeg';
import calender from '../../../assets/uit_calender.svg';
import location from '../../../assets/location.svg';
import send from '../../../assets/send.svg';
import user from '../../../assets/users.svg';
import axios from 'axios';

export default function WitnessPostDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
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

    const post2 = { images: [testdog, testdog, testdog] };

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

    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    const calculateTimeAgo = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffMs = now - createdDate;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return '방금 전';
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        return `${diffDays}일 전`;
    };

    // ✅ 지도 관련
    const mapRef = useRef(null);
    useEffect(() => {
        if (!post?.witnessLocation) return;

        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch(post.witnessLocation, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const latitude = parseFloat(result[0].y);
                        const longitude = parseFloat(result[0].x);

                        const map = new window.kakao.maps.Map(mapRef.current, {
                            center: new window.kakao.maps.LatLng(latitude, longitude),
                            level: 4,
                        });

                        new window.kakao.maps.Marker({
                            position: new window.kakao.maps.LatLng(latitude, longitude),
                            map,
                        });
                    }
                });
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [post]);

    useEffect(() => {
        axios
            .get(`/api/posts/witness/${id}`)
            .then((response) => setPost(response.data))
            .catch((err) => console.error('Error loading post:', err));
    }, [id]);

    if (!post) return <div>Loading...</div>;

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
                            <span className="witness-nickname">{post.userNickname}</span>
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
                            <div className="witness-time-ago">{calculateTimeAgo(post.createdAt)}</div>
                        </div>
                    </div>
                </div>

                <div className="witness-image-slider" onScroll={handleScroll}>
                    {post.photoUrl?.split(',').map((img, idx) => (
                        <div className="witness-slide" key={idx}>
                            <img src={getImageUrl(img)} alt={`목격사진${idx}`} />
                            {idx === currentImageIndex && (
                                <div className="witness-image-counter">
                                    {currentImageIndex + 1}/{post.photoUrl.split(',').length}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="witness-detail-info">
                    <div className="witness-date-row">
                        <img src={calender} alt="calender" className="witness-calender-image" />
                        {new Date(post.witnessDatetime).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}
                        {post.postType === 'missing' ? '실종' : '목격'}
                    </div>
                    <div className="witness-location-row">
                        <img src={location} alt="location" className="witness-location-image" />
                        {post.witnessLocation}
                    </div>
                    <p className="witness-description">{post.detailDescription}</p>
                </div>

                {/* ✅ 지도 */}
                <div className="witness-map-section">
                    <div ref={mapRef} className="witness-map-image" />
                </div>
                <p className="witness-similar-info-text">목격된 아이와 닮은 실종정보에요!</p>

                {/* ✅ 슬라이더를 댓글 바로 위로 이동 */}
                <div className="witness-thumbnail-slider">
                    {post2.images.map((img, idx) => (
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

                {/* ✅ 댓글 */}
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
