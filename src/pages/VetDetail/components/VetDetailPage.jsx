// src/pages/VetDetailPage/VetDetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import starIcon from '../../../assets/star.svg';
import buttonImage from '../../../assets/button.svg';
import '../VetDetailPage.css';

const VetDetailPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const vet = {
        name: decodeURIComponent(name),
        hospital: '금오동물병원',
        rating: '5.0',
        reviews: 284,
        experience: ['OO대학교 부속 동물병원 인턴/레지던트 수료', 'OO동물메디컬 센터 근무'],
        intro: `금오동물병원의 ${decodeURIComponent(name)}입니다.\n반려동물의 건강을 최우선으로 생각합니다.`,
        specialty: `내과, 외과, 피부과, 정형외과 진료`,
        ratings: {
            5: 279,
            4: 3,
            3: 0,
            2: 1,
            1: 1,
        },
        latestReview: {
            user: '이수완',
            date: '2025.05.06',
            content: '친절하게 알려주시고 진료 잘해주셨어요!',
        },
    };

    return (
        <div className="vet-detail-page">
            <div className="vet-detail-header-section">
                <div className="vet-detail-image-placeholder" />
                <div className="vet-detail-header-info">
                    <div className="vet-detail-hospital-name">{vet.hospital}</div>
                    <div className="vet-detail-name">{vet.name}</div>
                    <div className="vet-detail-rating">
                        <img src={starIcon} alt="별" />
                        {vet.rating} | {vet.reviews}개 후기
                    </div>
                </div>
            </div>

            <div className="vet-detail-section">
                <h4>수의사 정보</h4>
                <div className="vet-detail-tag">수의사 자격증 보유</div>
            </div>

            <div className="vet-detail-section">
                <h4>경력</h4>
                {vet.experience.map((exp, idx) => (
                    <p key={idx}>{exp}</p>
                ))}
            </div>

            <div className="vet-detail-section">
                <h4>의사 소개</h4>
                <p>{vet.intro}</p>
            </div>

            <div className="vet-detail-section">
                <h4>진료 분야</h4>
                <p>{vet.specialty}</p>
            </div>

            <div className="vet-detail-section">
                <h4>
                    진료 후기 <span className="review-count">{vet.reviews}</span>
                </h4>
                <div className="vet-detail-rating-bar-summary">
                    <img src={starIcon} alt="별" />
                    {vet.rating}
                </div>
                <ul className="vet-detail-rating-bars">
                    {Object.entries(vet.ratings)
                        .sort((a, b) => b[0] - a[0])
                        .map(([score, count]) => (
                            <li key={score}>
                                <span>{score}점</span>
                                <div className="bar">
                                    <div
                                        className="filled"
                                        style={{
                                            width: `${(count / vet.reviews) * 100}%`,
                                        }}
                                    />
                                </div>
                                <span>{count}</span>
                            </li>
                        ))}
                </ul>
            </div>

            <div className="vet-detail-section vet-detail-review-box">
                <div className="review-header">
                    <span>{vet.latestReview.user}</span>
                    <span>{vet.latestReview.date}</span>
                </div>
                <div className="stars">★★★★★</div>
                <p>{vet.latestReview.content}</p>
            </div>

            {/* ✅ 고정 버튼 */}
            <div className="vet-detail-fixed-button-wrapper">
                <button className="vet-detail-fixed-button" onClick={() => navigate('/reservation')}>
                    진료신청
                </button>
            </div>
        </div>
    );
};

export default VetDetailPage;
