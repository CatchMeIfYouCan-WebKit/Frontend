// src/pages/ShelterDetail.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import '../ShelterDetail.css';
import tag from '../../../assets/tag.svg';
import change from '../../../assets/change.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import a from '../../../assets/1.png';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';

// 필터명 길이가 4를 넘어가면 ... 추가
const TRUNCATE_LEN = 4;
function truncateLabel(label) {
    return label.length > TRUNCATE_LEN ? `${label.slice(0, TRUNCATE_LEN - 1)}...` : label;
}

export default function ShelterDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    // 백엔드 api 요청
    const [shelters, setShelters] = useState([]);

    // 필터 선택값
    const [selectedShelterName, setSelectedShelterName] = useState(location.state?.selectedShelters ?? []);
    const [selectedBreed, setSelectedBreed] = useState(location.state?.selectedBreeds ?? []);
    const [selectedColor, setSelectedColor] = useState(location.state?.selectedColors ?? []);
    const [selectedGender, setSelectedGender] = useState(location.state?.selectedGenders ?? []);

    // 최신순, 오래된순
    const [isLatest, setIsLatest] = useState(true);

    // 필터 라벨
    const shelterLabel = selectedShelterName.length ? selectedShelterName.join(', ') : '보호소이름';
    const breedLabel = selectedBreed.length ? selectedBreed.join(', ') : '품종';
    const colorLabel = selectedColor.length ? selectedColor.join(', ') : '털색';
    const genderLabel = selectedGender.length ? selectedGender.join(', ') : '성별';

    // ============================================================================== 함수 시작
    // 필터 화면으로 이동
    const onClickFilter = () => {
        navigate('/shelterdetail/filter', {
            state: {
                shelters,
                selectedShelterName,
                selectedBreed,
                selectedColor,
                selectedGender,
            },
        });
    };

    // 필터 적용
    const filteredShelters = shelters.filter((shelter) => {
        // 보호소 이름
        if (selectedShelterName.length > 0 && !selectedShelterName.includes(shelter.shelterName)) {
            return false;
        }
        // 품종
        if (selectedBreed.length > 0 && !selectedBreed.includes(shelter.breed)) {
            return false;
        }
        // 색상 (한 글자만 포함돼도 적용)
        if (
            selectedColor.length > 0 &&
            !selectedColor.some((color) => {
                return (
                    shelter.coatColor?.includes(color) || color.split('').some((c) => shelter.coatColor?.includes(c))
                );
            })
        ) {
            return false;
        }
        // 성별
        if (selectedGender.length > 0 && !selectedGender.includes(shelter.gender)) {
            return false;
        }
        return true;
    });

    // 날짜 정렬
    const sortedSheltersByDate = [...filteredShelters].sort((a, b) => {
        const dateA = new Date(a.rescueDate); // 날짜 필드명 맞게 수정!
        const dateB = new Date(b.rescueDate);

        return isLatest ? dateB - dateA : dateA - dateB;
    });
    // ============================================================================== 함수 종료
    // ============================================================================== useEffect 시작
    // 데이터 호출 (컴포넌트 렌더링 시 한 번만 호출)
    useEffect(() => {
        axios
            .get('/api/map/shelter-missing')
            .then((res) => {
                console.log('보호소 백엔드 응답: ', res.data);
                res.data.forEach((item, index) => {});
                setShelters(res.data);
            })
            .catch((err) => console.error('보호소 API 요청 실패:', err));
    }, []);

    // 필터 동기화
    useEffect(() => {
        if (location.state) {
            console.log('[필터 적용 후 돌아온 값]', {
                selectedShelterName: location.state.selectedShelterName,
                selectedBreed: location.state.selectedBreed,
                selectedColor: location.state.selectedColor,
                selectedGender: location.state.selectedGender,
            });
        }

        if (location.state?.selectedShelterName) setSelectedShelterName(location.state.selectedShelterName);
        if (location.state?.selectedBreed) setSelectedBreed(location.state.selectedBreed);
        if (location.state?.selectedColor) setSelectedColor(location.state.selectedColor);
        if (location.state?.selectedGender) setSelectedGender(location.state.selectedGender);
    }, [location.state]);

    // ============================================================================== useEffect 종료
    return (
        <div className="shelter-detail">
            <div className="shelter-detail-header">
                <IoIosArrowBack size={36} className="back-icon4" onClick={() => navigate('/main')} />
                <h2 className="header-title4">보호소 동물현황</h2>
            </div>

            {/* 필터 요약 */}
            <div className="filters">
                <div className={`filter ${shelterLabel !== '보호소이름' ? 'applied' : ''}`}>
                    {truncateLabel(shelterLabel)}
                </div>
                <div className={`filter ${colorLabel !== '털색' ? 'applied' : ''}`}>{truncateLabel(colorLabel)}</div>
                <div className={`filter ${breedLabel !== '품종' ? 'applied' : ''}`}>{truncateLabel(breedLabel)}</div>
                <div className={`filter ${genderLabel !== '성별' ? 'applied' : ''}`}>{truncateLabel(genderLabel)}</div>
                <div className="tag-wrap" onClick={onClickFilter}>
                    <img src={tag} alt="태그" className="tag-size" />
                </div>
            </div>

            {/* 게시글 개수 & 날짜 정렬 */}
            <div className="list-header">
                <div className="post-count">
                    {shelters.length > 0 ? `${filteredShelters.length}개의 게시글` : '0개의 게시글'}
                </div>
                <div className={`sort-toggle ${!isLatest ? 'reversed' : ''}`} onClick={() => setIsLatest((p) => !p)}>
                    {isLatest ? '최신순' : '오래된순'}
                    <img src={change} alt="변경" />
                </div>
            </div>

            {/* 동물 카드 그리드 */}
            <div className="animal-grid">
                {sortedSheltersByDate.map((shelter, i) => (
                    <div
                        key={i}
                        className="animal-card"
                        onClick={() =>
                            navigate(`/shelterdetail/${shelter.id}`, {
                                state: { shelter },
                            })
                        }
                    >
                        <img
                            src={shelter.imageUrl}
                            alt={shelter.breed}
                            className="animal-img"
                            onError={(e) => {
                                console.log('이미지 로드 실패:', shelter.imageUrl);
                                e.target.src = a;
                            }}
                        />
                        <div className="animal-details">
                            <div className="shelter-name">{shelter.shelterName}</div>
                            <div className="animal-info">
                                <div>품종: {shelter.breed}</div>
                                <div>색상: {shelter.coatColor}</div>
                                <div>성별: {shelter.gender}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
