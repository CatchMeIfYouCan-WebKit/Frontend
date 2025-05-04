import React, { useState } from 'react';
import '../ShelterDetail.css';
import dog1 from '../../../assets/수완강아지.jpeg';
import dog2 from '../../../assets/민규강아지.jpeg';
import tag from '../../../assets/tag.svg';

export default function ShelterDetail() {
    const [activeTab, setActiveTab] = useState('adopted');

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
                <div className='tag-wrap'>
                    <img src={tag} alt="태그" className='tag-size'/>
                </div>
            </div>

            <div className="controls">
                <div className="count-sort">
                    <span className="count">2,561 개</span>
                    <button className="sort">최신작성순 ⇅</button>
                </div>
            </div>

            <div className="animal-grid">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="animal-card">
                        <img src={i % 2 === 0 ? dog1 : dog2} alt={`동물 ${i + 1}`} className="animal-img" onClick={()=>navigator('')}/>
                    </div>
                ))}
            </div>
        </div>
    );
}
