import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../HospitalDetailPage.css';
import starIcon from '../../../assets/star.svg';
import Footer from '../../../shared/Footer/Footer';
import reservationIcon from '../../../assets/reservationbtn.svg'; // ✅ 추가

const HospitalDetailPage = () => {
    const navigate = useNavigate();

    // ✅ 예약 버튼 클릭 시 수의사 상세 페이지로 이동
    const goToVetDetail = (vetName) => {
        navigate(`/vet/${encodeURIComponent(vetName)}`);
    };

    const hospital = {
        name: '금오동물병원',
        rating: '5.0(525)',
        description:
            '안녕하세요. 금오동물병원 입니다.\n저희 금오동물병원은 반려동물의 건강과 행복을 최우선으로 생각하며, 늘 따뜻한 마음과 전문적인 진료로 최선을 다하고 있습니다. 소중한 가족인 반려동물이 건강하게 생활할 수 있도록 항상 연구하고 노력하며, 친절하고 편안한 환경에서 정성을 다해 돌보겠습니다.',
    };

    const vets = [
        {
            name: '이수완 수의사',
            rating: '5.0(305)',
        },
        {
            name: '이수완 수의사',
            rating: '5.0(305)',
        },
        {
            name: '이수완 수의사',
            rating: '5.0(305)',
        },
    ];

    return (
        <div className="hospital-detail-page">
            <div className="hospital-image-banner" />

            <div className="hospital-info-section">
                <div className="hospital-title">
                    <h2>{hospital.name}</h2>
                    <div className="hospital-rating">
                        <img src={starIcon} alt="별점" />
                        {hospital.rating}
                    </div>
                </div>

                <div className="hospital-description-title">병원정보</div>
                <p className="hospital-description">
                    {hospital.description.split('\n').map((line, idx) => (
                        <span key={idx}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>

                <div className="vet-section-title">수의사 목록</div>

                {vets.map((vet, idx) => (
                    <div key={idx} className="hospital-detail-vet-card">
                        <div className="hospital-detail-vet-info">
                            <div className="hospital-detail-vet-name">{vet.name}</div>
                            <div className="hospital-detail-vet-rating">
                                <img src={starIcon} alt="별점" />
                                {vet.rating}
                            </div>
                            <button className="hospital-detail-reserve-btn" onClick={() => goToVetDetail(vet.name)}>
                                <img src={reservationIcon} alt="예약" />
                            </button>
                        </div>
                        <div className="hospital-detail-vet-image-placeholder" />
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default HospitalDetailPage;
