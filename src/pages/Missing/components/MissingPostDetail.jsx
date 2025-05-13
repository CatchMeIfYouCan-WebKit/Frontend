// src/pages/MissingPostDetail.jsx

import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import '../MissingPostDetail.css';
import testdog from '../../../assets/수완강아지.jpeg';
import calender from '../../../assets/uit_calender.svg';
import location from '../../../assets/location.svg';
import send from '../../../assets/send.svg';
import user from '../../../assets/users.svg';
import axios from 'axios';

export default function MissingPostDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
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

    const post2 = { images: [testdog, testdog, testdog] };

    const goBack = () => {
        setFadeOut(true);
        setTimeout(() => navigate(-1), 400);
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

    // 사진 불러오기
    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    // ?일 전 계산
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

    useEffect(() => {
        console.log('요청 ID:', id);
        axios
            .get(`/api/posts/${id}`)
            .then((response) => {
                console.log('응답 데이터:', response.data);
                setPost(response.data);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);

    // ✅ 지도 관련
    const mapRef = useRef(null);

    useEffect(() => {
        if (!post || !post.missingLocation) {
            console.log('지도 표시 실패: 주소 정보 없음', post);
            return;
        }

        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const geocoder = new kakao.maps.services.Geocoder();

                console.log('주소로 좌표 변환 요청:', post.missingLocation);

                geocoder.addressSearch(post.missingLocation, (result, status) => {
                    console.log('주소 검색 결과:', result, '상태:', status);

                    if (status === window.kakao.maps.services.Status.OK) {
                        const latitude = parseFloat(result[0].y);
                        const longitude = parseFloat(result[0].x);
                        console.log('변환된 좌표:', latitude, longitude);

                        const map = new kakao.maps.Map(mapRef.current, {
                            center: new kakao.maps.LatLng(latitude, longitude),
                            level: 4,
                        });

                        new window.kakao.maps.Marker({
                            position: new window.kakao.maps.LatLng(latitude, longitude),
                            map,
                        });
                        console.log('지도와 마커 생성 완료');
                    } else {
                        console.error('주소 변환 실패: 상태 =', status);
                    }
                });
            });
        };

        return () => {
            console.log('카카오 스크립트 제거');
            document.head.removeChild(script);
        };
    }, [post]);

    if (!post) return <div>Loading...</div>;

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
                            <span className="missing-nickname">{post.userNickname}</span>
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
                            <div className="missing-time-ago">{calculateTimeAgo(post.createdAt)}</div>
                        </div>
                    </div>
                </div>

                <div className="missing-image-slider" onScroll={handleScroll}>
                    <div className="missing-slide">
                        <img src={getImageUrl(post.photoUrl)} alt={'강아지'} />
                    </div>
                </div>

                <div className="missing-thumbnail-slider">
                    {post2.images.map((img, idx) => (
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
                        <img src={calender} alt="calender" className="missing-calender-image" />{' '}
                        {new Date(post.missingDatetime).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}{' '}
                        {post.postType === 'missing' ? '실종' : '목격'}{' '}
                    </div>
                    <div className="missing-location-row">
                        <img src={location} alt="location" className="missing-location-image" />
                        {post.missingLocation}
                    </div>
                    <p className="missing-description">{post.detailDescription}</p>
                </div>

                {/* ✅ 지도 적용 */}
                <div className="missing-map-section">
                    <div ref={mapRef} className="missing-map-image" />
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
