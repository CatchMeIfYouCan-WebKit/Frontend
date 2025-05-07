import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { AiOutlineCamera } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LocationPicker from '../../MissingForm/components/LocationPicker';
import '../WitnessPostForm.css';

export default function WitnessPostForm() {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 4); // 최대 4장
        setFiles(selectedFiles);
        const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('location', JSON.stringify(location));
        formData.append('date', date?.toISOString() || '');
        formData.append('description', description);
        files.forEach((file, index) => {
            formData.append('images', file); // 백엔드가 배열 형태로 받는다면 'images[]'로 바꿔도 됩니다
        });

        console.log({ location, date, description, files });
        // axios.post('/api/witness', formData) 등으로 전송 가능
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
                            <AiOutlineCamera size={32} />
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        {previews.map((url, index) => (
                            <img key={index} src={url} alt={`preview-${index}`} className="photo-preview" />
                        ))}
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
