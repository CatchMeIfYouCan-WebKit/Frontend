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
import message from '../../../assets/message.svg';

export default function WitnessPostDetail() {
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
    // API : 목격 게시글
    useEffect(() => {
        axios
            .get(`/api/posts/witness/${id}`)
            .then((response) => setPost(response.data))
            .catch((err) => console.error('Error loading post:', err));
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

    // 지도 로드
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

    if (!post) return <div>Loading...</div>;
    function isWithinOneDay(dateString) {
        const createdAt = new Date(dateString);
        const now = new Date();
        const diffInMs = now - createdAt;
        const diffInHours = diffInMs / (1000 * 60 * 60); // ms → hours
        return diffInHours < 24;
    }
    return (
        <>
            <div className="sf-header">
                <div className="back-button2" onClick={goBack}>
                    <IoIosArrowBack size={32} />
                </div>
                <div className="filtering-title">목격게시글</div>
            </div>
            <div className={`witness-detail-container ${fadeOut ? 'witness-fade-out' : ''}`}>
                <div className="witness-user-info">
                    <div className="witness-top-row">
                        <img src={user} alt="프로필" className="witness-profile-circle" />
                        <div className="witness-nickname-section">
                            <span className="witness-nickname">{post.userNickname}</span>
                        </div>
                        <button className="witness-more-btn" onClick={() => setIsDropdownOpen((prev) => !prev)}>
                            &#8942;
                        </button>
                        {isDropdownOpen && (
                            <div className="witness-dropdown">
                                <div className="witness-dropdown-item" onClick={() => alert('게시글 수정')}>
                                    게시글 수정
                                </div>
                                <div className="witness-dropdown-item" onClick={() => alert('게시글 삭제')}>
                                    게시글 삭제
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="witness-bottom-row">
                        <div className="witness-dog-info">
                            <span className="witness-dog-name">{post.dogName}</span>
                            <span className="witness-breed">{post.breed}</span>
                        </div>
                        <div className="witness-time-ago">{calculateTimeAgo(post.createdAt)}</div>
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
                        <span className={`witness-post-type ${post.postType === 'witness' ? 'missing' : 'witness'}`}>
                            {post.postType === 'missing' ? '실종' : '목격'}
                        </span>
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
                <p className="witness-similar-info-text1">목격된 반려견과 유사한 실종정보에요!</p>

                {/* ✅ 슬라이더를 댓글 바로 위로 이동 */}
                <div className="witness-thumbnail-slider">
                    {post2.images.map((img, idx) => (
                        <div className="witness-thumbnail-card" key={idx}>
                            <img src={img} alt={`썸네일${idx}`} />
                            <div className="witness-thumbnail-text">
                                <div className="when">목격 - 2025년 4월 30일</div>
                                <div className="where">품종</div>
                                <div className="how">털색</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ 댓글 섹션 */}
                <div className="witness-comment-section">
                    <div className="witness-comment-count">댓글 {commentList.length}개</div>
                    {commentList
                        .filter((comment) => !comment.parentCommentId)
                        .map((parent) => (
                            <React.Fragment key={parent.id}>
                                <div className="witness-comment-block">
                                    <div
                                        className={`witness-comment ${
                                            replyTargetId === parent.id ? 'reply-input' : ''
                                        }`}
                                    >
                                        <img src={user} alt="작성자" className="witness-comment-profile-circle" />
                                        <div className="witness-comment-content">
                                            <div
                                                className="witness-comment-meta"
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <span className="witness-comment-author">
                                                    {parent.nickname}
                                                    {parent.userId === post.userId && (
                                                        <span className="witness-comment-author-writer"> (글쓴이)</span>
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

                                            <div className="witness-comment-text">{parent.content}</div>
                                            <span className="witness-comment-date">
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
                                            <div key={child.id} className="witness-comment reply-comment">
                                                <img
                                                    src={user}
                                                    alt="작성자"
                                                    className="witness-comment-profile-circle"
                                                />
                                                <div className="witness-comment-content">
                                                    <div className="witness-comment-meta">
                                                        <span className="witness-comment-author">
                                                            {child.nickname}
                                                            {child.userId === post.userId && (
                                                                <span className="witness-comment-author-writer">
                                                                    {' '}
                                                                    (글쓴이)
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="witness-comment-text">{child.content}</div>
                                                    <span className="witness-comment-date">
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
                <div className="witness-comment-input-box">
                    <input
                        type="text"
                        placeholder={replyTargetId ? '대댓글을 입력하세요' : '댓글을 입력해주세요'}
                        className="witness-comment-input"
                        value={replyTargetId ? replyInput : commentInput}
                        onChange={(e) =>
                            replyTargetId ? setReplyInput(e.target.value) : setCommentInput(e.target.value)
                        }
                    />
                    <button
                        className="witness-submit-btn"
                        onClick={() => (replyTargetId ? handleReplySubmit(replyTargetId) : handleCommentSubmit())}
                    >
                        <img src={send} alt="send" className="witness-send-image" />
                    </button>
                </div>
            </div>
        </>
    );
}
