import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MissingPostBottomSheet.css';

export default function MissingPostBottomSheet({ isOpen, onClose, pets }) {
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNext = () => {
        const pet = pets.find((p) => p.id === selectedId);
        navigate('/report-missing', { state: { pet } });
        onClose();
    };

    // 사진 불러오기
    const getImageUrl = (path) => {
        if (!path) return '/default-image.png';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    return (
        <div className="mbs-overlay" onClick={onClose}>
            <div className="mbs-container" onClick={(e) => e.stopPropagation()}>
                <div className="mbs-header">
                    <h2>실종된 반려동물 선택</h2>
                    <button className="mbs-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="mbs-list">
                    {pets.map((pet) => (
                        <label key={pet.id} className="mbs-item">
                            <input
                                type="radio"
                                name="pet"
                                value={pet.id}
                                checked={selectedId === pet.id}
                                onChange={() => setSelectedId(pet.id)}
                            />
                            <img src={getImageUrl(pet.photoPath)} alt={pet.name} className="mbs-pet-img" />
                            <div className="mbs-info">
                                <div className="mbs-name">{pet.name}</div>
                                <div className="mbs-details">
                                    {pet.breed} · {pet.age}살
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
                <button className="mbs-next" disabled={selectedId === null} onClick={handleNext}>
                    다음
                </button>
            </div>
        </div>
    );
}
