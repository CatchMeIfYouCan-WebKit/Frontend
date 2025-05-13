import React from 'react';
import '../NearbyHospitalPage.css';
import Footer from '../../../shared/Footer/Footer';
import Header from './Header';
import hospital1 from '../../../assets/민규강아지.jpeg';
import hospital2 from '../../../assets/2.png';
import hospital3 from '../../../assets/3.png';
import starIcon from '../../../assets/star.svg';
import { useNavigate } from 'react-router-dom';

const hospitals = [
    {
        id: 1,
        name: '금오동물병원',
        rating: '5.0(525)',
        address: '금오공과대학교 정문 gs마트 상가 2층',
        images: [hospital1, hospital2, hospital3],
    },
    {
        id: 2,
        name: '24시동물메디컬센터',
        rating: '4.9(321)',
        address: '구미시 봉곡동 123-4',
        images: [hospital2, hospital3],
    },
    {
        id: 3,
        name: '펫케어동물병원',
        rating: '4.7(211)',
        address: '인동 현대아파트 맞은편',
        images: [hospital3, hospital1],
    },
    {
        id: 4,
        name: '참좋은동물병원',
        rating: '4.8(410)',
        address: '구미역 앞 200m 거리',
        images: [hospital1, hospital2],
    },
];

const filters = ['전체', '여성 추천순', '매장정보', '가격대', '3KM'];

const NearbyHospitalPage = () => {
    const navigate = useNavigate();

    return (
        <div className="nearby-page">
            <Header />

            <main className="nearby-main-content">
                <div className="filter-bar">
                    {filters.map((filter, index) => (
                        <div key={index} className="filter-chip">
                            {filter}
                            <span className="dropdown-icon">▼</span>
                        </div>
                    ))}
                </div>

                <div className="popular-hospitals">
                    <div className="popular-hospital-list">
                        {hospitals.map((hospital) => (
                            <div
                                key={hospital.id}
                                className="popular-hospital-item"
                                onClick={() => navigate(`/hospital/${hospital.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="popular-hospital-slider">
                                    <div className="popular-image-track">
                                        {hospital.images.slice(0, 3).map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={idx === 0 ? 'main-image-wrapper' : 'image-preview-wrapper'}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`이미지 ${idx + 1}`}
                                                    className={`slider-image ${idx === 0 ? 'main' : 'preview'}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="popular-hospital-info">
                                    <div className="popular-hospital-name">{hospital.name}</div>
                                    <div className="popular-hospital-rating">
                                        <img src={starIcon} alt="별점" className="star-icon" />
                                        {hospital.rating}
                                    </div>
                                    <div className="popular-hospital-address">{hospital.address}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NearbyHospitalPage;
