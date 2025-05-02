import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineCamera } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import '../animalProfile.css';

export default function AnimalProfile() {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <div className="animal-profile">
            {/* Header */}
            <header className="animal-profile-header">
                <button className="back-button" onClick={goBack}>
                    <IoIosArrowBack />
                </button>
                <h1>강아지 프로필 등록</h1>
            </header>

            {/* Content */}
            <div className="animal-profile-content">
                {/* 프로필 사진 */}
                <div className="form-group photo-group">
                    <label>프로필 사진</label>
                    <div className="photo-upload">
                        <AiOutlineCamera className="camera-icon" />
                    </div>
                </div>

                {/* 반려동물 이름 */}
                <div className="form-group">
                    <label>
                        반려동물 이름 <span className="required">*</span>
                    </label>
                    <input type="text" placeholder="반려동물 이름 입력" />
                </div>

                {/* 강아지 품종 */}
                <div className="form-group">
                    <label>
                        강아지 품종 <span className="required">*</span>
                    </label>
                    <select>
                        <option>품종을 선택해주세요</option>
                    </select>
                </div>

                {/* 털색 */}
                <div className="form-group color-group">
                    <label>
                        털색 <span className="required">*</span>
                    </label>
                    <div className="color-options">
                        <div className="color-option">
                            <div className="color-circle black"></div>
                            <span>검은색</span>
                        </div>
                        <div className="color-option">
                            <div className="color-circle white"></div>
                            <span>하얀색</span>
                        </div>
                        <div className="color-option">
                            <div className="color-circle gray"></div>
                            <span>회색</span>
                        </div>
                        <div className="color-option">
                            <div className="color-circle brown"></div>
                            <span>브라운</span>
                        </div>
                        <div className="color-option">
                            <div className="color-circle red"></div>
                            <span>붉은색</span>
                        </div>
                        <div className="color-option">
                            <div className="color-circle gold"></div>
                            <span>골드</span>
                        </div>
                    </div>
                </div>

                {/* 성별 */}
                <div className="form-group gender-group">
                    <label>
                        성별 <span className="required">*</span>
                    </label>
                    <div className="gender-options">
                        <button type="button" className="gender-button">
                            남아
                        </button>
                        <button type="button" className="gender-button">
                            여아
                        </button>
                    </div>
                    <div className="neuter">
                        <input type="checkbox" id="neutered" />
                        <label htmlFor="neutered">중성화 했어요</label>
                    </div>
                </div>

                {/* 생일 */}
                <div className="form-group">
                    <label>
                        생일 <span className="required">*</span>
                    </label>
                    <select>
                        <option>생년월일을 선택해주세요</option>
                    </select>
                </div>

                {/* 몸무게 */}
                <div className="form-group">
                    <label>
                        몸무게 <span className="required">*</span>
                    </label>
                    <input type="number" placeholder="몸무게를 입력해주세요" />
                </div>

                {/* 동물등록번호 */}
                <div className="form-group">
                    <label>
                        동물등록번호 <span className="required">*</span>
                    </label>
                    <input type="text" placeholder="동물등록번호 입력" />
                </div>
            </div>

            {/* 등록 버튼 */}
            <button className="submit-button">프로필 등록</button>
        </div>
    );
}
