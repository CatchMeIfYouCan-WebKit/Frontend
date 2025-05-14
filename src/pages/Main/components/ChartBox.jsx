// src/components/ChartBox.jsx
import React from 'react';
import '../ChartBox.css';

const data = [
    { name: '입양', value: 250, color: '#D9D9D9' },
    { name: '반환', value: 604, color: '#D9D9D9' },
    { name: '보호중', value: 7782, color: '#D9D9D9' },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

export default function StatBox() {
    return (
        <>
            <div className="stat-bars-vertical">
                {data.map((item) => {
                    const percentage = (item.value / total) * 100;
                    return (
                        <div className="stat-bar-column" key={item.name}>
                            <div className="progress-bar-vertical">
                                <div
                                    className="progress-fill-vertical"
                                    style={{ height: `${percentage}%`, backgroundColor: item.color }}
                                ></div>
                            </div>
                            <div className="stat-label-vertical">
                                <span>
                                    {item.name}
                                    <br />
                                    {item.value}마리
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
