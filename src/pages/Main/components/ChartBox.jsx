// src/components/StatBox.jsx
import React from 'react';
import '../ChartBox.css';

const data = [
    { name: '입양', value: 200, color: '#86efac' },
    { name: '반환', value: 604, color: '#60a5fa' },
    { name: '보호중', value: 7782, color: '#f97316' },
    { name: '안락사', value: 400, color: '#f87171' },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

export default function StatBox() {
    return (
        <div className="stat-box-container">
            <h4 className="stat-title">전체 구조동물수 {total.toLocaleString()}마리</h4>
            <div className="stat-bars">
                {data.map((item) => {
                    const percentage = (item.value / total) * 100;
                    return (
                        <div className="stat-item" key={item.name}>
                            <div className="stat-label">
                                <span>{item.name}</span>
                                <span>{item.value}마리</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${percentage}%`, backgroundColor: item.color }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
