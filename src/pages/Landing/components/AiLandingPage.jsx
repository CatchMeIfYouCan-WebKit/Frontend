import React from 'react';
import '../AiLandingPage.css';

export default function AiLandingPage() {
    return (
        <div className="ai-loading">
            <div className="dots">
                <div className="dot dot1" />
                <div className="dot dot2" />
                <div className="dot dot3" />
            </div>
            <div className="message">
                사진 분석중<span className="ellipsis">...</span>
            </div>{' '}
        </div>
    );
}
