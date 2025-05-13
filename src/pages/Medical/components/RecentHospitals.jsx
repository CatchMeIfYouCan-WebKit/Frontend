// RecentHospitals.jsx
import React from "react";
import hospital1 from "../../../assets/1.png";
import hospital2 from "../../../assets/2.png";
import hospital3 from "../../../assets/3.png";
// RecentHospitals.jsx

const starIcon = "★"; // 2D 스타일의 아이콘으로 교체

const recentHospitals = [
    {
        id: 1,
        name: "금오동물병원",
        image: hospital1,
        rating: "5.0(525)",
        address: "금오공과대학교 정문 gs마트 상가 2층",
    },
    {
        id: 2,
        name: "금오동물병원",
        image: hospital2,
        rating: "5.0(525)",
        address: "금오공과대학교 정문 gs마트 상가 2층",
    },
    {
        id: 3,
        name: "금오동물병원",
        image: hospital3,
        rating: "5.0(525)",
        address: "금오공과대학교 정문 gs마트 상가 2층",
    },
];

const RecentHospitals = () => {
    return (
        <div className="recent-hospitals">
            <h3 className="section-title">최근 본 병원</h3>
            <div className="hospital-list">
                {recentHospitals.map((hospital) => (
                    <div key={hospital.id} className="hospital-item">
                        <img src={hospital.image} alt={hospital.name} className="hospital-image" />
                        <div className="hospital-name">{hospital.name}</div>
                        <div className="hospital-rating">
                            <span className="star-icon">{starIcon}</span> {hospital.rating}
                        </div>
                        <div className="hospital-address">{hospital.address}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentHospitals;
