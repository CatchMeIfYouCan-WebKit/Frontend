// AdoptionFilterSheet.jsx
import React, { useState, useMemo, useRef } from 'react';
import browncircle from '../../../assets/browncircle.svg';
import blackcircle from '../../../assets/blackcircle.svg';
import lightgoldcircle from '../../../assets/lightgoldcircle.svg';
import silvercircle from '../../../assets/silvercircle.svg';
import darkgoldcircle from '../../../assets/darkgoldcircle.svg';
import whitecircle from '../../../assets/whitecircle.svg';
import { FaCheck } from 'react-icons/fa';
import '../AdoptionFilterSheet.css';
import { IoIosArrowBack } from 'react-icons/io';


export default function AdoptionFilterSheet({ onApply, onClose, initFilter }) {
    const [region, setRegion] = useState(initFilter.region || '');
    const [age, setAge] = useState(initFilter.age || '');
    const [breed, setBreed] = useState(initFilter.breed || '');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [search, setSearch] = useState('');
    const init = location.state || {};

    const prioritizedBreeds = [
        '선택안함',
        '믹스견',
        '말티즈',
        '푸들',
        '포메라니안',
        '짓돗개',
        '시츄',
        '골든 리트리버',
        '치와와',
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
    const allBreeds = useMemo(() => [...prioritizedBreeds, ...otherBreeds].filter(Boolean), []);

    const filteredBreeds = useMemo(() => {
        if (!search.trim()) return allBreeds;
        return allBreeds.filter((b) => b.includes(search.trim()));
    }, [search, allBreeds]);

    const [selectedColors, setSelectedColors] = useState(Array.isArray(initFilter.color) ? initFilter.color : []);
    const toggleColor = (color) => {
        setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };
    const colorOptions = [
        [blackcircle, '검은색'],
        [whitecircle, '하얀색'],
        [silvercircle, '회색'],
        [browncircle, '브라운'],
        [darkgoldcircle, '어두운 골드'],
        [lightgoldcircle, '밝은 골드'],
    ];
    const popularBreeds = ['믹스견', '말티즈', '푸들', '포메라니안', '진돗개', '시츄', '골든 리트리버', '치와와'];
    const [selectedPopularBreed, setSelectedPopularBreed] = useState('');

    const apply = () => {
        onApply({ region, age, breed, color: selectedColors });
        onClose();
    };

    // 추가
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const wrapperRef = useRef(null);
    return (
        <div className="filter-modal" onClick={onClose}>
            <div className="filter-page" onClick={(e) => e.stopPropagation()}>
                <div className="filtering-header">
                    <div className="back-button2" onClick={onClose}>
                        <IoIosArrowBack size={32} />
                    </div>
                    <div className="header-title">필터링</div>
                </div>
                <div className="lo-f">
                    <div className="breed-title">
                        지역<span className="required">*</span>
                    </div>
                    <div className="bread-input-wrap">
                        <input
                            type="text"
                            className="lo-f-input"
                            placeholder="예: 서울 강남구"
                            value={region}
                            onChange={(e) => {
                                setRegion(e.target.value);
                            }}
                        />
                        <div className="breed-search">검색</div>
                    </div>
                </div>
                <div className="lo-f">
                    <div className="breed-title">
                        나이<span className="required">*</span>
                        <div className="label-comment">숫자만 입력 가능합니다.</div>
                    </div>
                    <div className="bread-input-wrap">
                        <input
                            type="number"
                            className="lo-f-input"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="예: 2"
                        />
                    </div>
                </div>
                {/* ---------- */}
                <div className="breed" ref={wrapperRef}>
                    <div className="breed-title">
                        강아지 품종<span className="required">*</span>{' '}
                        <div className="label-comment">품종은 한 개만 선택 가능합니다.</div>
                    </div>
                    {/* onClick을 toggleSheet로 수정했습니다 */}
                    <div className="bread-input-wrap">
                        <input
                            type="text"
                            className="bread-input"
                            placeholder="강아지 품종을 선택해주세요"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setIsSuggestOpen(true);
                            }}
                            onFocus={() => setIsSuggestOpen(true)}
                        />
                        <div className="breed-search">검색</div>
                    </div>
                    {isSuggestOpen && filteredBreeds.length > 0 && (
                        <div className="sug-wrap">
                            <ul className="bread-suggestions">
                                {filteredBreeds.map((b, i) => (
                                    <li
                                        key={i}
                                        className="bread-suggestion-item"
                                        onClick={() => {
                                            const val = b === '선택안함' ? '' : b;
                                            setBreed(val);
                                            setSearch(val);
                                            setIsSuggestOpen(false);
                                            setSelectedPopularBreed(''); // 선택 해제
                                        }}
                                    >
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="popular-breeds">
                        {popularBreeds.map((b) => (
                            <label key={b} className="popular-breed-btn">
                                <input
                                    type="checkbox"
                                    checked={selectedPopularBreed === b}
                                    onChange={() => {
                                        const newSel = selectedPopularBreed === b ? '' : b;
                                        setSelectedPopularBreed(newSel);
                                        setSearch(newSel);
                                        setBreed(newSel);
                                        setIsSuggestOpen(false);
                                    }}
                                />
                                <span>{b}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {/* ----------- */}

                <div className="pet-color">
                    <div className="pet-color-title">
                        털색<span className="required">*</span>{' '}
                        <div className="label-comment">색상은 중복선택 가능합니다.</div>
                    </div>
                    <div className="color-container">
                        {colorOptions.map(([src, label]) => {
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
                </div>

                <button className="apply-button" onClick={apply}>
                    필터링 적용
                </button>
            </div>
        </div>
    );
}
