import React from "react";
import hospital1 from "../../../assets/민규강아지.jpeg";
import hospital2 from "../../../assets/2.png";
import starIcon from "../../../assets/star.svg";

const hospitals = [
    {
        id: 1,
        name: "금오동물병원",
        rating: "5.0(525)",
        address: "금오공과대학교 정문 gs마트 상가 2층",
        images: [hospital1, hospital2],
    },
    {
        id: 2,
        name: "금오동물병원",
        rating: "5.0(525)",
        address: "금오공과대학교 정문 gs마트 상가 2층",
        images: [hospital1, hospital2],
    },
];

const PopularHospitals = () => {
    return (
        <div className="popular-hospitals">
            <div className="popular-section-title">인기 동물병원</div>
            <div className="popular-hospital-list">
                {hospitals.map((hospital, index) => (
                    <div key={hospital.id} className="popular-hospital-item">
                        <div className="popular-hospital-slider">
                            <div className="popular-image-track">
                                <div className="main-image-wrapper">
                                    <img src={hospital.images[0]} alt="주 이미지" className="slider-image main" />
                                </div>
                                <div className="image-preview-wrapper">
                                    <img src={hospital.images[1]} alt="미리보기" className="slider-image preview" />
                                </div>
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
    );
};

export default PopularHospitals;
