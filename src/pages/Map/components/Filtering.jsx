// src/pages/Map/components/Filtering.jsx
import '../Filtering.css';
import React, { useState, useMemo } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import blackcircle from '../../../assets/blackcircle.svg';
import goldcircle from '../../../assets/goldcircle.svg';
import silvercircle from '../../../assets/silvercircle.svg';
import browncircle from '../../../assets/browncircle.svg';
import redcircle from '../../../assets/redcircle.svg';
import whitecircle from '../../../assets/whitecircle.svg';
import downbtn from '../../../assets/downbtn.svg';
import BottomSheet from './BottomSheet';
import X from '../../../assets/X.svg';

export default function Filtering() {
    const navigate = useNavigate();
    const location = useLocation();
    // 이전에 넘어온 값이 있으면 초기값으로 재사용
    const init = location.state || {};
    const [miss, setMiss] = useState(init.missFiltering ?? true);
    const [see, setSee] = useState(init.seeFiltering ?? true);
    const [shelter, setShelter] = useState(init.shelterFiltering ?? false);
    const [hospital, setHospital] = useState(init.hospitalFiltering ?? false);

    // 동물 색상 선택
    const [selectedColors, setSelectedColors] = useState(Array.isArray(init.colorFiltering) ? init.colorFiltering : []);
    const toggleColor = (color) => {
        setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };

    const colorMap = {
        검은색: '#000000',
        하얀색: '#F1F1F1',
        회색: '#808080',
        브라운: '#A52A2A',
        붉은색: '#FF0000',
        골드: '#FFD700',
    };
    //--------------

    // 동물 품종
    const [breadFilter, setBreadFilter] = useState(init.breedFiltering ?? '강아지 품종을 선택해주세요.');

    // 바텀 시트 상태
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const toggleSheet = () => setIsSheetOpen((open) => !open);

    const applyFilters = () => {
        navigate('/mapmain', {
            state: {
                missFiltering: miss,
                seeFiltering: see,
                shelterFiltering: shelter,
                hospitalFiltering: hospital,
                breedFiltering: breadFilter,
                colorFiltering: selectedColors,
            },
        });
    };

    const goBack = () => {
        navigate(-1);
    };

    // 입력창 자동완성
    const [search, setSearch] = useState('');

    //----------------
    // 강아지 품종 리스트
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

    const sortedOthers = otherBreeds
        .filter((b) => !prioritizedBreeds.includes(b))
        .sort((a, b) => a.localeCompare(b, 'ko'));

    const allBreeds = useMemo(() => [...prioritizedBreeds, ...sortedOthers], []);

    // 검색어에 맞춰 필터링
    const filteredBreeds = useMemo(() => {
        if (!search.trim()) return allBreeds;
        return allBreeds.filter((b) => b.includes(search.trim()));
    }, [search, allBreeds]);
    //--------------------------------------

    return (
        <div className="filter-page">
            <div className="filtering-header">
                <button className="back-button" onClick={goBack}>
                    <IoIosArrowBack />
                </button>
                <div className="header-title">필터링</div>
            </div>

            <section>
                <div className="report-info">신고정보</div>
                <label>
                    실종신고
                    <input type="checkbox" checked={miss} onChange={() => setMiss((m) => !m)} />
                </label>
                <label>
                    목격신고
                    <input type="checkbox" checked={see} onChange={() => setSee((s) => !s)} />
                </label>
                <label>
                    보호소
                    <input type="checkbox" checked={shelter} onChange={() => setShelter((s) => !s)} />
                </label>
                <label>
                    병원
                    <input type="checkbox" checked={hospital} onChange={() => setHospital((h) => !h)} />
                </label>
            </section>

            <div className="breed">
                <div className="breed-title">강아지 품종 *</div>
                {/* onClick을 toggleSheet로 수정했습니다 */}
                <div className="bread-body" onClick={toggleSheet}>
                    <div className="bread-bodycomment">
                        {breadFilter === '' || breadFilter === '선택안함' ? '강아지 품종을 선택해주세요' : breadFilter}
                    </div>
                    {/* 선택안함 부분 이면 ''로 변경하고 맵 메인도 ''로변경 */}
                    <div className="bread-bodybtn">
                        <img src={downbtn} alt="downbtn" />
                    </div>
                </div>
            </div>

            <div className="pet-color">
                <div className="pet-color-title">털색 *</div>
                <div className="color-container">
                    {[
                        [blackcircle, '검은색'],
                        [whitecircle, '하얀색'],
                        [silvercircle, '회색'],
                        [browncircle, '브라운'],
                        [redcircle, '붉은색'],
                        [goldcircle, '골드'],
                    ].map(([src, label]) => (
                        <div
                            className="color-item"
                            key={label}
                            onClick={() => toggleColor(label)}
                            style={{ opacity: selectedColors.includes(label) ? 0.5 : 1 }}
                        >
                            <img src={src} alt={label} />
                            <p className="color-comment">{label}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="selected-colors">
                        {selectedColors.map((color) => (
                            <span
                                key={color}
                                className="selected-color"
                                style={{
                                    border: `1px solid ${colorMap[color] || color}`,
                                }}
                            >
                                {color}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <button className="apply-button" onClick={applyFilters}>
                필터링 적용
            </button>

            {/* 바텀시트 */}
            {isSheetOpen && (
                <BottomSheet initialPercent={0.9} maxPercent={0.9} minHeight={900}>
                    <div style={{ padding: 16 }}>
                        <div className="bread-sheet-header">
                            <div className="bread-select">강아지 품종 선택</div>
                            <img src={X} alt="X" className="bread-X" onClick={toggleSheet} />
                        </div>
                        <div className="bread-search">
                            <input
                                type="text"
                                placeholder="찾을 종을 검색하세요"
                                className="bread-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="bread-sheet-body">
                            {filteredBreeds.map((breed, index) => (
                                <div
                                    className="bread-name"
                                    key={index}
                                    onClick={() => {
                                        setBreadFilter(breed === '선택안함' ? '' : breed);
                                        toggleSheet();
                                        setSearch('');
                                    }}
                                >
                                    {breed}
                                </div>
                            ))}
                        </div>
                    </div>
                </BottomSheet>
            )}
        </div>
    );
}
