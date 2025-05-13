import React from 'react';
import arrowIcon from '../../../assets/arrow.svg';

const RecordBox = () => {
    return (
        <div className="record-box">
            <div className="record-header">
                <span className="room-name">비대면 진료실</span>
                <span className="user-name">아스피린 님</span>
            </div>
            <div className="record-footer">
                <span className="appointment-time">16:00 진료예정</span>
                <div className="enter-icon-wrapper">
                    <img src={arrowIcon} alt="입장" className="arrow-icon" />
                </div>
            </div>
        </div>
    );
};

export default RecordBox;
