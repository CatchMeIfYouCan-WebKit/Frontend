// src/pages/ShelterDetail.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import '../ShelterDetail.css';
import tag from '../../../assets/tag.svg';
import change from '../../../assets/change.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import a from '../../../assets/1.png';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';

export default function ShelterDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    // 백엔드 api 요청
    const [shelters, setShelters] = useState([]);

    // 부모에서 넘겨받은 데이터
    const selectedShelter = location.state?.selectedShelter ?? null;

    // 필터 선택값
    const initialShelterFilters = location.state?.selectedShelters ?? [];
    const initialBreedFilters = location.state?.selectedBreeds ?? [];
    const initialColorFilters = location.state?.selectedColors ?? [];
    const initialGenderFilters = location.state?.selectedGenders ?? [];

    // 탭, 정렬 상태
    const [activeTab, setActiveTab] = useState('lost');
    const [listChange, setListChange] = useState(true);

    // 필터 레이블
    const [shelterLabel] = useState(initialShelterFilters.length > 0 ? initialShelterFilters.join(', ') : '보호소이름');
    const [breedLabel] = useState(initialBreedFilters.length > 0 ? initialBreedFilters.join(', ') : '품종');
    const [colorLabel] = useState(initialColorFilters.length > 0 ? initialColorFilters.join(', ') : '털색');
    const [genderLabel] = useState(initialGenderFilters.length > 0 ? initialGenderFilters.join(', ') : '성별');

    // 필터 화면으로 이동할 때 selectedShelter만 넘기기
    const onClickFilter = () => {
        navigate('/shelterdetail/filter', {
            state: {
                selectedShelter,
                currentTab: activeTab,
                selectedShelters: initialShelterFilters,
                selectedBreeds: initialBreedFilters,
                selectedColors: initialColorFilters,
                selectedGenders: initialGenderFilters,
            },
        });
    };

    const TRUNCATE_LEN = 4;
    function truncateLabel(label) {
        return label.length > TRUNCATE_LEN ? `${label.slice(0, TRUNCATE_LEN - 1)}...` : label;
    }

    // ============================================================================== useEffect 시작
    // 데이터 호출 (컴포넌트 렌더링 시 한 번만 호출)
    useEffect(() => {
        axios
            .get('/api/map/shelter-missing')
            .then((res) => {
                console.log('백엔드 응답: ', res.data);
                res.data.forEach((item, index) => {});
                setShelters(res.data); // 바로 응답 데이터를 저장
            })
            .catch((err) => console.error('[API] 보호소 API 요청 실패:', err));
    }, []);
    // ============================================================================== useEffect 종료

    return (
        <div className="shelter-detail">
            <div className="shelter-detail-header">
                <IoIosArrowBack size={24} className="back-icon4" onClick={() => navigate(-1)} />
                <h2 className="header-title4">보호소 동물현황</h2>
            </div>
            {/* 탭 */}
            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={activeTab === 'lost' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('lost')}
                    >
                        가족을 찾는 친구들
                    </button>
                </div>
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
                    {shelters.length > 0 ? `${shelters.length}개의 게시글` : '0개의 게시글'}
                </div>
                <div
                    className={`sort-toggle ${!listChange ? 'reversed' : ''}`}
                    onClick={() => setListChange((p) => !p)}
                >
                    {listChange ? '최근작성순' : '오래된 순'}
                    <img src={change} alt="변경" />
                </div>
            </div>

            {/* 동물 카드 그리드 */}
            <div className="animal-grid">
                {shelters.map((shelter, i) => (
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
                                e.target.src = a; // 대체 이미지
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
