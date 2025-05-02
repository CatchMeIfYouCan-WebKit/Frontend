// src/pages/AnimalProfile/components/AnimalProfile.jsx
import React, { useState, useMemo } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineCamera } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BottomSheet from '../../Map/components/BottomSheet';
import '../animalProfile.css';
import downbtn from '../../../assets/downbtn.svg';
import checkOn from '../../../assets/checkOn.svg';
import checkOff from '../../../assets/checkOff.svg';
import x from '../../../assets/x.svg';
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

const otherBreeds = ['비숑 프리제', '진돗개', '퍼그', '요크셔테리어'];
const allBreeds = [...prioritizedBreeds, ...otherBreeds.sort((a, b) => a.localeCompare(b, 'ko'))];

const colorMap = {
    검은색: '#000000',
    하얀색: '#F1F1F1',
    회색: '#808080',
    브라운: '#A52A2A',
    붉은색: '#FF0000',
    골드: '#FFD700',
};

const colorList = ['검은색', '하얀색', '회색', '브라운', '붉은색', '골드'];

export default function AnimalProfile() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isRegSheetOpen, setIsRegSheetOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('강아지 품종을 선택해주세요');
    const [selectedColors, setSelectedColors] = useState([]);
    const [gender, setGender] = useState('');
    const [isNeutered, setIsNeutered] = useState(false);
    const [birth, setBirth] = useState(null);
    const [weight, setWeight] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [owner, setOwner] = useState('');

    const filteredBreeds = useMemo(() => {
        if (!search.trim()) return allBreeds;
        return allBreeds.filter((b) => b.includes(search.trim()));
    }, [search]);

    const toggleSheet = () => setIsSheetOpen((prev) => !prev);

    const toggleColor = (color) => {
        setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };

    const openRegSheet = () => setIsRegSheetOpen(true);
    const closeRegSheet = () => setIsRegSheetOpen(false);

    return (
        <div className="animal-profile">
            <header className="animal-profile-header">
                <button className="back-button" onClick={() => window.history.back()}>
                    <IoIosArrowBack />
                </button>
                <h1>강아지 프로필 등록</h1>
            </header>

            <div className="animal-profile-content">
                <div className="form-group photo-group">
                    <label>프로필 사진</label>
                    <div className="photo-upload">
                        <AiOutlineCamera className="camera-icon" />
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        반려동물 이름 <span className="required">*</span>
                    </label>
                    <input type="text" placeholder="반려동물 이름 입력" />
                </div>

                <div className="form-group">
                    <label>
                        강아지 품종 <span className="required">*</span>
                    </label>
                    <div className="bread-body" onClick={toggleSheet}>
                        <div className="bread-bodycomment">{selectedBreed}</div>
                        <div className="bread-bodybtn">
                            <img src={downbtn} alt="downbtn" />
                        </div>
                    </div>
                </div>

                <div className="form-group color-group">
                    <label>
                        털색 <span className="required">*</span>
                    </label>
                    <div className="color-options">
                        {colorList.map((color) => (
                            <div
                                key={color}
                                className="color-option"
                                onClick={() => toggleColor(color)}
                                style={{ opacity: selectedColors.includes(color) ? 0.5 : 1 }}
                            >
                                <div className="color-circle" style={{ backgroundColor: colorMap[color] }}></div>
                                <span>{color}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group gender-group">
                    <label>
                        성별 <span className="required">*</span>
                    </label>
                    <div className="gender-options">
                        <button
                            type="button"
                            className={`gender-button ${gender === '남아' ? 'selected' : ''}`}
                            onClick={() => setGender('남아')}
                        >
                            남아
                        </button>
                        <button
                            type="button"
                            className={`gender-button ${gender === '여아' ? 'selected' : ''}`}
                            onClick={() => setGender('여아')}
                        >
                            여아
                        </button>
                    </div>
                    <div className="neuter">
                        <img
                            src={isNeutered ? checkOn : checkOff}
                            alt="check"
                            className="neuter-icon"
                            onClick={() => setIsNeutered((prev) => !prev)}
                        />
                        <label>중성화 했어요</label>
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        생일 <span className="required">*</span>
                    </label>
                    <div className="react-datepicker__input-container">
                        <DatePicker
                            selected={birth}
                            onChange={(date) => setBirth(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="생년월일을 선택해주세요"
                        />
                        <FaRegCalendarAlt className="date-picker-icon center-icon" />
                    </div>
                </div>

                <div className="form-group weight-input-group">
                    <label>
                        몸무게 <span className="required">*</span>
                    </label>
                    <div className="weight-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="몸무게를 입력해주세요"
                            value={weight}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^\d.]/g, '');
                                if (/^\d*\.?\d*$/.test(val)) setWeight(val);
                            }}
                            onBlur={() => setWeight((prev) => (prev ? `${prev}kg` : ''))}
                            onFocus={() => setWeight((prev) => prev.replace(/kg$/, ''))}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>동물등록번호</label>
                    <button className="reg-button" onClick={openRegSheet}>
                        동물등록번호 인증하기
                    </button>
                    <p className="reg-hint">동물등록번호는 나중에 입력할 수 있습니다.</p>
                </div>
            </div>

            <button className="submit-button">프로필 등록</button>

            {isSheetOpen && (
                <BottomSheet initialPercent={0.8} maxPercent={0.9}>
                    <div className="bread-sheet-header">
                        <div className="bread-select">강아지 품종 선택</div>
                        <button onClick={toggleSheet}>X</button>
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
                                    setSelectedBreed(breed);
                                    setIsSheetOpen(false);
                                    setSearch('');
                                }}
                            >
                                {breed}
                            </div>
                        ))}
                    </div>
                </BottomSheet>
            )}

            {isRegSheetOpen && (
                <BottomSheet initialPercent={0.5} maxPercent={0.6}>
                    <div className="bread-sheet-header">
                        <div className="bread-select">동물등록번호 인증</div>
                        <button onClick={closeRegSheet}>
                            {' '}
                            <img src={x} alt="x" />
                        </button>
                    </div>
                    <div className="bread-search">
                        <label>동물등록번호</label>
                        <input
                            type="text"
                            placeholder="동물등록번호를 입력하세요"
                            className="bread-input"
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                        />
                        <label>보호자</label>
                        <input
                            type="text"
                            placeholder="보호자 이름을 입력하세요"
                            className="bread-input"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                        />
                    </div>
                    <button className="reg-submit">인증하기</button>
                </BottomSheet>
            )}
        </div>
    );
}
