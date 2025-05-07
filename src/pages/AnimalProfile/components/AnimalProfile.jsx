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
const otherBreeds = ['비숑 프리제', '진돗개', '퍼그', '요크셔테리어'];
const allBreeds = [...prioritizedBreeds, ...otherBreeds.sort((a, b) => a.localeCompare(b, 'ko'))];
const isWeb = typeof window !== 'undefined' && window.location;

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

    const handleMorpheusImageUpload = () => {
        const userChoice = confirm('사진을 촬영하시겠습니까?');

        const callback = (status, result) => {
            if (status === 'SUCCESS') {
                if (!result.path || result.size < 10000) {
                    alert('유효한 이미지가 아닙니다.');
                    return;
                }

                setMorpheusImagePath(result.fullpath || result.path);
                setPreviewUrl(result.fullpath || result.path); // 미리보기 표시
                console.log('🖼 선택된 이미지 경로:', result.fullpath || result.path);
            } else {
                alert('사진 선택 실패 또는 취소됨');
            }
        };

        if (userChoice) {
            M.media.camera({
                path: '/media',
                mediaType: 'PHOTO',
                saveAlbum: true,
                callback,
            });
        } else {
            M.media.picker({
                mode: 'SINGLE',
                mediaType: 'ALL',
                path: '',
                column: 3,
                callback: async (status, result) => {
                    if (status === 'SUCCESS') {
                        const imagePath = result.fullpath || result.path;
                        setMorpheusImagePath(imagePath);

                        try {
                            const response = await fetch(imagePath);
                            const blob = await response.blob();
                            const objectURL = URL.createObjectURL(blob);
                            setPreviewUrl(objectURL);
                            alert('사진 선택 완료');
                            console.log('status: ', status);
                            console.log('result: ', result);
                        } catch (error) {
                            console.error('이미지 미리보기 로딩 실패:', error);
                            alert('사진 미리보기에 실패했습니다.');
                        }
                    } else {
                        alert('사진 선택 실패');
                    }
                },
            });
            console.log('morpheusImagePath:', morpheusImagePath);
            console.log('파일 존재 여부:', !!morpheusImagePath && morpheusImagePath.endsWith('.jpg'));
        }
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
            registrationNumber: registrationNo || '미등록',
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
                setPreviewUrl(getImageUrl(pet.photoPath)); // 기존 사진 유지
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
        if (photoPath) {
            setPreviewUrl(getImageUrl(photoPath));
        }
    }, [photoPath]);

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
                        <button type="button" onClick={handleMorpheusImageUpload}>
                            {previewUrl ? (
                                // <img src={previewUrl} alt="preview" className="photo-preview" />
                                <AiOutlineCamera
                                    className="camera-icon"
                                    id="camera-icon"
                                    style={{ color: '#f5a623' }}
                                />
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
