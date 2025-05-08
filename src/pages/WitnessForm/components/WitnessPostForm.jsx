import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { AiOutlineCamera } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../WitnessPostForm.css';
import { format } from 'date-fns';
import axios from 'axios';

export default function WitnessPostForm() {
    const navigate = useNavigate();
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [date, setDate] = useState(null);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [morpheusImagePath, setMorpheusImagePath] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('사진을 첨부해주세요.');
            return;
        }

        if (!date) {
            alert('날짜 및 시간을 입력해주세요.');
            return;
        }

        if (!description) {
            alert('상세설명을 입력해주세요.');
            return;
        }

        try {
            const formData = new FormData();

            const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");

            const witnessData = {
                postType: 'witness',
                witnessDatetime: formattedDate,
                witnessLocation: location?.trim() || '지도가 구현되면 다시 설정할거에요(목격)',
                detailDescription: description,
            };

            formData.append('post', new Blob([JSON.stringify(witnessData)], { type: 'application/json' }));
            formData.append('file', file);

            const res = await axios.post('/api/posts/witness', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            console.log({ location, date, description, file });
            alert('목격 신고를 했습니다.');
            navigate('/main');
        } catch (error) {
            console.error('등록 실패:', error);
            alert('게시글 등록에 실패했습니다.');
        }
    };

    const handleMorpheusImageUpload = () => {
        const userChoice = confirm('사진을 촬영하시겠습니까?');

        const callback = (status, result) => {
            if (status === 'SUCCESS') {
                if (!result.path || result.size < 10000) {
                    alert('유효한 이미지가 아닙니다.');
                    return;
                }

                setMorpheusImagePath(result.fullpath || result.path);
                setPreviewUrl(result.fullpath || result.path);
                console.log('🖼 선택된 이미지 경로:', result.fullpath || result.path);
            } else {
                alert('사진 선택 실패 또는 취소됨');
            }
        };

        if (userChoice) {
            M.media.camera({
                path: '/media',
                mediaType: 'PHOTO',
                saveAlbum: true,
                callback,
            });
        } else {
            M.media.picker({
                mode: 'SINGLE',
                mediaType: 'ALL',
                path: '/media',
                column: 3,
                callback: async (status, result) => {
                    if (status === 'SUCCESS') {
                        const imagePath = result.fullpath || result.path;
                        setMorpheusImagePath(imagePath);
                        setPreviewUrl(imagePath);

                        try {
                            const response = await fetch(imagePath);
                            const blob = await response.blob();
                            const selectedFile = new File([blob], 'witness.jpg', { type: blob.type });
                            setFile(selectedFile);
                            alert('사진 선택 완료');
                            console.log('status: ', status);
                            console.log('result: ', result);
                        } catch (error) {
                            console.error('이미지 미리보기 로딩 실패:', error);
                            alert('사진 미리보기에 실패했습니다.');
                        }
                    } else {
                        alert('사진 선택 실패');
                    }
                },
            });
            console.log('morpheusImagePath:', morpheusImagePath);
            console.log('파일 존재 여부:', !!morpheusImagePath && morpheusImagePath.endsWith('.jpg'));
        }
    };

    return (
        <div className="mpf-container">
            <header className="missing-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <IoIosArrowBack />
                </button>
                <h1>목격게시글 작성</h1>
            </header>

            <form className="mpf-form" onSubmit={handleSubmit}>
                <label>목격된 동물의 사진</label>
                <div className="photo-section">
                    <div className="photo-grid">
                        <label htmlFor="file-upload" className="photo-upload-box">
                            <button type="button" onClick={handleMorpheusImageUpload}>
                                {previewUrl ? (
                                    <AiOutlineCamera
                                        className="camera-icon"
                                        id="camera-icon"
                                        style={{ color: '#f5a623' }}
                                    />
                                ) : (
                                    <AiOutlineCamera
                                        className="camera-icon"
                                        id="camera-icon"
                                        style={{ color: 'lightgray' }}
                                    />
                                )}
                            </button>
                        </label>
                    </div>
                </div>

                <label>목격 장소</label>
                <div className="mpf-input mpf-input--select" onClick={() => setIsLocationPickerOpen(true)}>
                    {location ? location.address : '장소를 선택해주세요'}
                </div>

                <label>목격 일시</label>
                <div className="react-datepicker__input-container" style={{ position: 'relative' }}>
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText="날짜 및 시간을 선택해주세요"
                        className="mpf-input"
                    />
                </div>

                <label>목격 당시 상황</label>
                <textarea
                    className="mpf-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={[
                        '길 잃은 동물을 발견하고 제보해주셔서 진심으로 감사합니다!',
                        '보호자의 품으로 돌아가거나 안전하게 구조되는 데 소중한 정보가 될 수 있습니다.',
                        '아래 내용을 참고하여 보신 내용을 아시는 범위 내에서 최대한 자세히 작성해주세요. (정확하지 않아도 괜찮습니다!)',
                        '',
                        '1. 동물의 종류 및 외모 (아시는 만큼만)',
                        '2. 당시 동물의 상태 및 행동',
                        '3. 동물의 이동 방향 (혹시 보셨다면)',
                        '4. 제보자 연락처 (선택 사항):',
                    ].join('\n')}
                />

                <button type="submit" className="mpf-submit">
                    게시글 작성
                </button>
            </form>

            {isLocationPickerOpen && (
                <LocationPicker
                    isOpen={true}
                    onClose={() => setIsLocationPickerOpen(false)}
                    onSelect={(loc) => {
                        setLocation(loc);
                        setIsLocationPickerOpen(false);
                    }}
                />
            )}
        </div>
    );
}
