import React, { useState, useEffect } from 'react';
import '../ShelterFilter.css';
import { IoIosArrowDown, IoIosArrowUp, IoIosCheckmark } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import blackcircle from '../../../assets/blackcircle.svg';
import lightgoldcircle from '../../../assets/lightgoldcircle.svg';
import silvercircle from '../../../assets/silvercircle.svg';
import browncircle from '../../../assets/browncircle.svg';
import darkgoldcircle from '../../../assets/darkgoldcircle.svg';
import whitecircle from '../../../assets/whitecircle.svg';
import { FaCheck } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

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

const otherBreeds = [
    '그레이하운드',
    '그레이트 데인',
    '그레이트 피레니즈',
    '그린란드견',
    '골든두들',
    '골든캐벌리어',
    '골든푸들',
    '꼬똥 드 툴레아',
    '네오폴리탄 마스티프',
    '노르포크 테리어',
    '노리치 테리어',
    '노퍽 테리어',
    '뉴펀들랜드',
    '닥스훈트',
    '달마시안',
    '도고 아르헨티노',
    '도베르만 핀셔',
    '도사견',
    '라브라도들',
    '라브라도 리트리버',
    '라사압소',
    '라이카',
    '라이온독',
    '래브라도 레트리버',
    '랙훈드',
    '러시아 토이',
    '로디지안 리지백',
    '로트와일러',
    '로첸',
    '마르티즈 포메 믹스',
    '마리노이즈',
    '마스티프',
    '말라뮤트',
    '말티푸',
    '맨체스터 테리어',
    '멕시칸 헤어리스',
    '몰티즈 믹스',
    '미니어처 닥스훈트',
    '미니어처 불테리어',
    '미니어처 슈나우저',
    '미니어처 핀셔',
    '바센지',
    '바셋 하운드',
    '버니즈 마운틴 독',
    '베들링턴 테리어',
    '베르가마스코',
    '베르네즈 마운틴 독',
    '벨지안 말리노이즈',
    '벨지안 셰퍼드',
    '벨지안 테뷰런',
    '벨지안 그리펀',
    '보더 콜리',
    '보르조이',
    '보스턴 테리어',
    '복서',
    '볼로네즈',
    '불 개',
    '불 마스티프',
    '불 테리어',
    '불도그',
    '브뤼셀 그리펀',
    '브리아드',
    '블랙 러시안 테리어',
    '블러드 하운드',
    '블루틱 쿤하운드',
    '비글',
    '비숑 프리제',
    '비어디드 콜리',
    '삽살개',
    '살루키',
    '샤페이',
    '샤이페이',
    '셰틀랜드 쉽독',
    '센트버나드',
    '소프트코티드 휘튼 테리어',
    '슈나우저',
    '스코티시 테리어',
    '스코티시 디어하운드',
    '스태퍼드셔 불테리어',
    '스탠다드 푸들',
    '스파니엘',
    '스피츠',
    '스코틀랜드 테리어',
    '슬루기',
    '시바견',
    '시베리안 허스키',
    '실키테리어',
    '아나톨리안 셰퍼드',
    '아메리칸 불리',
    '아메리칸 스태퍼드셔 테리어',
    '아메리칸 코커 스패니얼',
    '아메리칸 에스키모',
    '아이리시 세터',
    '아이리시 울프하운드',
    '아키타견',
    '아펜핀셔',
    '알래스칸 맬러뮤트',
    '에어데일 테리어',
    '오브차카',
    '오스트레일리안 셰퍼드',
    '오스트레일리안 캐틀독',
    '오스트레일리안 테리어',
    '요크셔테리어',
    '웨스트하이랜드화이트테리어',
    '웨일시 코기',
    '웨일시 테리어',
    '웰시 코기',
    '잉글리시 불독',
    '잉글리시 세터',
    '잉글리시 스프링거 스패니얼',
    '잉글리시 코커 스패니얼',
    '자이언트 슈나우저',
    '잭 러셀 테리어',
    '진돗개',
    '차우차우',
    '차이니즈 크레스티드',
    '체서피크 베이 리트리버',
    '치니즈 샤페이',
    '케언 테리어',
    '케리 블루 테리어',
    '코카스패니얼',
    '코몬도르',
    '콜리',
    '쿠바나 하반즈',
    '크로아티안 셰퍼드',
    '클럼버 스패니얼',
    '키슈견',
    '테리어믹스',
    '티베탄 마스티프',
    '티베탄 테리어',
    '파라오 하운드',
    '파피용',
    '퍼그',
    '페키니즈',
    '페터데일 테리어',
    '포인터',
    '폭스테리어',
    '풍산개',
    '프렌치 불도그',
    '플랫코티드 리트리버',
    '플로리다 큐라',
    '피레니언 마운틴 도그',
    '피레니언 셰퍼드',
    '피레니언 테리어',
    '피레니즈',
    '핀란드 라프훈드',
    '핀란드 스피츠',
    '필라 브라질레이로',
    '핏불 테리어',
    '허스키',
    '해리어',
];

export default function ShelterFilter() {
    const navigate = useNavigate();
    const location = useLocation();

    // state 값 받기
    const shelters = location.state?.shelters ?? [];
    const initialSelectedShelterName = location.state?.selectedShelterName ?? [];
    const initialSelectedBreed = location.state?.selectedBreed ?? [];
    const initialSelectedColor = location.state?.selectedColor ?? [];
    const initialSelectedGender = location.state?.selectedGender ?? [];

    // 필터 상태
    const [selectedShelterName, setSelectedShelterName] = useState(initialSelectedShelterName);
    const [selectedBreed, setSelectedBreed] = useState(initialSelectedBreed);
    const [selectedColor, setSelectedColor] = useState(initialSelectedColor);
    const [selectedGender, setSelectedGender] = useState(initialSelectedGender);
    const [shelterQuery, setShelterQuery] = useState('');
    const [breedQuery, setBreedQuery] = useState('');

    // 섹션 열기/닫기
    const [openShelter, setOpenShelter] = useState(true);
    const [openBreed, setOpenBreed] = useState(true);
    const [openColor, setOpenColor] = useState(true);
    const [openGender, setOpenGender] = useState(true);
    const [shelterAutoOpen, setShelterAutoOpen] = useState(false);
    const [breedAutoOpen, setBreedAutoOpen] = useState(false);

    const [minAge, setMinAge] = useState('');

    // 원본 + 검색 결과
    const [originalShelters] = useState(shelters);
    const [filteredShelterList, setFilteredShelterList] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    const toggleColor = (color) => {
        setSelectedColor((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };

    // 토글
    const toggleItem = (item, list, setter) =>
        list.includes(item) ? setter(list.filter((x) => x !== item)) : setter([...list, item]);

    // 필터 적용하기
    const onApplyFilter = () => {
        if (!shelterQuery.trim()) {
            setSelectedShelterName([]);
        }

        const filtered = [];

        originalShelters.forEach((shelter) => {
            // 보호소 필터
            if (selectedShelterName.length > 0 && !selectedShelterName.includes(shelter.shelterName)) return;

            // animalSummaries 필터링
            const matchedAnimals = shelter.animalSummaries?.filter((animal) => {
                const matchBreed = selectedBreed.length === 0 || selectedBreed.includes(animal.breed);

                const matchColor =
                    selectedColor.length === 0 ||
                    selectedColor.some((colorId) =>
                        animal.coatColor?.includes(colors.find((c) => c.id === colorId)?.label)
                    );

                const currentYear = new Date().getFullYear();
                const birthYearMatch = animal.ageWeight?.match(/(\d{4})\(년생\)/);
                const calculatedAge = birthYearMatch ? currentYear - parseInt(birthYearMatch[1], 10) : null;
                const matchAge = !minAge || (calculatedAge !== null && calculatedAge >= Number(minAge));
                const matchGender = selectedGender.length === 0 || selectedGender.includes(animal.gender);

                return matchBreed && matchColor && matchAge && matchGender;
            });

            if (matchedAnimals?.length > 0) {
                filtered.push({ ...shelter, animalSummaries: matchedAnimals });
            }
        });

        console.log('[필터 적용 후 넘기는 값]', {
            selectedShelterName,
            selectedBreed,
            selectedColor,
            selectedGender,
        });

        // 결과와 탭 정보를 가지고 돌아간다
        navigate('/shelterdetail', {
            state: {
                selectedShelterName: !shelterQuery.trim() ? [] : selectedShelterName,
                selectedBreed: selectedBreed,
                selectedColor: selectedColor,
                selectedGender: selectedGender,
            },
        });
    };

    // 보호소 중복 제거
    const uniqueShelterList = filteredShelterList.filter(
        (s, idx, arr) => arr.findIndex((x) => x.shelterName === s.shelterName) === idx
    );

    // 강아지 중복 제거
    const uniqueBreedSuggestions = Array.from(new Set(otherBreeds.filter((b) => b.includes(breedQuery))));

    const goBack = () => {
        navigate('/shelterdetail');
    };
    // ======================================== useEffect
    useEffect(() => {
        if (shelterQuery.trim()) {
            setFilteredShelterList(originalShelters.filter((s) => s.shelterName.includes(shelterQuery.trim())));
        } else {
            setFilteredShelterList([]);
        }
    }, [shelterQuery, originalShelters]);

    useEffect(() => {
        // 보호소/품종 입력창에 선택값 반영 (복수 선택이면 첫 번째 값만)
        if (selectedShelterName.length > 0) {
            setShelterQuery(selectedShelterName[0]);
        }
        if (selectedBreed.length > 0) {
            setBreedQuery(selectedBreed[0]);
        }

        // 값이 없으면 입력창 비우기
        if (selectedShelterName.length === 0) {
            setShelterQuery('');
        }
        if (selectedBreed.length === 0) {
            setBreedQuery('');
        }
    }, []);

    // ======================================== useEffect

    return (
        <div className="shelter-filter">
            {/* 헤더 */}
            <div className="sf-header">
                <div className="back-button2" onClick={goBack}>
                    <IoIosArrowBack size={32} />
                </div>
                <div className="filtering-title">필터링</div>
            </div>

            {/* 1. 보호소 */}
            {/* 여기에 보호소 백엔드 이름 전부다 받아와서 자동완성 기능추가  */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenShelter((o) => !o)}>
                    <span>
                        보호소* <span className="pet-color-comment">보호소 이름으로 검색</span>
                    </span>
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
                                onFocus={() => setShelterAutoOpen(true)}
                            />

                            <button>검색</button>
                        </div>
                        {/* 선택된 보호소 표시 */}
                        {shelterAutoOpen && shelterQuery && (
                            <ul className="sf-autocomplete-list">
                                {uniqueShelterList
                                    .filter((s) => s.shelterName.includes(shelterQuery))
                                    .map((s) => (
                                        <li
                                            key={s.shelterName}
                                            onClick={() => {
                                                setShelterQuery(s.shelterName); // 입력창에 보호소명 입력
                                                setShelterAutoOpen(false); // 자동완성 닫기
                                                setSelectedShelterName([s.shelterName]); // 보호소 선택 상태 갱싱
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                background: s.shelterName === shelterQuery ? '#f0f0f0' : 'white',
                                            }}
                                        >
                                            {s.shelterName}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <hr />

            {/* 2. 품종 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenBreed((o) => !o)}>
                    <span>
                        강아지 품종* <span className="pet-color-comment">품종은 한 개만 선택 가능 합니다.</span>
                    </span>
                    {openBreed ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>

                {openBreed && (
                    <div className="sf-sec-body">
                        {/* ── 자동완성 리스트 */}

                        <div className="sf-search-row">
                            <input
                                type="text"
                                placeholder="강아지 품종 검색"
                                value={breedQuery}
                                onChange={(e) => setBreedQuery(e.target.value)}
                                onFocus={() => setBreedAutoOpen(true)}
                            />
                            <button>검색</button>{' '}
                            {breedQuery && (
                                <button
                                    className="sf-input-clear"
                                    style={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: 18,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setBreedQuery('')}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        {breedAutoOpen && breedQuery && (
                            <ul className="sf-autocomplete-list">
                                {uniqueBreedSuggestions
                                    .filter((b) => b.includes(breedQuery))
                                    .map((b) => (
                                        <li
                                            key={b}
                                            onClick={() => {
                                                setBreedQuery(b); // 입력창에 선택값 표시
                                                setSelectedBreed([b]); // 품종 상태 갱신
                                                setBreedAutoOpen(false); // 자동완성 닫기
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                background: b === breedQuery ? '#f0f0f0' : 'white',
                                            }}
                                        >
                                            {b}
                                        </li>
                                    ))}
                            </ul>
                        )}
                        <ul className="sf-item-list">
                            {breedsMock
                                .filter((b) => b.ko.includes(breedQuery.trim()))
                                .map((b) => (
                                    <li key={b.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="breed"
                                                value={b.ko}
                                                checked={selectedBreed[0] === b.ko}
                                                onChange={() => {
                                                    if (selectedBreed[0] === b.ko) {
                                                        setSelectedBreed([]);
                                                    } else {
                                                        setSelectedBreed([b.ko]);
                                                    }
                                                }}
                                            />
                                            <span className="ko">{b.ko}</span>
                                            <span className="en">{b.en}</span>
                                        </label>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
            <hr />

            {/* 3. 성별 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenGender((o) => !o)}>
                    <span>
                        성별* <span className="pet-color-comment">성별을 선택해 주세요.</span>
                    </span>
                    {openGender ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {openGender && (
                    <div className="sf-sec-body">
                        <ul className="sf-item-list">
                            {['수컷', '암컷'].map((gender) => (
                                <li key={gender}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedGender.includes(gender)}
                                            onChange={() => toggleItem(gender, selectedGender, setSelectedGender)}
                                        />
                                        {gender}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <hr />

            {/* 4. 털색 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenColor((o) => !o)}>
                    <span>
                        털색*{' '}
                        <span className="pet-color-comment">털 색상이 한 가지가 아닌경우 중복 선택 가능합니다.</span>
                    </span>
                    {openColor ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {openColor && (
                    <div className="color-container">
                        {[
                            [blackcircle, '검은색'],
                            [whitecircle, '하얀색'],
                            [silvercircle, '회색'],
                            [browncircle, '브라운'],
                            [darkgoldcircle, '어두운 골드'],
                            [lightgoldcircle, '밝은 골드'],
                        ].map(([src, label]) => {
                            const isSelected = selectedColor.includes(label);
                            return (
                                <div
                                    className={`color-item ${isSelected ? 'selected' : ''}`}
                                    key={label}
                                    onClick={() => toggleColor(label)}
                                >
                                    <img src={src} alt={label} />
                                    {isSelected && (
                                        <div className={`color-check ${label === '하얀색' ? 'white-check' : ''}`}>
                                            <FaCheck />
                                        </div>
                                    )}
                                    <p className="color-comment">{label}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <hr />

            {/* ── 필터 적용 버튼 */}
            <div className="sf-footer">
                <div className="apply-btn" onClick={onApplyFilter}>
                    필터 적용
                </div>
            </div>
        </div>
    );
}
