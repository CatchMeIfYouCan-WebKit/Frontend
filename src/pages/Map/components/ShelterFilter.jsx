import React, { useState } from 'react';
import '../ShelterFilter.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { TiDelete } from 'react-icons/ti';

const sheltersMock = [
    { id: 1, name: '금오공대동물보호소' },
    // 실제는 백엔드 데이터로 교체
];

const breedsMock = [
    { id: 1, ko: '말티즈', en: 'Maltese' },
    { id: 2, ko: '푸들', en: 'Poodle' },
    { id: 3, ko: '비숑', en: 'Bichon à poil frisé' },
    // 실제는 백엔드 데이터로 교체
];

const colors = [
    { id: 'black', label: '블랙', hex: '#000000' },
    { id: 'white', label: '화이트', hex: '#ffffff' },
    { id: 'gray', label: '그레이', hex: '#808080' },
    { id: 'brown', label: '브라운', hex: '#A52A2A' },
    { id: 'lemon', label: '레몬', hex: '#FFF9C4' },
    { id: 'gold', label: '골든', hex: '#D29113' },
];

export default function ShelterFilter() {
    // 이전: 하나짜리 openSection
    // const [openSection, setOpenSection] = useState('shelter');
    // ↓ 수정: 섹션별로 boolean
    const [openShelter, setOpenShelter] = useState(true);
    const [openAge, setOpenAge] = useState(true);
    const [openBreed, setOpenBreed] = useState(true);
    const [openColor, setOpenColor] = useState(true);

    const [shelterQuery, setShelterQuery] = useState('');
    const [breedQuery, setBreedQuery] = useState('');

    const [selectedShelters, setSelectedShelters] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');

    const onShelterSearch = () => console.log('search shelter:', shelterQuery);
    const onBreedSearch = () => console.log('search breed:', breedQuery);

    const toggleItem = (id, list, setter) =>
        list.includes(id) ? setter(list.filter((x) => x !== id)) : setter([...list, id]);

    return (
        <div className="shelter-filter">
            <div className="sf-header">
                <h3>필터링</h3>x
            </div>
            <hr />

            {/* 보호소 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenShelter((open) => !open)}>
                    <span>보호소</span>
                    {openShelter ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {openShelter && (
                    <div className="sf-sec-body">
                        <div className="sf-search-row">
                            <input
                                type="text"
                                placeholder="보호소 검색"
                                value={shelterQuery}
                                onChange={(e) => setShelterQuery(e.target.value)}
                            />
                            <button onClick={onShelterSearch}>검색</button>
                        </div>
                        <ul className="sf-item-list">
                            {sheltersMock.map((s) => (
                                <li key={s.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedShelters.includes(s.id)}
                                            onChange={() => toggleItem(s.id, selectedShelters, setSelectedShelters)}
                                        />
                                        {s.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <hr />
            {/* 나이 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenAge((o) => !o)}>
                    <span>나이</span>
                    {openAge ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {openAge && (
                    <div className="sf-sec-body sf-age-body">
                        <div className="sf-age-row">
                            <input
                                type="number"
                                placeholder="나이"
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>
                )}
            </div>
            <hr />

            {/* 강아지 품종 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenBreed((open) => !open)}>
                    <span>강아지 품종</span>
                    {openBreed ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {openBreed && (
                    <div className="sf-sec-body">
                        <div className="sf-search-row">
                            <input
                                type="text"
                                placeholder="강아지 품종 검색"
                                value={breedQuery}
                                onChange={(e) => setBreedQuery(e.target.value)}
                            />
                            <button onClick={onBreedSearch}>검색</button>
                        </div>
                        <ul className="sf-item-list">
                            {breedsMock.map((b) => (
                                <li key={b.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedBreeds.includes(b.id)}
                                            onChange={() => toggleItem(b.id, selectedBreeds, setSelectedBreeds)}
                                        />
                                        <span className="ko">{b.ko}</span>
                                        <span className="en" style={{ color: '#d29113' }}>
                                            {b.en}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <hr />

            {/* 털색 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenColor((open) => !open)}>
                    <span>털색</span>
                    {openColor ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {openColor && (
                    <div className="sf-sec-body">
                        <ul className="sf-color-list">
                            {colors.map((c) => (
                                <li key={c.id} className="sf-color-item">
                                    <button
                                        className={`circle ${selectedColors.includes(c.id) ? 'selected' : ''}`}
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => toggleItem(c.id, selectedColors, setSelectedColors)}
                                    />
                                    <span>{c.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
