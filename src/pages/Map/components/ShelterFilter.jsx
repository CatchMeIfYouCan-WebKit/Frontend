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

    const initialShelterFilters = location.state?.selectedShelters ?? [];
    const initialBreedFilters = location.state?.selectedBreeds ?? [];
    const initialColorFilters = location.state?.selectedColors ?? [];
    const initialGenderFilters = location.state?.selectedGenders ?? [];

    // 부모가 넘긴 데이터
    const shelters = location.state?.shelters ?? [];
    const prevTab = location.state?.currentTab;

    // 섹션 열기/닫기
    const [openShelter, setOpenShelter] = useState(true);
    const [openAge, setOpenAge] = useState(true);
    const [openBreed, setOpenBreed] = useState(true);
    const [openColor, setOpenColor] = useState(true);
    const [openGender, setOpenGender] = useState(true);

    const toggleColor = (color) => {
        setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };

    // 필터 상태
    const [shelterQuery, setShelterQuery] = useState('');
    const [breedQuery, setBreedQuery] = useState('');
    const [selectedShelters, setSelectedShelters] = useState(initialShelterFilters);
    const [selectedBreeds, setSelectedBreeds] = useState(initialBreedFilters);
    const [selectedColors, setSelectedColors] = useState(initialColorFilters);
    const [selectedGenders, setSelectedGenders] = useState(initialGenderFilters);

    const [minAge, setMinAge] = useState('');

    // 원본 + 검색 결과
    const [originalShelters] = useState(shelters);
    const [filteredShelterList, setFilteredShelterList] = useState([]);

    useEffect(() => {
        if (shelterQuery.trim()) {
            setFilteredShelterList(originalShelters.filter((s) => s.shelterName.includes(shelterQuery.trim())));
        } else {
            setFilteredShelterList([]);
        }
    }, [shelterQuery, originalShelters]);

    const toggleItem = (item, list, setter) =>
        list.includes(item) ? setter(list.filter((x) => x !== item)) : setter([...list, item]);

    const onApplyFilter = () => {
        const filtered = [];

        originalShelters.forEach((shelter) => {
            // 보호소 필터
            if (selectedShelters.length > 0 && !selectedShelters.includes(shelter.shelterName)) return;

            // animalSummaries 필터링
            const matchedAnimals = shelter.animalSummaries?.filter((animal) => {
                const matchBreed = selectedBreeds.length === 0 || selectedBreeds.includes(animal.breed);

                const matchColor =
                    selectedColors.length === 0 ||
                    selectedColors.some((colorId) =>
                        animal.coatColor?.includes(colors.find((c) => c.id === colorId)?.label)
                    );

                const currentYear = new Date().getFullYear();
                const birthYearMatch = animal.ageWeight?.match(/(\d{4})\(년생\)/);
                const calculatedAge = birthYearMatch ? currentYear - parseInt(birthYearMatch[1], 10) : null;
                const matchAge = !minAge || (calculatedAge !== null && calculatedAge >= Number(minAge));
                const matchGender = selectedGenders.length === 0 || selectedGenders.includes(animal.gender);

                return matchBreed && matchColor && matchAge && matchGender;
            });

            if (matchedAnimals?.length > 0) {
                filtered.push({ ...shelter, animalSummaries: matchedAnimals });
            }
        });

        // 결과와 탭 정보를 가지고 돌아간다
        navigate('/shelterdetail', {
            state: {
                shelters: originalShelters,
                filteredAnimals: filtered,
                currentTab: prevTab,
                selectedShelters, // ← 반드시!
                selectedBreeds, // ← 반드시!
                selectedColors,
                selectedGenders, // ← 추가
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

            {/* 품종 */}
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
                            />
                            <button>검색</button>
                        </div>
                        {breedQuery && (
                            <ul className="sf-autocomplete-list">
                                {otherBreeds
                                    .filter((b) => b.includes(breedQuery))
                                    .map((b) => (
                                        <li
                                            key={b}
                                            onClick={() => {
                                                toggleItem(b, selectedBreeds, setSelectedBreeds);
                                                setBreedQuery(b); // 선택 후 입력 초기화
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
                                                checked={selectedBreeds[0] === b.ko}
                                                onChange={() => {
                                                    if (selectedBreeds[0] === b.ko) {
                                                        setSelectedBreeds([]);
                                                    } else {
                                                        setSelectedBreeds([b.ko]);
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
            {/* 성별 */}
            <div className="sf-section">
                <div className="sf-sec-header" onClick={() => setOpenGender((o) => !o)}>
                    <span>성별* <span className="pet-color-comment">성별을 선택해 주세요.</span></span>
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
                                            checked={selectedGenders.includes(gender)}
                                            onChange={() => toggleItem(gender, selectedGenders, setSelectedGenders)}
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

            {/* 털색 */}
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
                            const isSelected = selectedColors.includes(label);
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
                <button className="apply-btn" onClick={onApplyFilter}>
                    필터 적용
                </button>
            </div>
        </div>
    );
}
