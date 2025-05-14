// src/pages/reservation/components/ReservationFormPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../reservation/ReservationPage.css';
import Footer from '../../../shared/Footer/Footer';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const today = new Date();

const times = [
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
];

export default function ReservationFormPage() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState('');
    const [method, setMethod] = useState('대면');
    const [purpose, setPurpose] = useState('');

    const generateDates = () => {
        const list = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            list.push({
                day: weekdays[d.getDay()],
                date: d.getDate(),
                isToday: i === 0,
            });
        }
        return list;
    };

    const handleSubmit = () => {
        alert(`예약 완료: ${generateDates()[selectedDate].date}일, ${selectedTime}, ${method}, 목적: ${purpose}`);
    };

    return (
        <div className="reservation-page">
            <header className="reservation-header">
                <button onClick={() => navigate(-1)} className="reservation-back-button">
                    ←
                </button>
                <h1>진료예약</h1>
            </header>

            <main className="reservation-main">
                <section className="reservation-section">
                    <h2>날짜 선택</h2>
                    <div className="reservation-date-row">
                        {generateDates().map((item, index) => (
                            <div
                                key={index}
                                className={`reservation-date-item ${selectedDate === index ? 'active' : ''}`}
                                onClick={() => setSelectedDate(index)}
                            >
                                <div
                                    className={`reservation-day-text ${
                                        ['월', '화', '수', '목', '금'].includes(item.day) ? 'weekday-style' : ''
                                    }`}
                                >
                                    {item.day}
                                </div>
                                <div className="reservation-day-number">{item.date}</div>
                                {item.isToday && <div className="reservation-today-label">오늘</div>}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="reservation-section">
                    <h2>시간 선택</h2>
                    <div className="reservation-time-grid">
                        {times.map((time) => (
                            <button
                                key={time}
                                className={`reservation-time-button ${selectedTime === time ? 'selected' : ''}`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="reservation-section">
                    <h2>진료방법</h2>
                    <div className="reservation-method-buttons">
                        {['대면', '비대면'].map((m) => (
                            <button
                                key={m}
                                className={`reservation-method-button ${method === m ? 'active' : ''}`}
                                onClick={() => setMethod(m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    {method === '비대면' && (
                        <p className="reservation-method-note">
                            비대면의 경우 앱에 등록된 수의사에 한하여 조진 후 이용하실 수 있습니다.
                        </p>
                    )}
                </section>

                <section className="reservation-section">
                    <h2>방문목적</h2>
                    <textarea
                        className="reservation-purpose-input"
                        placeholder="예: 예방접종, 피부병 상담 등"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                    />
                </section>
            </main>

            <footer className="reservation-footer">
                <button className="reservation-submit" onClick={handleSubmit}>
                    예약하기
                </button>
            </footer>
        </div>
    );
}
