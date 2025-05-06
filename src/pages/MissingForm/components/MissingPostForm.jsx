import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../MissingPostForm.css';

export default function MissingPostForm() {
    const { state } = useLocation();
    const pet = state?.pet;
    const navigate = useNavigate();

    // pet 정보가 없다면 뒤로
    if (!pet) {
        navigate(-1);
        return null;
    }

    const [missingDate, setMissingDate] = useState('');
    const [missingPlace, setMissingPlace] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: API 호출 등
        // navigate('/missingpostDetail', { state: { /* ... */ } });
        console.log({ pet, missingDate, missingPlace, description });
    };

    return (
        <div className="mpf-container">
            <header className="mpf-header">
                <button className="mpf-back" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h1>실종게시글 작성</h1>
            </header>

            <div className="mpf-pet-row">
                <img src={pet.img} alt={pet.name} className="mpf-pet-img" />
                <span className="mpf-pet-name">{pet.name}</span>
            </div>

            <form className="mpf-form" onSubmit={handleSubmit}>
                <label>강아지를 언제 잃어버리셨나요?</label>
                <input type="date" value={missingDate} onChange={(e) => setMissingDate(e.target.value)} required />

                <label>강아지를 어디서 잃어버리셨나요?</label>
                <input
                    type="text"
                    placeholder="장소를 입력해주세요"
                    value={missingPlace}
                    onChange={(e) => setMissingPlace(e.target.value)}
                    required
                />

                <label>자세한 정보를 작성해주세요</label>
                <textarea
                    placeholder="예: 사람을 잘 따른다…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <button type="submit" className="mpf-submit">
                    게시글 작성
                </button>
            </form>
        </div>
    );
}
