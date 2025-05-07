// src/components/AdoptionPost.jsx
import React, { useState } from 'react';
import '../AdoptionPost.css';
import { FaCamera, FaPlus } from 'react-icons/fa';
import X from '../../../assets/X.svg';
import BottomSheet from '../../Map/components/BottomSheet';

export default function AdoptionPost() {
    const [petName, setPetName] = useState('');
    const [selectedBreeds, setSelectedBreeds] = useState([]); // 칩으로 보여줄 선택된 품종 리스트
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const toggleSheet = () => setIsSheetOpen((v) => !v);
    const [search, setSearch] = useState('');
    const [color, setColor] = useState([]);
    const [gender, setGender] = useState('');
    const [neutered, setNeutered] = useState(false);
    const [birthDate, setBirthDate] = useState('');
    const [weight, setWeight] = useState('');
    const [regNumber, setRegNumber] = useState('');

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

    const colors = [
        { label: '검은색', value: 'black', hex: '#000' },
        { label: '하얀색', value: 'white', hex: '#fff' },
        { label: '회색', value: 'gray', hex: '#7E7E7E' },
        { label: '갈색', value: 'brown', hex: '#8B4513' },
        { label: '붉은색', value: 'red', hex: '#E74C3C' },
        { label: '골드', value: 'gold', hex: '#F8DF65' },
    ];

    const filteredBreeds = ['선택안함', ...otherBreeds].filter((b) => b.includes(search));

    return (
        <div className="adoption-post">
            <header className="header">
                <h1>동물정보입력</h1>
            </header>

            <section className="profile-pics">
                <div className="profile-placeholder">
                    <FaCamera size={24} />
                    <span>사진</span>
                </div>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="add-pic">
                        <FaPlus size={24} />
                    </div>
                ))}
            </section>

            <form className="post-form">
                {/* 반려동물 이름 */}
                <div className="form-group">
                    <label>반려동물 이름*</label>
                    <input
                        type="text"
                        placeholder="반려동물 이름을 입력하세요."
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                    />
                </div>

                {/* 품종 드롭다운 */}
                <div className="form-group">
                    <label>강아지 품종*</label>
                    <div className="breed-select" onClick={toggleSheet}>
                        {selectedBreeds.length > 0 ? selectedBreeds.join(', ') : '품종을 선택하세요'}
                        <span className="breed-arrow">▼</span>
                    </div>
                </div>

                {/* 바텀시트 */}
                {isSheetOpen && (
                    <BottomSheet initialPercent={0.9} maxPercent={0.9} minHeight={900}>
                        <div style={{ padding: 16 }}>
                            <div className="bread-sheet-header">
                                <div className="bread-select">강아지 품종 선택</div>
                                <img src={X} alt="X" className="bread-X" onClick={() => setIsSheetOpen(false)} />
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
                                {filteredBreeds.map((breed, idx) => (
                                    <div
                                        key={idx}
                                        className="bread-name"
                                        onClick={() => {
                                            if (breed === '선택안함') {
                                                setSelectedBreeds([]);
                                            } else if (!selectedBreeds.includes(breed)) {
                                                setSelectedBreeds((prev) => [...prev, breed]);
                                            }
                                            setSearch('');
                                            setShowSheet(false);
                                        }}
                                    >
                                        {breed}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BottomSheet>
                )}

                {/* 털색 */}
                <div className="form-group color-group">
                    <label>털색*</label>
                    <div className="color-options">
                        {colors.map((c) => (
                            <div
                                key={c.value}
                                className={`color-box ${color.includes(c.value) ? 'selected' : ''}`}
                                onClick={() =>
                                    setColor((prev) =>
                                        prev.includes(c.value) ? prev.filter((v) => v !== c.value) : [...prev, c.value]
                                    )
                                }
                            >
                                <span className="dot" style={{ backgroundColor: c.hex }} />
                                <span className="color-label">{c.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 성별 + 중성화 */}
                <div className="form-group gender-group">
                    <label>성별*</label>
                    <div className="gender-options">
                        <div
                            className={gender === 'male' ? 'gender-box-select' : 'gender-box'}
                            onClick={() => setGender((prev) => (prev === 'male' ? '' : 'male'))}
                        >
                            남아
                        </div>
                        <div
                            className={gender === 'female' ? 'gender-box-select' : 'gender-box'}
                            onClick={() => setGender((prev) => (prev === 'female' ? '' : 'female'))}
                        >
                            여아
                        </div>
                        <div
                            className={`sex-select ${neutered ? 'selected' : ''}`}
                            onClick={() => setNeutered((prev) => !prev)}
                        >
                            <div className="icon">✓</div>
                            <div className="label">중성화 했어요</div>
                        </div>
                    </div>
                </div>

                {/* 생년, 몸무게, 등록번호 */}
                <div className="form-group">
                    <label>생년*</label>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>몸무게*</label>
                    <input
                        type="text"
                        placeholder="4.20kg"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>동물등록번호</label>
                    <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
                </div>

                <button type="submit" className="next-btn">
                    다음
                </button>
            </form>
        </div>
    );
}
