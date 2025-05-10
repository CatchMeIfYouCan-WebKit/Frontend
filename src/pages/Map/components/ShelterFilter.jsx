import React, { useState, useEffect } from 'react';
import '../ShelterFilter.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';

const breedsMock = [
    { id: 1, ko: '말티즈', en: 'Maltese' },
    { id: 2, ko: '푸들', en: 'Poodle' },
    { id: 3, ko: '비숑', en: 'Bichon à poil frisé' },
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

    const navigate = useNavigate();
    const location = useLocation();
    const shelters = location.state?.shelters ?? [];

    const [originalShelters] = useState(shelters);
    const [filteredShelterList, setFilteredShelterList] = useState(originalShelters);

    useEffect(() => {
        if (shelterQuery.trim()) {
            setFilteredShelterList(
                originalShelters.filter((s) =>
                    s.shelterName.includes(shelterQuery.trim())
                )
            );
        } else {
            setFilteredShelterList([]); // 검색창 비우면 리스트 감춤
        }
    }, [shelterQuery, originalShelters]);

    const toggleItem = (item, list, setter) =>
        list.includes(item)
            ? setter(list.filter((x) => x !== item))
            : setter([...list, item]);



    const onApplyFilter = () => {
        const filtered = [];

        originalShelters.forEach((shelter) => {
            // 보호소 필터 조건 검사
            if (
                selectedShelters.length > 0 &&
                !selectedShelters.includes(shelter.shelterName)
            ) return;

            const matchedAnimals = shelter.animalSummaries?.filter((animal) => {
                // 품종 필터
                const matchBreed =
                    selectedBreeds.length === 0 || selectedBreeds.includes(animal.breed);

                // 털색 필터
                const matchColor =
                    selectedColors.length === 0 ||
                    selectedColors.some((colorId) =>
                        animal.coatColor?.includes(
                            colors.find((c) => c.id === colorId)?.label
                        )
                    );

                // 나이 필터 (출생년도 기반)
                const currentYear = new Date().getFullYear();
                const matchAge =
                    !minAge ||
                    (() => {
                        const birthYearMatch = animal.ageWeight?.match(/(\d{4})\(년생\)/);
                        if (birthYearMatch) {
                            const birthYear = parseInt(birthYearMatch[1], 10);
                            const calculatedAge = currentYear - birthYear;
                            return calculatedAge >= Number(minAge);
                        }
                        return false;
                    })();

                return matchBreed && matchColor && matchAge;
            });

            if (matchedAnimals && matchedAnimals.length > 0) {
                filtered.push({ ...shelter, animalSummaries: matchedAnimals });
            }
        });

        console.log("✅ 필터 결과:", filtered);
        navigate('/shelterdetail', {
            state: {
                shelters: originalShelters,
                selectedShelter: null,
                filteredAnimals: filtered,
            },
        });
    };



    return (
        <div className="shelter-filter">
            <div className="sf-header">
                <h3 style={{ display: 'inline-block' }}>필터링</h3>
                <span
                    onClick={onApplyFilter}
                    style={{
                        float: 'right',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginTop: '4px',
                    }}
                >
                    x
                </span>
            </div>
            <hr />

            {/* 보호소 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenShelter((o) => !o)}>
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
                            <button>검색</button>
                        </div>
                        <ul className="sf-item-list">
                            {filteredShelterList.map((s) => (
                                <li key={s.shelterName}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedShelters.includes(s.shelterName)}
                                            onChange={() =>
                                                toggleItem(s.shelterName, selectedShelters, setSelectedShelters)
                                            }
                                        />
                                        {s.shelterName}
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

            {/* 품종 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenBreed((o) => !o)}>
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
                            <button>검색</button>
                        </div>
                        <ul className="sf-item-list">
                            {breedsMock
                                .filter((b) => b.ko.includes(breedQuery.trim()))
                                .map((b) => (
                                    <li key={b.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedBreeds.includes(b.ko)}
                                                onChange={() =>
                                                    toggleItem(b.ko, selectedBreeds, setSelectedBreeds)
                                                }
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
                <div className="sf-sec-header" onClick={() => setOpenColor((o) => !o)}>
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
