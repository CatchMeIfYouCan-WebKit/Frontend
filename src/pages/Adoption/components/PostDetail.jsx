// src/pages/PostDetail.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosShare, IoIosArrowForward } from 'react-icons/io';
import { FiMoreVertical } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import markIcon from '../../../assets/mark.svg';
import dog from '../../../assets/shield-dog.svg';
import calender from '../../../assets/calender.svg';
import petcolor from '../../../assets/pet-color.svg';
import user from '../../../assets/user.svg';
import '../PostDetail.css';
import Chat from './Chat';

export default function PostDetail() {
    const [address, setAddress] = useState(''); // ← 여기를 추가!

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 이거는 유저 아이디로
    const currentUser = '한민규';

    const navigate = useNavigate();
    const { state } = useLocation();
    const { post, ownerName } = state || {};
    // ─── 이미지 캐러셀 상태/함수 추가 ───
    const imageList = Array.isArray(post.images) && post.images.length > 0 ? post.images : [post.image];
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalImages = imageList.length;
    const prevImage = () => setCurrentIndex((i) => (i - 1 + totalImages) % totalImages);
    const nextImage = () => setCurrentIndex((i) => (i + 1) % totalImages);
    const {
        user_id,
        image,
        petName,
        isVerified,
        breed,
        colors,
        birth,
        gender,
        neutered,
        registrationNo,
        phone,
        location: meetText,
        latitude,
        longitude,
        timeAgo,
        description,
    } = post || {};

    const COLOR_LABELS = {
        black: '검은색',
        white: '하얀색',
        gray: '회색',
        brown: '갈색',
        red: '붉은색',
        gold: '골드',
    };

    // 2) 넘어온 colors 배열(또는 단일 값)을 한글로 변환
    const displayColors = Array.isArray(colors)
        ? colors.map((c) => COLOR_LABELS[c] || c).join(', ')
        : COLOR_LABELS[colors] || colors;

    // meetText 에 위도,경도 문자열("37.568076, 126.977678")가 들어온 경우 파싱
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

    useEffect(() => {
        const onClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const handleEdit = () => {
        navigate(`/adoption/post/edit/${post.id}`, {
            state: {
                post,
                ownerName,
            },
        });
    };

    const handleDelete = () => {
        // 예: 삭제 로직
        if (window.confirm('정말 삭제하시겠습니까?')) {
            // 삭제 API 호출…
        }
    };
    // 지도 띄울때 필요한 api !!!!!!!!!!!!!!!!!!!!!
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

    return (
        <div className="pd-page">
            {/* 헤더 */}
            <header className="pd-header">
                <button className="pd-back" onClick={() => navigate(-1)}>
                    <IoIosArrowBack size={24} />
                </button>
                <div className="pd-actions" ref={dropdownRef}>
                    <FiMoreVertical size={24} onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }} />

                    {open && (
                        <div className="pd-dropdown">
                            <button className="pd-dropdown-item" onClick={handleEdit}>
                                게시글 수정
                            </button>
                            <button className="pd-dropdown-item" onClick={handleDelete}>
                                게시글 삭제
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* 이미지 & 페이지네이션 */}
            <div className="pd-carousel">
                <img src={imageList[currentIndex]} alt={petName} className="pd-image" />
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
                <div className="pd-pagination">
                    {currentIndex + 1}/{totalImages}
                </div>
            </div>

            {/* 제목 & 검증배지 */}
            <div className="pd-title-section">
                <div className="pd-petname">
                    {petName}
                    {isVerified && <img src={markIcon} alt="인증" className="pd-verified" />}
                </div>
            </div>

            {/* 상단 태그들 */}
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

            <div className="null-space"></div>

            {/* 설명 */}
            <div className="pd-description-section">
                <div className="pd-description-title">{breed} 분양합니다.</div>
                <div className="pd-timeago">{timeAgo}</div>
                <p className="pd-description-text">{description}</p>
            </div>

            {/* 만날 곳 */}
            <div className="pd-meet-section">
                <div className="pd-meet-label">아이와 만날곳</div>
                {/*  여기가 지도!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                <div ref={mapRef} className="pd-map" />
            </div>

            <div className="null-space"></div>

            {/* 상세 정보 리스트 */}
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
                <li className="pd-info-item">
                    <div className="pd-info-label">장소</div>
                    <div className="pd-info-value">{address || meetText}</div>
                </li>
            </ul>
            {/* 여기 밑에 게시글 장성한 유저 아이디랑 현재 유저 아이디 체크해서 유저 아이디가 다르면 chat이 보이게  */}
            {<Chat onClick={() => {}} />}
            {/* 클릭하면 주인이랑 채팅할 수 있게 */}
        </div>
    );
}
