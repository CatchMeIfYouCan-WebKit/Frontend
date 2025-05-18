// src/components/AdoptionPost.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';

import '../AdoptionPost.css';
import { FaCamera, FaPlus } from 'react-icons/fa';
import { FaRegCalendarAlt } from 'react-icons/fa';
import browncircle from '../../../assets/browncircle.svg';
import blackcircle from '../../../assets/blackcircle.svg';
import lightgoldcircle from '../../../assets/lightgoldcircle.svg';
import silvercircle from '../../../assets/silvercircle.svg';
import darkgoldcircle from '../../../assets/darkgoldcircle.svg';
import whitecircle from '../../../assets/whitecircle.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';

// 등록된 반려동물 입양글 등록 시 반려동물 이름, 사진 , 품종, 털색 성별, 중성화 여부, 생일, 몸무게, 동물 등록번호 있으면 받아오기

const colorOptions = [
    { label: '검은색', value: '검은색', hex: '#000000' },
    { label: '하얀색', value: '하얀색', hex: '#FFFFFF' },
    { label: '회색', value: '회색', hex: '#7E7E7E' },
    { label: '브라운', value: '브라운', hex: '#8B4513' },
    { label: '어두운골드', value: '어두운골드', hex: '#E74C3C' },
    { label: '밝은골드', value: '밝은골드', hex: '#F8DF65' },
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
const prioritizedBreeds = [
    '선택안함',
    '믹스견',
    '말티즈',
    '푸들',
    '포메라니안',
    '진돗개',
    '시츄',
    '골든 리트리버',
    '치와와',
];

export default function AdoptionPost() {
    const { state } = useLocation(); // 📍 라우팅 state에서 petData 가져오기
    const navigate = useNavigate();
    const initialized = useRef(false); // 🌀 중복 초기화 방지용 ref

    // ✅ 펫 정보 파싱
    const petData = state?.petData || {};

    // ✅ 이미지 리스트 파싱 (,로 구분된 문자열 → 배열)
    const [uploadedFiles, setUploadedFiles] = useState([]); // 직접 올린 이미지들

    const imageList = uploadedFiles;

    // ✅ 털색 값 → color value 배열 변환
    const initialColor = useMemo(() => {
        const labels = (petData.coatColor || '').split('+');
        return colorOptions.filter((opt) => labels.includes(opt.label)).map((opt) => opt.value);
    }, [petData.coatColor]);

    // ✅ 성별 텍스트 변환
    const convertGender = (g) => (g === '남' ? '남아' : g === '여' ? '여아' : '');

    // ✅ 상태 정의
    const [petName, setPetName] = useState(petData.name || '');
    const [selectedBreed, setSelectedBreed] = useState(petData.breed || '');
    const [color, setColor] = useState(initialColor);
    const [gender, setGender] = useState(convertGender(petData.gender));
    const [neutered, setNeutered] = useState(petData.isNeutered || false);
    const [birthDate, setBirthDate] = useState(petData.birth ? new Date(petData.birth) : null);
    const [weight, setWeight] = useState(petData.weight || '');
    const [regNumber, setRegNumber] = useState(petData.registrationNumber || '');
    const [phone, setPhone] = useState('');
    const [isRegSheetOpen, setIsRegSheetOpen] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [search, setSearch] = useState('');

    // ✅ 유효성 검사
    const isPhoneValid = /^010\d{8}$/.test(phone);
    const isRegValid = /^\d{12}$/.test(regNumber);

    // ✅ 품종 리스트 필터링
    const filteredBreeds = useMemo(() => {
        const all = [...prioritizedBreeds, ...otherBreeds.sort((a, b) => a.localeCompare(b, 'ko'))];
        return search.trim() ? all.filter((b) => b.includes(search.trim())) : all;
    }, [search]);

    // ✅ 품종 선택 시 BottomSheet 토글
    const toggleSheet = () => setIsSheetOpen((prev) => !prev);

    // ✅ 이미지 삭제 핸들러
    const handleImageDelete = (urlToDelete) => {
        setUploadedFiles((prev) => prev.filter((img) => img.url !== urlToDelete));
    };

    // ✅ 앱에서 촬영 or 갤러리 선택 시 실행
    const getImageUrl = (path) => {
        if (!path) return '';
        const base = 'http://10.0.2.2:8080'; // 에뮬레이터에서 PC의 localhost를 바라보는 고정 주소
        return path.startsWith('http') ? path : `${base}${path}`;
    };

    let isImageUploadPopupOpen = false;

    // Morpheus 사진 업로드 함수
    const handleMorpheusImageUpload = () => {
        if (isImageUploadPopupOpen) {
            console.log('[이미지 업로드] 팝업이 이미 열려있습니다.');
            return;
        }
        isImageUploadPopupOpen = true;

        M.pop.alert({
            title: '사진 업로드',
            message: '원하는 방법을 선택하세요.',
            buttons: ['촬영하기', '취소', '앨범에서 선택'],
            callback: function (index) {
                isImageUploadPopupOpen = false;

                switch (parseInt(index, 10)) {
                    case 0:
                        openCamera();
                        break;
                    case 1:
                        console.log('[이미지 업로드] 취소');
                        break;
                    case 2:
                        openGallery();
                        break;
                    default:
                        console.log('[이미지 업로드] 알 수 없는 선택지');
                }
            },
        });
    };

    const openCamera = () => {
        M.media.camera({
            path: '/media',
            mediaType: 'PHOTO',
            saveAlbum: true,
            callback: handleResult,
        });
    };

    const openGallery = () => {
        M.media.picker({
            mode: 'SINGLE',
            mediaType: 'ALL',
            path: '/media',
            column: 3,
            callback: handleResult,
        });
    };

    const handleResult = (status, result) => {
        if (status !== 'SUCCESS' || !result.path) {
            alert('사진 선택 실패');
            return;
        }

        const path = result.fullpath || result.path;
        if (!/\.(jpg|jpeg|png|gif)$/i.test(path)) {
            alert('이미지 파일만 선택해주세요.');
            return;
        }

        uploadImage(path);
    };

    const uploadImage = (localPath) => {
        const fileExt = localPath.split('.').pop().toLowerCase();
        const mimeTypeMap = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
        };
        const mimeType = mimeTypeMap[fileExt] || 'image/jpeg';

        M.net.http.upload({
            url: `http://${window.location.hostname}:8080/api/adopt/image-upload`,
            method: 'POST',
            header: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: [
                {
                    name: 'file',
                    content: localPath,
                    type: 'FILE',
                },
            ],
            indicator: false,
            finish: (status, header, body) => {
                try {
                    const result = JSON.parse(body);
                    const uploadedPath = result.photoPath;

                    const fileObj = {
                        file: null,
                        url: getImageUrl(uploadedPath),
                    };
                    setUploadedFiles((prev) => [...prev, fileObj]);

                    console.log('🔥 업로드 성공:', result);
                } catch (e) {
                    console.error('🔥 응답 파싱 실패:', body);
                    alert('이미지 업로드 실패');
                }
            },
        });
    };

    // ✅ 컴포넌트 마운트 시 서버 이미지 있을 경우 미리보기 세팅
    useEffect(() => {
        if (petData?.image && uploadedFiles.length === 0) {
            const petImages = (petData.image || '')
                .split(',')
                .filter((url) => url.trim() !== '')
                .map((url) => ({
                    url: url.startsWith('http') ? url : getImageUrl(url),
                    file: null,
                }));
            setUploadedFiles(petImages);
        }
    }, [petData?.image]);

    // 추가 ---------------------
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const wrapperRef = useRef(null);
    const popularBreeds = ['믹스견', '말티즈', '푸들', '포메라니안', '진돗개', '시츄', '골든 리트리버', '치와와'];
    const [selectedPopularBreed, setSelectedPopularBreed] = useState('');

    // 초기 털색: petData.coatColor 기반
    const [selectedColors, setSelectedColors] = useState(initialColor);
    const toggleColor = (label) => {
        setSelectedColors((prev) => (prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]));
    };
    // 뷰용 털색 옵션 (이미지 src + 라벨)
    const furColorOptions = [
        [blackcircle, '검은색'],
        [whitecircle, '하얀색'],
        [silvercircle, '회색'],
        [browncircle, '브라운'],
        [darkgoldcircle, '어두운 골드'],
        [lightgoldcircle, '밝은 골드'],
    ];

    return (
        <div className="adoption-post">
            <div className="header">
                <button className="rp-back" onClick={() => navigate('/adoptionpost')}>
                    <IoIosArrowBack size={32} />
                </button>
                <h4>동물정보입력</h4>
            </div>

            <section className="profile-pics">
                <div className="w-88" style={{ display: 'flex' }}>
                    {imageList.length > 0 ? (
                        imageList.map((img, index) => (
                            <div
                                key={index}
                                className="profile-placeholder"
                                onClick={() => handleImageDelete(img.url)} // ✅ 이미지 클릭 시 삭제
                            >
                                <img
                                    src={img.url}
                                    alt={`pet-${index}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="profile-placeholder">
                            <FaCamera size={24} />
                            <span>사진</span>
                        </div>
                    )}

                    {[...Array(Math.max(0, 4 - imageList.length))].map((_, i) => (
                        <div key={i} className="add-pic" onClick={handleMorpheusImageUpload}>
                            <FaPlus size={24} />
                        </div>
                    ))}
                </div>
            </section>

            <form className="post-form">
                {/* 반려동물 이름 */}
                <div className="form-group">
                    <div className="w-88">
                        <label>
                            반려동물 이름<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="반려동물 이름을 입력하세요."
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="breed" ref={wrapperRef} style={{ marginLeft: '1.1%' }}>
                    <div className="breed-title">
                        강아지 품종<span className="required">*</span>{' '}
                        <div className="label-comment">품종은 한 개만 선택 가능합니다.</div>
                    </div>

                    <div className="bread-input-wrap">
                        <input
                            type="text"
                            className="bread-input"
                            placeholder={selectedBreed || '품종을 선택하세요'}
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
                                            setSelectedBreed(val);
                                            setSearch(val);
                                            setIsSuggestOpen(false);
                                            setSelectedPopularBreed('');
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
                                        setSelectedBreed(newSel);
                                        setIsSuggestOpen(false);
                                    }}
                                />
                                <span>{b}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group color-group">
                    <div className="w-88">
                        <label style={{ display: 'flex', marginTop: '16px' }}>
                            털색<span className="required">*</span>
                            <div className="label-comment">색상은 중복선택 가능합니다.</div>
                        </label>
                        <div className="color-container">
                            {furColorOptions.map(([src, label]) => {
                                const isSelected = selectedColors.includes(label);
                                return (
                                    <div
                                        key={label}
                                        className={`color-item ${isSelected ? 'selected' : ''}`}
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
                </div>

                {/* 성별 + 중성화 */}
                <div className="form-group gender-group">
                    <div className="w-88">
                        <label>
                            성별<span className="required">*</span>
                        </label>
                        <div className="gender-options">
                            <div
                                className={gender === '남아' ? 'gender-box-select' : 'gender-box'}
                                onClick={() => setGender((g) => (g === '남아' ? '' : '남아'))}
                            >
                                남아
                            </div>
                            <div
                                className={gender === '여아' ? 'gender-box-select' : 'gender-box'}
                                onClick={() => setGender((g) => (g === '여아' ? '' : '여아'))}
                            >
                                여아
                            </div>
                            <div
                                className={`sex-select ${neutered ? 'selected' : ''}`}
                                onClick={() => setNeutered((n) => !n)}
                            >
                                <div className="icon">✓</div>
                                <div className="label">중성화 했어요</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 생년 */}
                <div className="form-group">
                    <div className="w-88">
                        <label>
                            생일<span className="required">*</span>
                        </label>
                        <div className="react-datepicker__input-container">
                            <DatePicker
                                selected={birthDate}
                                onChange={(date) => setBirthDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="생년월일을 선택하세요"
                            />
                            <FaRegCalendarAlt className="date-picker-icon" />
                        </div>
                    </div>
                </div>

                {/* 몸무게 */}
                <div className="form-group">
                    <div className="w-88">
                        <label>
                            몸무게<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="몸무게를 입력하세요. 예) 4.3kg"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                </div>

                {/* 동물등록번호 */}
                <div className="form-group">
                    <div className="w-88">
                        <label>동물등록번호</label>
                        <button
                            type="button"
                            className="reg-button"
                            onClick={() => setIsRegSheetOpen(true)}
                            disabled={isVerified}
                        >
                            {isVerified ? '동물등록번호 인증완료' : '동물등록번호 인증하기'}
                        </button>
                    </div>
                </div>

                {/* type="button" 으로 바꿔서 form submit 방지 */}
                <button
                    type="button"
                    className="next-btn"
                    onClick={() => {
                        const token = localStorage.getItem('accessToken');
                        let userId = null;
                        if (token) {
                            try {
                                const base64Url = token.split('.')[1];
                                const decodedPayload = JSON.parse(atob(base64Url));
                                userId = decodedPayload.userId || decodedPayload.id || decodedPayload.sub;
                            } catch (error) {
                                console.error('JWT 디코딩 오류:', error);
                            }
                        }
                        const post = {
                            userId: userId,
                            petName,
                            breed: selectedBreed,
                            colors: selectedColors, // 배열
                            gender,
                            neutered,
                            birth: birthDate, // 💡 PostDetail은 birth라고 받음
                            weight,
                            registrationNo: regNumber,
                            petId: petData.id || null,
                            images: imageList, // 💡 PostDetail에서는 images 배열로 받음
                            isVerified,

                            // ✅ RegisterPost에서 이어서 사용할 값들
                            title: '',
                            comments: '',
                            adopt_location: '',
                            latitude: null,
                            longitude: null,
                            status: '분양중',
                        };
                        console.log('🟢 넘겨주는 post:', post);
                        navigate('/adoptionpost/add/details', {
                            state: { post },
                        });
                    }}
                >
                    다음
                </button>

                {/* 인증용 BottomSheet → Custom Overlay */}
                {isRegSheetOpen && (
                    <div className="sheet-overlay" onClick={() => setIsRegSheetOpen(false)}>
                        <div className="sheet-container" onClick={(e) => e.stopPropagation()}>
                            <div className="reg-sheet-header">
                                <div className="reg-select">동물등록번호 인증</div>
                                <button onClick={() => setIsRegSheetOpen(false)}>X</button>
                            </div>
                            <div className="reg-search">
                                <label>전화번호</label>
                                <input
                                    type="text"
                                    className="reg-input"
                                    placeholder="전화번호를 입력하세요 (010xxxxxxxx)"
                                    value={phone}
                                    onChange={(e) => {
                                        // 숫자만
                                        const digits = e.target.value.replace(/\D/g, '');
                                        setPhone(digits);
                                    }}
                                />
                                {!isPhoneValid && phone.length > 0 && (
                                    <p className="error-message">010으로 시작하는 11자리 숫자만 입력 가능합니다.</p>
                                )}

                                <label>동물등록번호</label>
                                <input
                                    type="text"
                                    className="reg-input"
                                    placeholder="동물등록번호 12자리"
                                    value={regNumber}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(/\D/g, '');
                                        setRegNumber(digits);
                                    }}
                                />
                                {!isRegValid && regNumber.length > 0 && (
                                    <p className="error-message">12자리 숫자만 입력 가능합니다.</p>
                                )}
                            </div>

                            <button
                                className="reg-submit"
                                disabled={!(isPhoneValid && isRegValid)}
                                onClick={() => {
                                    setIsVerified(true);
                                    setIsRegSheetOpen(false);
                                }}
                            >
                                인증하기
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
