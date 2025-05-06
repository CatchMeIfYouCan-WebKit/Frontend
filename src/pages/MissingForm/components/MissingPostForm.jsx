import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../MissingPostForm.css';
import checkOn from '../../../assets/checkOn.svg';
import checkOff from '../../../assets/checkOff.svg';
import LocationPicker from './LocationPicker';

export default function MissingPostForm() {
    const navigate = useNavigate();
    const pet = useLocation().state?.pet;

    const [whenDate, setWhenDate] = useState(null);
    const [where, setWhere] = useState('');
    const [desc, setDesc] = useState('');
    const [isLocOpen, setIsLocOpen] = useState(false);

    return (
        <>
            {/* 헤더 */}
            <header className="missing-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <IoIosArrowBack />
                </button>
                <h1>실종게시글 작성</h1>
            </header>

            <div className="mpf-container">
                {/* 선택된 반려동물 */}
                {pet && (
                    <div className="mpf-pet-row">
                        <img src={pet.img} alt={pet.name} className="mpf-pet-img" />
                        <span className="mpf-pet-name">{pet.name}</span>
                        {/* 확인된 프로필 아이콘 (always on) */}
                        <img src={checkOn} alt="verified" className="mpf-pet-check" />
                    </div>
                )}

                <form className="mpf-form" onSubmit={(e) => e.preventDefault()}>
                    {/* 1. 날짜 선택 */}
                    <label>강아지를 언제 잃어버리셨나요?</label>
                    <DatePicker
                        selected={whenDate}
                        onChange={setWhenDate}
                        placeholderText="실종일을 선택해주세요"
                        dateFormat="yyyy년 MM월 dd일"
                        className="mpf-input"
                    />

                    {/* 2. 장소 선택 (모달) */}
                    <label>강아지를 어디서 잃어버리셨나요?</label>
                    <div className="mpf-input mpf-input--select" onClick={() => setIsLocOpen(true)}>
                        {where || '장소를 선택해주세요'}
                    </div>

                    {/* 3. 상세 정보 */}
                    <label>자세한 정보를 작성해주세요</label>
                    <textarea
                        placeholder={`사람을 잘 따르나요, 아니면 경계하나요?
(예: 사람을 보면 반갑게 다가감 / 낯선 사람을 보면 숨거나 도망감)

이름을 부르면 반응하나요?

겁을 먹거나 특정 상황일 때 어떻게 행동하나요?
(예: 큰 소리에 잘 놀라 숨음 / 차 소리를 무서워함)

다가가도 괜찮을까요, 아니면 주의해야 할까요?
(예: 겁이 많으니 절대 무리해서 잡으려 하지 마세요.)

평소 좋아하는 간식이나 장난감이 있나요?`}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />

                    <button
                        type="button"
                        className="mpf-submit"
                        onClick={() => {
                            console.log({ pet, whenDate, where, desc });
                            // TODO: 서버 전송
                        }}
                    >
                        게시글 작성
                    </button>
                </form>
            </div>

            <LocationPicker
                isOpen={isLocOpen}
                onClose={() => setIsLocOpen(false)}
                onSelect={(addr) => setWhere(addr)}
            />
        </>
    );
}
