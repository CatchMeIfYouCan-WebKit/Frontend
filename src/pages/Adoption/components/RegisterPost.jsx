// src/pages/RegisterPost.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../RegisterPost.css'; // 적절히 경로 수정
import rightside from '../../../assets/rightside.svg';
import fallbackImage from '../../../assets/testdog.png'; // ← add this
import axios from 'axios';

export default function RegisterPost() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const post = state?.post || {};

    useEffect(() => {
    }, [post]);
    useEffect(() => {
        console.log('📦 RegisterPost로 되돌아왔을 때 post:', post);
    }, [post]);
    const {
        userId,
        petName,
        breed,
        colors,
        gender,
        neutered,
        birth,
        weight,
        registrationNo,
        isVerified,
        images = [],
        latitude,
        longitude,
        comments = '',       // ✅ description 역할
        title = '',          // ✅ 제목 필드
        petId = null,        // ✅ 필요 시 저장
        adopt_location = '', // ✅ 위치 텍스트
        status = '분양중',   // ✅ 분양 상태
    } = post;


    const [description, setDescription] = useState(comments);
    const [postTitle, setPostTitle] = useState(title || (breed ? `${breed} 분양합니다` : ''));


    return (
        <div className="register-post">
            <header className="rp-header">
                <button className="rp-back" onClick={() => navigate(-1)}>
                    <IoIosArrowBack size={32} />
                </button>
                <h1 className="rp-title">게시글 작성</h1>
            </header>

            <section className="rp-pet-info">
                {images?.[0] ? (
                    <img src={images[0].url} alt={petName} className="rp-pet-avatar" />
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
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)} // ✅ 타이핑할 때마다 저장
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
                            onClick={() =>
                                navigate('/adoptionpost/add/select-location', {
                                    state: {
                                        post: {
                                            ...post,
                                            title: postTitle,
                                            comments: description, // ✅ description을 post.comments로 덮어쓰기
                                        },
                                    },
                                })
                            }
                        >
                            <img src={rightside} alt=">" />
                        </div>

                    </div>
                </div>

                <button
                    type="button"
                    className="rp-submit-btn"
                    onClick={async () => {
                        const adoptData = {
                            userId,
                            petId,
                            name: petName,
                            breed,
                            coatColor: colors.join('+'),
                            gender,
                            isNeutered: neutered,
                            dateOfBirth: birth,
                            weight: isNaN(parseFloat(weight)) ? null : parseFloat(weight),
                            registrationNumber: registrationNo,
                            title: postTitle,
                            vetVerified: isVerified,
                            comments: description,
                            adoptLocation: adopt_location,
                            latitude,
                            longitude,
                            status,
                            photoPath: images
                                .map(img => {
                                    const url = img.url;
                                    const base = 'http://localhost:8080';
                                    return url.startsWith(base) ? url.replace(base, '') : url;
                                })
                                .join(','),
                        };

                        try {
                            await axios.post('http://10.0.2.2:8080/api/adopt', adoptData, {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            navigate('/adoptionpost');
                        } catch (error) {
                            const message =
                              error.response?.data?.message || error.response?.data || error.message || '알 수 없는 오류';
                            console.error('❌ 입양 등록 실패:', message); // 혹시 콘솔 되면 확인
                            alert('입양 등록 실패\n\n' + JSON.stringify(error.response?.data || error));

                          }
                          
                    }}
                >
                    게시글 작성
                </button>


            </form>
        </div>
    );
}
