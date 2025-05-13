import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../ShelterPostDetail.css';
import placeholder from '../../../assets/1.png';

export default function ShelterPostDetail() {
    const navigate = useNavigate();
    // location.state 에서 post 정보 받아온다고 가정
    const { state } = useLocation();
    const data = state?.animal ?? {
        imageUrl: placeholder,
        shelterName: '금오 보호소',
        breed: '말티즈',
        coatColor: '화이트',
        gender: '암컷',
        neutered: '예',
        features: '2개월.겁이 많아요..그래도 목욕하고 구충제도 먹고 잘 참아줘서 고마워~입양가자!!!(공고중입양가능)',
        shelterPhone: '010-1234-5678',
    };

    const currentUser = state?.currentUser;
    const isAdmin = currentUser?.role === 'admin';
    const handleDelete = () => {
        if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            // TODO: 실제 삭제 API 호출
            // fetch(`/api/posts/${state.animal.id}`, { method: 'DELETE' })
            navigate(-1);
        }
    };

    return (
        <div className="spd-container">
            <header className="spd-header">
                <IoIosArrowBack size={24} className="spd-back" onClick={() => navigate(-1)} />
                <h1 className="spd-title">상세 정보</h1>
                {isAdmin || ( /* 나중에 &&기호로 수정 ㄱㄱ */
                    <button className="spd-delete-btn" onClick={handleDelete}>
                        삭제
                    </button>
                )}
            </header>

            <div className="spd-body">
                <div className="spd-image-wrap">
                    <img
                        src={data.imageUrl}
                        alt={data.breed}
                        className="spd-image"
                        onError={(e) => {
                            e.currentTarget.src = placeholder;
                        }}
                    />
                </div>

                <div className="spd-info-card">
                    <div className="spd-info-row">
                        <span className="spd-info-label">보호소 이름</span>
                        <span className="spd-info-value">{data.shelterName}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">품종</span>
                        <span className="spd-info-value">{data.breed}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">색상</span>
                        <span className="spd-info-value">{data.coatColor}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">성별</span>
                        <span className="spd-info-value">{data.gender}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">중성화 여부</span>
                        <span className="spd-info-value">{data.neutered}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">특징</span>
                        <span className="spd-info-value">{data.features}</span>
                    </div>
                    <div className="spd-info-row">
                        <span className="spd-info-label">보호소 번호</span>
                        <span className="spd-info-value">{data.shelterPhone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
