// src/pages/RegisterPost.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../RegisterPost.css'; // 적절히 경로 수정
import rightside from '../../../assets/rightside.svg';
import fallbackImage from '../../../assets/testdog.png'; // ← add this

export default function RegisterPost() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const {
        petName,
        breed,
        colors,
        gender,
        neutered,
        birthDate,
        weight,
        registrationNo,
        phone,
        isVerified,
        photoUrl, // 만약 이미지 URL을 넘겨주셨다면
        latitude,
        longitude,
        description: initDesc,
    } = state || {};
    const [description, setDescription] = useState(initDesc || '');

    return (
        <div className="register-post">
            <header className="rp-header">
                <button className="rp-back" onClick={() => navigate(-1)}>
                    <IoIosArrowBack size={24} />
                </button>
                <h1 className="rp-title">게시글 작성</h1>
            </header>

            <section className="rp-pet-info">
                {photoUrl ? (
                    <img src={photoUrl} alt={petName} className="rp-pet-avatar" />
                ) : (
                    <div className="rp-pet-avatar--placeholder" />
                )}
                <div className="rp-pet-name">
                    {petName}
                    {isVerified && <span className="rp-badge">✔️</span>}
                </div>
            </section>

            <form className="rp-form" onSubmit={(e) => e.preventDefault()}>
                <div className="rp-form-group">
                    <label className="label-title">제목</label>
                    <input
                        type="text"
                        className="rp-input"
                        placeholder="제목을 입력하세요"
                        defaultValue={breed ? `${breed} 분양합니다` : ''}
                    />
                </div>

                <div className="rp-form-group">
                    <label className="label-title">우리 아이는요...</label>
                    <textarea
                        className="rp-textarea"
                        placeholder="우리 아이의 특징을 자세히 입력해 주세요."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="rp-form-group">
                    <label className="label-title">아이와 만날 곳</label>
                    <div className="space-box">
                        <div className="space-comment">
                            {latitude && longitude ? `장소 선택 완료` : '장소를 선택해주세요'}
                        </div>
                        <div
                            className="space-side"
                            onClick={() => navigate('/adoptionpost/add/select-location', { state })}
                        >
                            <img src={rightside} alt=">" />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="rp-submit-btn"
                    onClick={() => {
                        // 1) 새 포스트 객체 생성
                        const newPost = {
                            id: Date.now(), // 여기 아이디 자동증가로 ㄱㄱ
                            user_id: '', // 유저 아이디 여기에 들어가게
                            image: photoUrl || fallbackImage, // 이미지
                            title: breed ? `${breed} 분양합니다` : '제목 없음', // 제목
                            description, // 이게 코멘트임
                            breed,  // 픔종
                            birth: birthDate // 태어난 날
                                ? birthDate.toLocaleDateString('ko-KR', {
                                      year: 'numeric',
                                      month: 'numeric',
                                      day: 'numeric',
                                  })
                                : '미정',
                            gender, // 성별
                            petName, // 동물 이름
                            colors, // 색상
                            weight, // 몸무게
                            neutered, // 중성화 여부
                            registrationNo, // 동물 등록 번호
                            location: // 위치
                                latitude != null && longitude != null
                                    ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                                    : '미정',
                            timeAgo: '방금 전', // 여기는 현재 시간 - 글 작성 시간 해서 보여주면됨
                        };

                        // 2) /adoptionpost 로 이동하며 newPost 전송
                        navigate('/adoptionpost', {
                            state: { newPost },
                            replace: true,
                        });
                    }}
                >
                    게시글 작성
                </button>
            </form>
        </div>
    );
}
