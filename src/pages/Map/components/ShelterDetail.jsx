//shelterDetail
import React, { useState } from 'react';
import '../ShelterDetail.css';
import dog1 from '../../../assets/수완강아지.jpeg';
import dog2 from '../../../assets/민규강아지.jpeg';
import tag from '../../../assets/tag.svg';
import change from '../../../assets/change.svg';
import tagdog from '../../../assets/tagdog.svg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function ShelterDetail() {
    const [activeTab, setActiveTab] = useState('adopted');
    const [listChange, setListChange] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const shelters = location.state?.shelters ?? [];
    const selectedShelter = location.state?.selectedShelter ?? null;
    const filteredAnimals = location.state?.filteredAnimals ?? [];



    return (
        <div className="shelter-detail">
            <h2 className="title">보호소 동물현황</h2>

            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={activeTab === 'adopted' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('adopted')}
                    >
                        입양동물
                    </button>
                    <button
                        className={activeTab === 'lost' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('lost')}
                    >
                        실종동물
                    </button>
                </div>
            </div>

            <div className="filters">
                <select className="filter">
                    <option>병원이름</option>
                </select>
                <select className="filter">
                    <option>나이</option>
                </select>
                <select className="filter">
                    <option>품종</option>
                </select>
                <select className="filter">
                    <option>체중</option>
                </select>
                <div className="tag-wrap" onClick={() => {
                    navigate('/shelterdetail/filter', {
                        state: {
                            shelters: shelters
                        }
                    });
                }}>
                    <img src={tag} alt="태그" className="tag-size" />
                </div>

            </div>

            <div className="list-header">
                <div className="post-count">
                    {filteredAnimals.length > 0
                        ? filteredAnimals.reduce((acc, shelter) => acc + (shelter.animalSummaries?.length || 0), 0)
                        : (selectedShelter?.animalSummaries?.length ?? 0)
                    }개의 게시글
                </div>

                <div
                    className={`sort-toggle ${!listChange ? 'reversed' : ''}`}
                    onClick={() => setListChange((prev) => !prev)}
                >
                    {listChange ? '최근작성순' : '오래된 순'}
                    <img src={change} alt="변경" />
                </div>
            </div>


            <div className="animal-grid">
                {(filteredAnimals.length > 0
                    ? filteredAnimals.flatMap(shelter =>
                        shelter.animalSummaries.map(animal => ({
                            ...animal,
                            shelterName: shelter.shelterName,
                            imageUrl: (animal.imageUrl?.split(';')[0] || '').trim(), // ✅ 여기
                        }))
                    )
                    : (selectedShelter?.animalSummaries ?? []).map(animal => ({
                        ...animal,
                        imageUrl: (animal.imageUrl?.split(';')[0] || '').trim(), // ✅ 여기도
                    }))
                ).map((animal, i) => (
                    <div key={i} className="animal-card">
                        <img
                            src={animal.imageUrl}
                            alt={animal.breed}
                            className="animal-img"
                            onClick={() =>
                                navigate('/animaldetail', {
                                    state: {
                                        animal,
                                        shelterName: animal.shelterName ?? selectedShelter?.shelterName,
                                    },
                                })
                            }
                        />
                        <div className="animal-info">
                            <div>{animal.breed}</div>
                            <div>{animal.coatColor}</div>
                            <div>{animal.gender}</div>
                        </div>
                    </div>
                ))}
            </div>



        </div>
    );
}
