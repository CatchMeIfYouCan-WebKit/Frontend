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
import message from '../../../assets/message.svg';
import axios from 'axios';

export default function MissingPostDetail() {
    const navigate = useNavigate();
    const mapRef = useRef(null);

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [replyTargetId, setReplyTargetId] = useState(null);
    const [replyInput, setReplyInput] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [nickname, setNickname] = useState('');

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

    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    // 현재 사용자의 id 가져오기
    function getCurrentUserId() {
        const token = localStorage.getItem('accessToken');
        console.log('토큰:', token);

        if (!token) {
            console.warn('토큰이 없습니다.');
            return;
        }

        try {
            const payloadBase64 = token.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);

            return payload.id; // 바로 id만 반환
        } catch (err) {
            console.error('토큰 파싱 에러:', err);
            return null;
        }
    }

    // API : 댓글 등록
    const handleCommentSubmit = async () => {
        if (!commentInput.trim()) return;

        try {
            await axios.post('/api/comments', {
                postId: Number(id), // 게시글 ID
                userId: getCurrentUserId(), // 현재 로그인된 사용자 ID 동적 할당
                content: commentInput,
            });

            console.log('✅ 댓글 작성 성공'); // 성공 로그 추가
            setCommentInput('');

            // 댓글 다시 조회
            const response = await axios.get(`/api/comments/post/${id}`);
            const sortedComments = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setCommentList(sortedComments);
        } catch (err) {
            console.error('댓글 작성 실패:', err.response?.data?.error || err.message);
        }
    };

    // API : 대댓글 등록
    const handleReplySubmit = async (parentCommentId) => {
        if (!replyInput.trim()) return;

        try {
            await axios.post('/api/comments', {
                postId: Number(id),
                userId: getCurrentUserId(),
                content: replyInput,
                parentCommentId: parentCommentId,
            });

            console.log('대댓글 작성 성공');

            setReplyInput('');
            setReplyTargetId(null); // 입력창 닫기

            // 댓글 목록 새로고침
            const response = await axios.get(`/api/comments/post/${id}`);
            const sortedComments = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setCommentList(sortedComments);
        } catch (err) {
            console.error('대댓글 작성 실패:', err.response?.data?.error || err.message);
        }
    };

    // 대댓글 추가 버튼
    const handleReplyClick = (commentId) => {
        setReplyTargetId((prevId) => (prevId === commentId ? null : commentId));
    };

    // ?분 전
    const calculateTimeAgo = (createdAt) => {
        const now = new Date();
        const isoDateStr = createdAt.replace(' ', 'T') + '+09:00';
        const createdDate = new Date(isoDateStr);

        const diffMs = now - createdDate;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return '방금 전';
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        return `${diffDays}일 전`;
    };

    // 날짜 변환
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
    // ======================================================================================== useEffect
    // API : 실종 게시글
    useEffect(() => {
        axios
            .get(`/api/posts/missing/${id}`)
            .then((response) => setPost(response.data))
            .catch((error) => console.error('Error:', error));
    }, [id]);

    // API : 댓글 조회
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/post/${id}`);
                setCommentList(response.data);
                console.log('댓글 목록 조회 성공: ', response.data);
            } catch (err) {
                console.error('댓글 목록 조회 실패: ', err.response?.data?.error || err.message);
            }
        };

        fetchComments();
    }, [id]);

    //목격 추천 api
    useEffect(() => {
        axios
            .get(`/api/posts/missing/${id}/recommendations`)
            .then((res) => setRecommendations(res.data))
            .catch((err) => console.error('추천 게시글 조회 실패:', err));
    }, [id]);
    //닉네임임
    useEffect(() => {
        axios
            .get(`/api/posts/missing/${id}`)
            .then((response) => {
                setPost(response.data);

                // 닉네임 요청도 여기서 함께 처리
                return axios.post('/api/member/info', {
                    id: response.data.userId.toString(),
                });
            })
            .then((res) => {
                console.log('✅ 닉네임 응답:', res.data);
                setNickname(res.data.nickname || '알 수 없음');
            })
            .catch((err) => {
                console.error('게시글 or 닉네임 조회 실패:', err);
                setNickname('알 수 없음');
            });
    }, [id]);
    // 지도 로드
    useEffect(() => {
        if (!post || !post.missingLocation) return;

        const script = document.createElement('script');
        script.src =
            'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const geocoder = new kakao.maps.services.Geocoder();

                geocoder.addressSearch(post.missingLocation, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const latitude = parseFloat(result[0].y);
                        const longitude = parseFloat(result[0].x);

                        const map = new kakao.maps.Map(mapRef.current, {
                            center: new kakao.maps.LatLng(latitude, longitude),
                            level: 4,
                        });

                        new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(latitude, longitude),
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
            .get(`/api/posts/missing/${id}`)
            .then((response) => {
                console.log('📌 포스트:', response.data); // 추가
                setPost(response.data);
            })
            .catch((err) => console.error(err));
    }, [id]);
    //게시글 조회회

    if (!post) return <div>Loading...</div>;
    // ======================================================================================== useEffect
    function isWithinOneDay(dateString) {
        const createdAt = new Date(dateString);
        const now = new Date();
        const diffInMs = now - createdAt;
        const diffInHours = diffInMs / (1000 * 60 * 60); // ms → hours
        return diffInHours < 24;
    }

    return (
        <>
            <div className="missing-header">
                <div className="missing-back-button" onClick={goBack}>
                    <IoIosArrowBack size={32} />
                </div>
                <div className="missing-filtering-title1">실종게시글</div>
            </div>

            <div className={`missing-detail-container ${fadeOut ? 'missing-fade-out' : ''}`}>
                {/* 유저 정보 */}
                <div className="missing-user-info">
                    <div className="missing-top-row">
                        <img src={user} alt="프로필" className="missing-profile-circle" />
                        <div className="missing-nickname-section">
                            <span className="missing-nickname">{nickname}</span>
                        </div>
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

                    <div className="missing-bottom-row">
                        <div className="missing-dog-info">
                            <span className="missing-dog-name">{post.petName}</span>
                            <span className="missing-breed">{post.petBreed}</span>
                        </div>
                        <div className="missing-time-ago">{calculateTimeAgo(post.createdAt)}</div>
                    </div>
                </div>

                {/* 이미지 슬라이더 */}
                <div className="missing-image-slider" onScroll={handleScroll}>
                    {post.photoUrl?.split(',').map((img, idx) => (
                        <div className="missing-slide" key={idx}>
                            <img src={getImageUrl(img)} alt={`목격사진${idx}`} />
                            {idx === currentImageIndex && (
                                <div className="missing-image-counter">
                                    {currentImageIndex + 1}/{post.photoUrl.split(',').length}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 실종 상세 정보 */}
                <div className="missing-detail-info">
                    <div className="missing-date-row">
                        <img src={calender} alt="calender" className="missing-calender-image" />
                        {new Date(post.missingDatetime).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}
                        <span className={`witness-post-type ${post.postType === 'missing' ? 'missing' : 'witness'}`}>
                            {post.postType === 'missing' ? '실종' : '목격'}
                        </span>
                    </div>
                    <div className="missing-location-row">
                        <img src={location} alt="location" className="missing-location-image" />
                        {post.missingLocation}
                    </div>
                    <p className="missing-description">{post.detailDescription}</p>
                </div>

                {/* 지도 섹션 */}
                <div className="missing-map-section">
                    <div ref={mapRef} className="missing-map-image" />
                </div>

                {/* 닮은 목격 정보 */}
                <p className="witness-similar-info-text1">실종된 아이와 닮은 목격정보에요!</p>

                <div className="missing-thumbnail-slider">
                    {recommendations.map((item, idx) => (
                        <div
                            className="missing-thumbnail-card"
                            key={idx}
                            onClick={() => navigate(`/witnesspostDetail/${item.id}`)} // ✅ 목격 상세 페이지 이동
                            style={{ cursor: 'pointer' }} // UX 개선
                        >
                            <img src={getImageUrl(item.photoUrl)} alt={`썸네일${idx}`} />
                            <div className="missing-thumbnail-text">
                                <div>목격 - {formatDate(item.witnessDatetime || item.missingDatetime)}</div>
                                <div>{item.predictedBreed || '품종 정보 없음'}</div>
                                <div>{item.predictedColor || '털색 정보 없음'}</div>
                                {item.distance && <div>{item.distance.toFixed(1)}km 근처</div>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ 댓글 섹션 */}

                <div className="missing-comment-section">
                    <div className="missing-comment-count">댓글 {commentList.length}개</div>
                    {commentList
                        .filter((comment) => !comment.parentCommentId)
                        .map((parent) => (
                            <React.Fragment key={parent.id}>
                                <div className="missing-comment-block">
                                    <div
                                        className={`missing-comment ${
                                            replyTargetId === parent.id ? 'reply-input' : ''
                                        }`}
                                    >
                                        <img src={user} alt="작성자" className="missing-comment-profile-circle" />
                                        <div className="missing-comment-content">
                                            <div
                                                className="missing-comment-meta"
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <span className="missing-comment-author">
                                                    {parent.nickname}
                                                    {parent.userId === post.userId && (
                                                        <span className="missing-comment-author-writer"> (글쓴이)</span>
                                                    )}
                                                </span>
                                                <img
                                                    src={message}
                                                    alt="답글 작성"
                                                    onClick={() => {
                                                        if (window.confirm('대댓글을 작성하시겠습니까?')) {
                                                            handleReplyClick(parent.id);
                                                        }
                                                    }}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        cursor: 'pointer',
                                                        marginRight: '16px',
                                                    }}
                                                />
                                            </div>

                                            <div className="missing-comment-text">{parent.content}</div>
                                            <span className="missing-comment-date">
                                                {isWithinOneDay(parent.createdAt)
                                                    ? calculateTimeAgo(parent.createdAt)
                                                    : formatDate(parent.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 대댓글 */}

                                    {commentList
                                        .filter((comment) => comment.parentCommentId === parent.id)
                                        .map((child) => (
                                            <div key={child.id} className="missing-comment reply-comment">
                                                <img
                                                    src={user}
                                                    alt="작성자"
                                                    className="missing-comment-profile-circle"
                                                />
                                                <div className="missing-comment-content">
                                                    <div className="missing-comment-meta">
                                                        <span className="missing-comment-author">
                                                            {child.nickname}
                                                            {child.userId === post.userId && (
                                                                <span className="missing-comment-author-writer">
                                                                    {' '}
                                                                    (글쓴이)
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="missing-comment-text">{child.content}</div>
                                                    <span className="missing-comment-date">
                                                        {isWithinOneDay(child.createdAt)
                                                            ? calculateTimeAgo(child.createdAt)
                                                            : formatDate(child.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </React.Fragment>
                        ))}
                </div>

                {/* 댓글 입력창 */}
                <div className="missing-comment-input-box">
                    <input
                        type="text"
                        placeholder={replyTargetId ? '대댓글을 입력하세요' : '댓글을 입력해주세요'}
                        className="missing-comment-input"
                        value={replyTargetId ? replyInput : commentInput}
                        onChange={(e) =>
                            replyTargetId ? setReplyInput(e.target.value) : setCommentInput(e.target.value)
                        }
                    />
                    <button
                        className="missing-submit-btn"
                        onClick={() => (replyTargetId ? handleReplySubmit(replyTargetId) : handleCommentSubmit())}
                    >
                        <img src={send} alt="send" className="missing-send-image" />
                    </button>
                </div>
            </div>
        </>
    );
}

{
    /* 답글 쓰기 버튼 */
}
{
    /* {!comment.parentCommentId && (
                                    <button
                                        className="missing-comment-reply-btn"
                                        onClick={() => handleReplyClick(comment.id)}
                                    >
                                        {replyTargetId === comment.id ? '답글 취소' : '답글 쓰기'}
                                    </button>
                                )} */
}
