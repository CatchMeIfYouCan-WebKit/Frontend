import axios from 'axios';
import { format } from 'date-fns';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoIosArrowBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import verifion from '../../../assets/verifion.svg';
import '../MissingPostForm.css';
import LocationPicker from './LocationPicker';

export default function MissingPostForm() {
    const navigate = useNavigate();
    const pet = useLocation().state?.pet;

    const [date, setDate] = useState(null);
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [isLocOpen, setIsLocOpen] = useState(false);
    const [file, setFile] = useState(null);

    // 사진 불러오기
    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    // 실종게시글 등록하기
    const handleSubmit = async () => {
        if (!date || !desc) {
            alert('날짜와 상세설명은 필수입니다.');
            return;
        }

        // TODO: 지도 구현 완료 시 마커를 주소로 변환하여 주소 설정
        try {
            const formData = new FormData();
            const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");

            const missingData = {
                petId: pet.id,
                postType: 'missing',
                missingDatetime: formattedDate,
                missingLocation: location?.trim() || '지도가 구현되면 다시 설정할거에요(실종)',
                detailDescription: desc,
            };

            if (!file && pet?.photoPath) {
                missingData.photoUrl = pet.photoPath;
            }

            formData.append('post', new Blob([JSON.stringify(missingData)], { type: 'application/json' }));
            formData.append('file', file);

            const res = await axios.post('/api/posts/missing', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('실종 신고를 했습니다.');
            navigate('/main'); // 혹은 메인 페이지로 이동
        } catch (err) {
            console.error(err);
            alert('등록에 실패했습니다.');
        }
    };

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
                        <img src={getImageUrl(pet.photoPath)} alt={pet.name} className="mpf-pet-img" />
                        <span className="mpf-pet-name">{pet.name}</span>
                        {/* 확인된 프로필 아이콘 (always on) */}
                        <img src={verifion} alt="verified" className="mpf-pet-check" />
                    </div>
                )}

                <form className="mpf-form" onSubmit={(e) => e.preventDefault()}>
                    {/* 1. 날짜 선택 */}
                    <label>강아지를 언제 잃어버리셨나요?</label>
                    <DatePicker
                        selected={date}
                        onChange={setDate}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        placeholderText="실종일을 선택해주세요"
                        dateFormat="yyyy년 MM월 dd일 HH:mm"
                        className="mpf-input"
                    />

                    {/* 2. 장소 선택 (모달) */}
                    <label>강아지를 어디서 잃어버리셨나요?</label>
                    <div className="mpf-input mpf-input--select" onClick={() => setIsLocOpen(true)}>
                        {location || '장소를 선택해주세요'}
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
                            console.log({ pet, date, location, desc });
                            handleSubmit();
                        }}
                    >
                        게시글 작성
                    </button>
                </form>
            </div>

            <LocationPicker
                isOpen={isLocOpen}
                onClose={() => setIsLocOpen(false)}
                onSelect={(addr) => setLocation(addr)}
            />
        </>
    );
}
