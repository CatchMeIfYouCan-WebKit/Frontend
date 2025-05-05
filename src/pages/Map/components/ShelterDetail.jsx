import React, { useState } from 'react';
import '../ShelterDetail.css';
import dog1 from '../../../assets/수완강아지.jpeg';
import dog2 from '../../../assets/민규강아지.jpeg';
import tag from '../../../assets/tag.svg';
import change from '../../../assets/change.svg';
import tagdog from '../../../assets/tagdog.svg';
import { useNavigate } from 'react-router-dom';

export default function ShelterDetail() {
    const [activeTab, setActiveTab] = useState('adopted');
    const [listChange, setListChange] = useState(true);
    const navigate = useNavigate();

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
                <div className="tag-wrap" onClick={() => navigate('/shelterdetail/filter')}>
                    <img src={tag} alt="태그" className="tag-size" />
                </div>
            </div>

            <div className="list-header">
                <div className="post-count">{}개의 게시글</div>
                <div
                    className={`sort-toggle ${!listChange ? 'reversed' : ''}`}
                    onClick={() => setListChange((prev) => !prev)}
                >
                    {listChange ? '최근작성순' : '오래된 순'}
                    <img src={change} alt="변경" />
                </div>
            </div>

            <div className="animal-grid">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="animal-card">
                        <img
                            src={i % 2 === 0 ? dog1 : dog2}
                            alt={`동물 ${i + 1}`}
                            className="animal-img"
                            onClick={() => navigator('')}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
