// src/pages/ShelterDetail.jsx
import React, { useState, useEffect } from 'react';  // useEffect 추가
import '../ShelterDetail.css';
import tag from '../../../assets/tag.svg';
import change from '../../../assets/change.svg';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ShelterDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    // 부모에서 넘겨받은 데이터
    const selectedShelter = location.state?.selectedShelter ?? null;
    const filteredAnimals = location.state?.filteredAnimals ?? [];
    const prevTab = location.state?.currentTab;

    // 필터 선택값
    const initialShelterFilters = location.state?.selectedShelters ?? [];
    const initialBreedFilters = location.state?.selectedBreeds ?? [];
    const initialColorFilters = location.state?.selectedColors ?? [];
    const initialGenderFilters = location.state?.selectedGenders ?? [];

    // 탭, 정렬 상태
    const [activeTab, setActiveTab] = useState(prevTab ?? 'adopted');
    const [listChange, setListChange] = useState(true);

    // 필터 레이블
    const [shelterLabel] = useState(
        initialShelterFilters.length > 0 ? initialShelterFilters.join(', ') : '보호소이름'
    );
    const [breedLabel] = useState(
        initialBreedFilters.length > 0 ? initialBreedFilters.join(', ') : '품종'
    );
    const [colorLabel] = useState(
        initialColorFilters.length > 0 ? initialColorFilters.join(', ') : '털색'
    );
    const [genderLabel] = useState(
        initialGenderFilters.length > 0 ? initialGenderFilters.join(', ') : '성별'
    );

    // 필터 화면으로 이동할 때 selectedShelter만 넘기기
    const onClickFilter = () => {
        navigate('/shelterdetail/filter', {
            state: {
                selectedShelter,
                currentTab: activeTab,
                selectedShelters: initialShelterFilters,
                selectedBreeds: initialBreedFilters,
                selectedColors: initialColorFilters,
                selectedGenders: initialGenderFilters,
            },
        });
    };

    // 렌더링할 동물 리스트: filteredAnimals 있으면 해당 배열, 없으면 selectedShelter 하나만
    const baseList = filteredAnimals.length > 0 
        ? filteredAnimals 
        : (selectedShelter ? [selectedShelter] : []);

    const animals = baseList
        .flatMap(shelter =>
            (shelter.animalSummaries || []).map(animal => ({
                ...animal,
                shelterName: shelter.shelterName,
                imageUrl: (animal.imageUrl?.split(';')[0] || '').trim(),
            }))
        )
        .filter(animal => {
            const matchTab = activeTab === 'adopted'
                ? animal.status === '입양대기'
                : animal.status === '실종';
            const matchGender = initialGenderFilters.length === 0
                || initialGenderFilters.includes(animal.gender);
            return matchTab && matchGender;
        })
        .sort((a, b) => {
            const ta = new Date(a.createdAt).getTime();
            const tb = new Date(b.createdAt).getTime();
            return listChange ? tb - ta : ta - tb;
        });

    // 동물 정보가 없을 때 콘솔에 메시지 출력
    useEffect(() => {
        if (animals.length === 0) {
            console.log('동물 정보가 없습니다.');
        }
    }, [animals]);

    return (
        <div className="shelter-detail">
            <h2 className="title">보호소 동물현황</h2>

            {/* 탭 */}
            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={activeTab === 'adopted' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('adopted')}
                    >
                        새 가족을 기다리는 친구들
                    </button>
                    <button
                        className={activeTab === 'lost' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('lost')}
                    >
                        가족을 찾는 친구들
                    </button>
                </div>
            </div>

            {/* 필터 요약 */}
            <div className="filters">
                <div className={`filter ${shelterLabel !== '보호소이름' ? 'applied' : ''}`}>{shelterLabel}</div>
                <div className={`filter ${colorLabel !== '털색' ? 'applied' : ''}`}>{colorLabel}</div>
                <div className={`filter ${breedLabel !== '품종' ? 'applied' : ''}`}>{breedLabel}</div>
                <div className={`filter ${genderLabel !== '성별' ? 'applied' : ''}`}>{genderLabel}</div>
                <div className="tag-wrap" onClick={onClickFilter}>
                    <img src={tag} alt="태그" className="tag-size" />
                </div>
            </div>

            {/* 게시글 개수 & 정렬 */}
            <div className="list-header">
                <div className="post-count">{animals.length}개의 게시글</div>
                <div
                    className={`sort-toggle ${!listChange ? 'reversed' : ''}`}
                    onClick={() => setListChange(p => !p)}
                >
                    {listChange ? '최근작성순' : '오래된 순'}
                    <img src={change} alt="변경" />
                </div>
            </div>

            {/* 동물 카드 그리드 */}
            <div className="animal-grid">
                
                {animals.map((animal, i) => (
                    <div
                        key={i}
                        className="animal-card"
                        onClick={() => navigate('/animaldetail', {
                            state: { animal, shelterName: animal.shelterName }
                        })}
                    >
                        <img
                            src={animal.imageUrl}
                            alt={animal.breed}
                            className="animal-img"
                        />
                        <div className="animal-details">
                            <div className="shelter-name">보호소: {animal.shelterName}</div>
                            <div className="animal-info">
                                품종: {animal.breed} | 색상: {animal.coatColor} | 성별: {animal.gender}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
