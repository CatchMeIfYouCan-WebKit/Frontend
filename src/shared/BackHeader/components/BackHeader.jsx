import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../BackHeader.css';
export default function BackHeader({ title = '' }) {
    const navigate = useNavigate();

    return (
        <header className="back-header">
            <div className="back-left" onClick={() => navigate(-1)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="20"
                    viewBox="0 0 12 20"
                    fill="none"
                    className="back-icon"
                >
                    <path
                        d="M11.2852 1.77441L3.26758 9.64355L2.9043 10L3.26758 10.3564L11.2852 18.2246L10.1904 19.2998L0.712891 10L10.1904 0.699219L11.2852 1.77441Z"
                        fill="#31363F"
                        stroke="#31363F"
                        strokeWidth="1"
                    />
                </svg>
                <span className="back-title">{title}</span>
            </div>
        </header>
    );
}
