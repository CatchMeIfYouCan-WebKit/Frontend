import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import verifion from '../../../assets/verifion.svg';
import rightside from '../../../assets/rightside.svg'; // 오른쪽 아이콘
import '../MissingPostForm.css';

export default function MissingPostForm() {
    const navigate = useNavigate();
    const locationState = useLocation();
    const pet = locationState.state?.pet;

    const [date, setDate] = useState(null);
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState(null);

    // 선택된 위치 좌표 수신
    useEffect(() => {
        const state = locationState.state;
        if (state?.latitude && state?.longitude) {
            setLatitude(state.latitude);
            setLongitude(state.longitude);
            setLocation(`${state.latitude}, ${state.longitude}`);
        }
    }, [locationState]);

    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    const handleSubmit = async () => {
        if (!date || !desc) {
            alert('날짜와 상세설명은 필수입니다.');
            return;
        }

        const locationString = location || '지도가 구현되면 다시 설정할거에요';
        const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");

        try {
            const formData = new FormData();
            const missingData = {
                petId: pet.id,
                postType: 'missing',
                missingDatetime: formattedDate,
                missingLocation: locationString,
                detailDescription: desc,
                latitude,
                longitude,
            };

            if (!file && pet?.photoPath) {
                missingData.photoUrl = pet.photoPath;
            }

            formData.append('post', new Blob([JSON.stringify(missingData)], { type: 'application/json' }));
            formData.append('file', file);

            await axios.post('/api/posts/missing', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('실종 신고를 했습니다.');
            navigate('/main');
        } catch (err) {
            console.error(err);
            alert('등록에 실패했습니다.');
        }
    };

    return (
        <>
            <header className="missing-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <IoIosArrowBack />
                </button>
                <h1>실종게시글 작성</h1>
            </header>

            <div className="mpf-container">
                {pet && (
                    <div className="mpf-pet-row">
                        <img src={getImageUrl(pet.photoPath)} alt={pet.name} className="mpf-pet-img" />
                        <span className="mpf-pet-name">{pet.name}</span>
                        <img src={verifion} alt="verified" className="mpf-pet-check" />
                    </div>
                )}

                <form className="mpf-form" onSubmit={(e) => e.preventDefault()}>
                    {/* 날짜 선택 */}
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

                    {/* 장소 선택 */}
                    <div className="mpf-form">
                        <label>강아지를 어디서 잃어버리셨나요?</label>
                        <div className="space-box">
                            <div className="space-comment">
                                {latitude && longitude ? '장소 선택 완료' : '장소를 선택해주세요'}
                            </div>
                            <div
                                className="space-side"
                                onClick={() =>
                                    navigate('/report-missing/select-location', {
                                        state: {
                                            pet,
                                            date,
                                            desc,
                                            latitude,
                                            longitude,
                                        },
                                    })
                                }
                            >
                                <img src={rightside} alt=">" />
                            </div>
                        </div>
                    </div>

                    {/* 상세 설명 */}
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

                    <button type="button" className="mpf-submit" onClick={handleSubmit}>
                        게시글 작성
                    </button>
                </form>
            </div>
        </>
    );
}
