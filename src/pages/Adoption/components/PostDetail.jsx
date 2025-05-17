// src/pages/PostDetail.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import markIcon from '../../../assets/mark.svg';
import dog from '../../../assets/shield-dog.svg';
import calender from '../../../assets/calender.svg';
import petcolor from '../../../assets/pet-color.svg';
import Chat from './Chat';
import '../PostDetail.css';
import { FiMoreVertical, FiChevronDown } from 'react-icons/fi';
import axios from 'axios'; // ← 추가
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function PostDetail() {
    const navigate = useNavigate();
    const subscriptionRef = useRef(null); // ✅ 구독 ID 저장용
    const { state } = useLocation();
    const { post, ownerName } = state || {};

    // =================================================== 알림

    const socketRef = useRef(null);
    const clientRef = useRef(null);

    // 웹소켓 연결
    useEffect(() => {
        if (!clientRef.current) {
            const client = new Client({
                webSocketFactory: () => new SockJS('http://10.0.2.2:8080/ws'),
                reconnectDelay: 5000,
            });

            client.onConnect = () => {
                console.log('✅ STOMP 연결 성공');

                const token = localStorage.getItem('accessToken');
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentUserId = payload.userId || payload.id || payload.sub;

                const notifyPath = `/topic/notify/${currentUserId}`;
                console.log('👤 현재 사용자 ID:', currentUserId);
                console.log('📡 알림 구독 경로:', notifyPath);

                // ✅ 기존 구독이 있으면 먼저 해제
                if (subscriptionRef.current) {
                    client.unsubscribe(subscriptionRef.current);
                    console.log('🔄 기존 구독 해제:', subscriptionRef.current);
                }

                // ✅ 새로운 구독 등록
                const subscription = client.subscribe(notifyPath, (message) => {
                    const data = JSON.parse(message.body);
                    alert(`📢 알림: ${data.message}`);
                });
                subscriptionRef.current = subscription.id; // ✅ 구독 ID 저장

                // 채팅 구독
                if (typeof chatRoomId !== 'undefined' && chatRoomId !== null) {
                    const chatPath = `/topic/chat/${chatRoomId}`;
                    console.log('📡 채팅 구독 경로:', chatPath);

                    client.subscribe(chatPath, (message) => {
                        const data = JSON.parse(message.body);
                        console.log('📩 채팅 메시지 수신:', data);
                    });
                }
            };

            clientRef.current = client;
            client.activate();

            return () => {
                client.deactivate();
                subscriptionRef.current = null; // ✅ 구독 정보 정리
            };
        }
    }, []);

    // 채팅하기 버튼 클릭 시 알림 전송
    const handleChatClick = () => {
        console.log('💬 [handleChatClick] 버튼 클릭됨');
        console.log('📦 전송 대상 receiverId:', post.member.id);

        function sendNotification() {
            clientRef.current.publish({
                destination: '/app/notify',
                body: JSON.stringify({
                    receiverId: post.member.id,
                    message: '채팅 요청이 도착했습니다!',
                }),
            });
            console.log('✅ 알림 전송 요청 완료 (sendNotification 호출됨)');
        }

        const client = clientRef.current;
        if (client?.connected) {
            sendNotification();
        } else {
            console.log('📡 WebSocket 미연결, 연결 시도 중...');

            if (!client.active) {
                client.onConnect = () => {
                    console.log('✅ STOMP 연결 성공 (onConnect 호출됨)');
                    sendNotification();
                };
                client.activate();
            } else {
                console.log('📡 이미 연결 시도 중입니다.');
            }
        }

        navigate(`/chat/ADOPTION/${id}`, { state: { receiverId: post.member.id } });
    };

    // =================================================== 알림
    // 주소(역지오코딩)
    const [address, setAddress] = useState('');

    // 옵션 드롭다운
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 분양 상태 드롭다운
    const [status, setStatus] = useState('분양중');
    const [statusOpen, setStatusOpen] = useState(false);
    const statusRef = useRef(null);

    // 이미지 캐러셀
    const [currentIndex, setCurrentIndex] = useState(0);

    // post.status 초기화
    useEffect(() => {
        if (post?.status) {
            setStatus(post.status);
        }
    }, [post]);
    const [isOwner, setIsOwner] = useState(false);

    // 게시글 작성자 ID 확인용 콘솔
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const writerId = post?.member?.id;

        if (token && writerId) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentUserId = payload.userId || payload.id || payload.sub;

                console.log('✔️ JWT userId:', currentUserId);
                console.log('✔️ post.member.id:', writerId);

                if (String(currentUserId) === String(writerId)) {
                    setIsOwner(true);
                }
            } catch (err) {
                console.error('❌ JWT 디코딩 오류:', err);
            }
        }
    }, [post]);

    // 이미지 리스트 준비
    const imageList = post ? (Array.isArray(post.images) && post.images.length > 0 ? post.images : [post.image]) : [];
    const totalImages = imageList.length;
    const prevImage = () => setCurrentIndex((i) => (i - 1 + totalImages) % totalImages);
    const nextImage = () => setCurrentIndex((i) => (i + 1) % totalImages);

    // 포스트 데이터 디스트럭쳐링
    const {
        id,
        petName,
        isVerified,
        breed,
        colors,
        birth,
        gender,
        neutered,
        registrationNo,
        timeAgo,
        description,
        location: meetText,
        latitude,
        longitude,
    } = post || {};

    // 색상 한글 변환
    const COLOR_LABELS = {
        검은색: '검은색',
        하얀색: '하얀색',
        회색: '회색',
        브라운: '브라운',
        어두운골드: '어두운골드',
        밝은골드: '밝은골드',
    };
    // ✅ 색상 한글 매핑 또는 그대로 출력
    const rawColors = colors || post.coatColor || post.pet?.coatColor || '';

    const displayColors = Array.isArray(rawColors)
        ? rawColors.map((c) => COLOR_LABELS[c] || c).join(', ')
        : rawColors.includes('+') // 다중 색상 처리
        ? rawColors
              .split('+')
              .map((c) => COLOR_LABELS[c.trim()] || c.trim())
              .join(', ')
        : COLOR_LABELS[rawColors.trim()] || rawColors.trim();

    // meetText 파싱
    let mapLat = latitude,
        mapLng = longitude;
    if ((mapLat == null || mapLng == null) && meetText) {
        const [latStr, lngStr] = meetText.split(',');
        const pLat = parseFloat(latStr);
        const pLng = parseFloat(lngStr);
        if (!isNaN(pLat) && !isNaN(pLng)) {
            mapLat = pLat;
            mapLng = pLng;
        }
    }

    // 바깥 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
            if (statusRef.current && !statusRef.current.contains(e.target)) {
                setStatusOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 카카오맵 및 역지오코딩
    const mapRef = useRef(null);
    useEffect(() => {
        if (mapLat != null && mapLng != null) {
            const script = document.createElement('script');
            script.src =
                'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(() => {
                    const kakao = window.kakao;
                    const map = new kakao.maps.Map(mapRef.current, {
                        center: new kakao.maps.LatLng(mapLat, mapLng),
                        level: 4,
                    });
                    new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(mapLat, mapLng),
                        map,
                    });
                    const geocoder = new kakao.maps.services.Geocoder();
                    geocoder.coord2Address(mapLng, mapLat, (result, status) => {
                        if (status === kakao.maps.services.Status.OK && result[0]) {
                            setAddress(result[0].address.address_name);
                        }
                    });
                });
            };

            return () => {
                document.head.removeChild(script);
            };
        }
    }, [mapLat, mapLng]);

    // 편집/삭제 핸들러
    const handleEdit = () => {
        navigate(`/adoption/post/edit/${id}`, {
            state: { post },
        });
    };
    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            const isWeb = typeof window !== 'undefined' && window?.location?.hostname;
            const baseUrl = isWeb ? `http://${window.location.hostname}:8080` : 'http://10.0.2.2:8080';

            const deleteUrl = `${baseUrl}/api/adopt/${id}`;

            await axios.delete(deleteUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('게시글이 삭제되었습니다.');
            navigate('/adoptionpost');
        } catch (error) {
            console.error('❌ 삭제 실패:', error);
            alert('게시글 삭제 중 오류가 발생했습니다.');
        }
    };
    // ✅ 분양 상태 업데이트 함수 추가
    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `/api/adopt/${id}/status`,
                { status: newStatus }, // { status: '분양완료' } 또는 '분양중'
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus(newStatus);
        } catch (err) {
            console.error('분양 상태 변경 실패', err);
            alert('상태 변경에 실패했습니다.');
        }
    };
    return (
        <div className="pd-page">
            {/* 워터마크 */}
            {status === '분양완료' && (
                <div className="pd-watermark">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="pd-watermark-line">
                            CatchMe CatchMe
                        </div>
                    ))}
                </div>
            )}

            <div className="pd-content">
                {/* 헤더 */}
                <header className="pd-header">
                    <button className="pd-back" onClick={() => navigate(-1)}>
                        <IoIosArrowBack size={24} />
                    </button>
                    <div className="pd-actions" ref={dropdownRef}>
                        <FiMoreVertical size={24} onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }} />
                        {open && (
                            <div className="pd-dropdown">
                                <button
                                    className="pd-dropdown-item"
                                    onClick={isOwner ? handleEdit : undefined}
                                    style={{
                                        cursor: isOwner ? 'pointer' : 'not-allowed',
                                        opacity: isOwner ? 1 : 0.5,
                                    }}
                                >
                                    게시글 수정
                                </button>
                                <button
                                    className="pd-dropdown-item"
                                    onClick={isOwner ? handleDelete : undefined}
                                    style={{
                                        cursor: isOwner ? 'pointer' : 'not-allowed',
                                        opacity: isOwner ? 1 : 0.5,
                                    }}
                                >
                                    게시글 삭제
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                {/* 이미지 캐러셀 */}
                <div className="pd-carousel">
                    {imageList.length > 0 && <img src={imageList[currentIndex]} alt={petName} className="pd-image" />}
                    {totalImages > 1 && (
                        <>
                            <div className="pd-arrow left" onClick={prevImage}>
                                <IoIosArrowBack size={20} />
                            </div>
                            <div className="pd-arrow right" onClick={nextImage}>
                                <IoIosArrowForward size={20} />
                            </div>
                        </>
                    )}
                    {totalImages > 0 && (
                        <div className="pd-pagination">
                            {currentIndex + 1}/{totalImages}
                        </div>
                    )}
                </div>
                {/* 제목 & 검증배지 */}
                <div className="pd-title-section">
                    <div className="pd-petname">
                        {petName}
                        {isVerified && <img src={markIcon} alt="인증" className="pd-verified" />}
                    </div>
                </div>
                {/* 상단 태그 */}
                <div className="pd-tags">
                    <div className="pd-tag">
                        <img src={petcolor} alt="털색" className="pd-tag-icon" />
                        <div>
                            <div className="pd-tag-label">털색</div>
                            <span className="pd-info-value">{displayColors}</span>
                        </div>
                    </div>
                    <div className="pd-tag">
                        <img src={dog} alt="품종" className="pd-tag-icon" />
                        <div>
                            <div className="pd-tag-label">품종</div>
                            <div className="pd-info-value">{breed}</div>
                        </div>
                    </div>
                    <div className="pd-tag">
                        <img src={calender} alt="태어난 날" className="pd-tag-icon" />
                        <div>
                            <div className="pd-tag-label">태어난 날</div>
                            <div className="pd-info-value">{birth}</div>
                        </div>
                    </div>
                </div>
                <div className="null-space" />
                {/* 설명 */}
                <div className="pd-description-section">
                    {/* 분양 상태 선택 */}
                    {/* 내 게시글에서만 */}
                    <div className="pd-status-section" ref={statusRef}>
                        <div
                            className="pd-status-btn"
                            onClick={() => isOwner && setStatusOpen((o) => !o)}
                            style={{
                                cursor: isOwner ? 'pointer' : 'not-allowed',
                                opacity: isOwner ? 1 : 0.5,
                            }}
                        >
                            {status} <FiChevronDown size={16} style={{ marginLeft: 4 }} />
                        </div>
                        {statusOpen && isOwner && (
                            <div className="pd-status-dropdown">
                                {['분양중', '분양완료'].map((s) => (
                                    <div
                                        key={s}
                                        className="pd-status-item"
                                        onClick={() => {
                                            handleStatusChange(s);
                                            setStatusOpen(false);
                                        }}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pd-description-title">{breed} 분양합니다.</div>
                    <div className="pd-timeago">{timeAgo}</div>
                    <p className="pd-description-text">{description}</p>
                </div>
                {/* 만날 곳 */}
                <div className="pd-meet-section">
                    <div className="pd-meet-label">아이와 만날곳</div>
                    <div ref={mapRef} className="pd-map" />
                    {address && <div className="pd-meet-address">{address}</div>}
                </div>
                <div className="null-space" />
                {/* 상세 정보 */}
                <ul className="pd-info-list">
                    <li className="pd-info-item">
                        <div className="pd-info-label">품종</div>
                        <div className="pd-info-value">{breed}</div>
                    </li>
                    <li className="pd-info-item">
                        <div className="pd-info-label">털색</div>
                        <div className="pd-info-value">{displayColors}</div>
                    </li>
                    <li className="pd-info-item">
                        <div className="pd-info-label">성별</div>
                        <div className="pd-info-value">{gender}</div>
                    </li>
                    <li className="pd-info-item">
                        <div className="pd-info-label">중성화여부</div>
                        <div className="pd-info-value">{neutered ? 'O' : 'X'}</div>
                    </li>
                    <li className="pd-info-item">
                        <div className="pd-info-label">동물등록여부</div>
                        <div className="pd-info-value">{registrationNo ? 'O' : 'X'}</div>
                    </li>
                </ul>
                {/* 채팅 버튼 */}+{' '}
                {!isOwner && status === '분양중' ? (
                    <div className="pd-chat-button" onClick={handleChatClick}>
                        <Chat />
                    </div>
                ) : (
                    !isOwner && (
                        <button className="pd-chat-disabled" disabled>
                            채팅 불가
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
