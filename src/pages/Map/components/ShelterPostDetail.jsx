import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../ShelterPostDetail.css';
import placeholder from '../../../assets/1.png';

export default function ShelterPostDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    const shelter = location.state?.shelter;
    console.log('넘어온 데이터:', shelter);

    return (
        <div className="spd-container">
            <header className="spd-header">
                <IoIosArrowBack size={24} className="spd-back" onClick={() => navigate(-1)} />
                <h1 className="spd-title">상세 정보</h1>
            </header>

            <div className="spd-body">
                <div className="spd-image-wrap">
                    <img
                        src={shelter.imageUrl}
                        alt={shelter.breed}
                        className="spd-image"
                        onError={(e) => {
                            e.currentTarget.src = placeholder;
                        }}
                    />
                </div>

                <div className="spd-info-card">
                    <div className="spd-info-row">
                        <span className="spd-info-label">보호소 이름</span>
                        <span className="spd-info-value">{shelter.shelterName}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">품종</span>
                        <span className="spd-info-value">{shelter.breed}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">색상</span>
                        <span className="spd-info-value">{shelter.coatColor}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">성별</span>
                        <span className="spd-info-value">{shelter.gender}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">중성화 여부</span>
                        <span className="spd-info-value">{shelter.neutered}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">특징</span>
                        <span className="spd-info-value">{shelter.characteristics}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">보호소 위치</span>
                        <span className="spd-info-value">{shelter.address}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">전화번호</span>
                        <span className="spd-info-value">{shelter.phone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
