import React, { useState, useMemo, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineCamera } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BottomSheet from '../../Map/components/BottomSheet';
import '../animalProfile.css';
import downbtn from '../../../assets/downbtn.svg';
import checkOn from '../../../assets/checkOn.svg';
import checkOff from '../../../assets/checkOff.svg';
import x from '../../../assets/x.svg';
import axios from 'axios';
import blackcircle from '../../../assets/blackcircle.svg';
import lightgoldcircle from '../../../assets/lightgoldcircle.svg';
import silvercircle from '../../../assets/silvercircle.svg';
import browncircle from '../../../assets/browncircle.svg';
import darkgoldcircle from '../../../assets/darkgoldcircle.svg';
import whitecircle from '../../../assets/whitecircle.svg';
import { FaCheck } from 'react-icons/fa';
import BackHeader from '../../../shared/BackHeader/components/BackHeader';
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
const allBreeds = [...prioritizedBreeds, ...otherBreeds.sort((a, b) => a.localeCompare(b, 'ko'))];

const colorMap = {
    검은색: '#000000',
    하얀색: '#F1F1F1',
    회색: '#808080',
    브라운: '#A52A2A',
    붉은색: '#FF0000',
    골드: '#FFD700',
};
const colorList = Object.keys(colorMap);

const getImageUrl = (path) => {
    if (!path) return '';
    const host = window.location.hostname;
    const port = 8080;
    return `http://${host}:${port}${path}`;
};

export default function AnimalProfile() {
    const location = useLocation();
    const isEditMode = location.state?.mode === 'edit';
    const pet = location.state?.pet;

    const navigate = useNavigate();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isRegSheetOpen, setIsRegSheetOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBreed, setSelectedBreed] = useState(pet?.breed || '강아지 품종을 선택해주세요');
    const [selectedColors, setSelectedColors] = useState(pet?.coatColor?.split(',') || []);
    const [gender, setGender] = useState(pet?.gender || '');
    const [isNeutered, setIsNeutered] = useState(pet?.isNeutered || false);
    const [birth, setBirth] = useState(pet?.dateOfBirth ? new Date(pet.dateOfBirth) : null);
    const [weight, setWeight] = useState(pet?.weight?.toString() || '');
    const [registrationNo, setRegistrationNo] = useState(pet?.registrationNumber || '');
    const [owner, setOwner] = useState('');
    const [regNumberError, setRegNumberError] = useState('');
    const [ownerError, setOwnerError] = useState('');
    const [name, setName] = useState(pet?.name || '');
    const [file, setFile] = useState(null); // 사진
    const [previewUrl, setPreviewUrl] = useState(pet?.photoPath ? getImageUrl(pet.photoPath) : null);
    const [isVerified, setIsVerified] = useState(isEditMode && pet?.registrationNumber ? true : false);
    const [photoPath, setPhotoPath] = useState(pet?.photoPath || '');
    const [morpheusImagePath, setMorpheusImagePath] = useState(null);

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

    let isImageUploadPopupOpen = false;

    // 사진 업로드
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
        M.media.camera({ path: '/media', mediaType: 'PHOTO', saveAlbum: true, callback: handleResult });
    };

    const openGallery = () => {
        M.media.picker({ mode: 'SINGLE', mediaType: 'ALL', path: '/media', column: 3, callback: handleResult });
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
        const uploadUrl = `http://${window.location.hostname}:8080/api/animal-profile/image-upload`;

        M.net.http.upload({
            url: uploadUrl,
            method: 'POST',
            header: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: [{ name: 'file', content: localPath, type: 'FILE' }],
            indicator: false,
            finish: (status, header, body) => {
                const result = JSON.parse(body);
                const uploadedPath = result.photoPath;

                setMorpheusImagePath(uploadedPath);
                setPreviewUrl(getImageUrl(uploadedPath));

                console.log('🔥 업로드 완료:', uploadedPath);
            },
        });
    };

    // 프로필 등록 api 호출
    const handleProfileSubmit = async () => {
        if (!morpheusImagePath || !previewUrl) {
            alert('프로필 사진을 등록해주세요.');
            return;
        }
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }
        if (!selectedBreed || selectedBreed === '강아지 품종을 선택해주세요') {
            alert('품종을 선택해주세요.');
            return;
        }
        if (selectedColors.length === 0) {
            alert('털색을 선택해주세요.');
            return;
        }
        if (!birth) {
            alert('생일을 선택해주세요.');
            return;
        }
        if (!weight.trim()) {
            alert('몸무게를 입력해주세요.');
            return;
        }

        const petData = {
            name,
            breed: selectedBreed,
            coatColor: selectedColors.join(','),
            gender,
            isNeutered,
            dateOfBirth: birth.toISOString().split('T')[0],
            age: new Date().getFullYear() - birth.getFullYear(),
            weight: parseFloat(weight.replace('kg', '')),
            registrationNumber: registrationNo.trim() ? registrationNo : null,
            photoPath: morpheusImagePath,
        };

        console.log('🚀 등록 버튼 클릭됨');
        console.log('업로드 데이터:', petData);
        console.log('업로드 이미지 경로:', morpheusImagePath);

        try {
            let fileToUpload = null;

            // 파일 경로를 fetch로 읽어오기
            if (morpheusImagePath) {
                const response = await fetch(morpheusImagePath);
                const blob = await response.blob();
                fileToUpload = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            } else if (isEditMode && previewUrl?.startsWith('http')) {
                const response = await fetch(previewUrl);
                const blob = await response.blob();
                fileToUpload = new File([blob], 'profile.jpg', { type: blob.type });
            } else {
                alert('프로필 사진을 등록해주세요.');
                return;
            }

            const host = window.location.hostname;
            const url = isEditMode
                ? `http://${host}:8080/api/animal-profile/${pet.id}`
                : `http://${host}:8080/api/animal-profile`;
            const fileList = [
                {
                    name: 'file',
                    content: morpheusImagePath,
                    type: 'FILE',
                },
            ];
            console.log('파일 전송 리스트:', fileList);

            M.net.http.upload({
                url,
                header: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
                params: {
                    pet: JSON.stringify(petData),
                },
                body: fileList,
                method: isEditMode ? 'PUT' : 'POST',
                encoding: 'UTF-8',
                indicator: false,
                finish: function (status, header, body) {
                    console.log('status:', status);
                    console.log('body:', body);
                    if (status === 'SUCCESS' || status == 200) {
                        alert(isEditMode ? '수정 성공!' : '내 강아지 등록 성공!');
                        navigate('/main');
                    } else {
                        alert('업로드 실패: ' + JSON.stringify(body));
                    }
                },
                progress: function (total, current) {
                    console.log('업로드 진행 중:', total, current);
                },
            });
        } catch (e) {
            console.error('이미지 fetch 실패:', e);
            alert('이미지를 처리하는 중 오류가 발생했습니다.');
        }
    };

    const handleRegSubmit = async () => {
        let isValid = true;

        if (!registrationNo.trim()) {
            setRegNumberError('동물등록번호를 입력해주세요.');
            isValid = false;
        } else {
            setRegNumberError('');
        }

        if (!owner.trim()) {
            setOwnerError('보호자 이름을 입력해주세요.');
            isValid = false;
        } else {
            setOwnerError('');
        }

        if (!isValid) return;

        try {
            const res = await axios.get('/api/animal-profile/checkRegistrationNo', {
                params: { registrationNo },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (res.data.exists) {
                alert('이미 등록된 동물등록번호입니다.');
                return;
            }

            // 등록번호 사용 가능
            console.log('인증 성공:', registrationNo, owner);
            setIsVerified(true);
            setIsRegSheetOpen(false);
        } catch (err) {
            if (err.response?.status === 401) {
                alert('로그인이 필요합니다.');
            } else {
                console.error('중복 검사 실패:', err);
                alert('등록번호 중복 확인 중 오류가 발생했습니다.');
            }
        }
    };

    // 입력값 자동 유효성 검사 제거
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (registrationNo.trim()) setRegNumberError('');
        }, 1000);
        return () => clearTimeout(timeout);
    }, [registrationNo]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (owner.trim()) setOwnerError('');
        }, 1000);
        return () => clearTimeout(timeout);
    }, [owner]);

    useEffect(() => {
        if (!file) {
            if (isEditMode && pet?.photoPath) {
                setMorpheusImagePath(pet.photoPath);
                setPreviewUrl(getImageUrl(pet.photoPath));
            } else {
                setPreviewUrl(null);
            }
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file, isEditMode, pet]);

    useEffect(() => {
        console.log('📸 previewUrl:', previewUrl);
    }, [previewUrl]);

    return (
        <div className="animal-profile">
            <BackHeader title="강아지 프로필 등록" />

            <div className="animal-profile-content">
                <div className="form-group photo-group">
                    <label>프로필 사진</label>
                    <div className="photo-upload">
                        <button type="button" onClick={handleMorpheusImageUpload}>
                            {previewUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={previewUrl} alt="사진 미리보기" className="animal-photo-preview" />
                                    <button
                                        type="button"
                                        className="animal-photo-remove-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setPreviewUrl(null);
                                            setMorpheusImagePath(null);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <AiOutlineCamera
                                    className="camera-icon"
                                    id="camera-icon"
                                    style={{ color: 'lightgray' }}
                                />
                            )}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        반려동물 이름 <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="반려동물 이름 입력"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                        <span className="pet-color-comment">털 색상이 한 가지가 아닌경우 중복 선택 가능합니다.</span>
                    </label>
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
                        <span className="pet-color-comment">kg으로 입력해주세요.</span>
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
                    <button
                        className={`reg-button ${isVerified ? 'verified' : ''}`}
                        onClick={openRegSheet}
                        disabled={isVerified}
                    >
                        {isVerified ? '동물등록번호 인증완료' : '동물등록번호 인증하기'}
                    </button>
                    <p className="reg-hint">동물등록번호는 나중에 입력할 수 있습니다.</p>
                </div>
            </div>

            <button className="submit-button" onClick={handleProfileSubmit}>
                {isEditMode ? '프로필 수정' : '프로필 등록'}{' '}
            </button>

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
                    <div className="reg-sheet-header">
                        <div className="reg-select">동물등록번호 인증</div>
                        <button onClick={closeRegSheet}>
                            <img src={x} alt="x" />
                        </button>
                    </div>
                    <div className="reg-search">
                        <label>동물등록번호</label>
                        <input
                            type="text"
                            className="reg-input"
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                            placeholder="동물등록번호를 입력하세요"
                        />
                        {regNumberError && <p className="error-message">{regNumberError}</p>}

                        <label>보호자</label>
                        <input
                            type="text"
                            className="reg-input"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            placeholder="보호자 이름을 입력하세요"
                        />
                        {ownerError && <p className="error-message">{ownerError}</p>}
                    </div>
                    <button className="reg-submit" onClick={handleRegSubmit}>
                        인증하기
                    </button>
                </BottomSheet>
            )}
        </div>
    );
}
