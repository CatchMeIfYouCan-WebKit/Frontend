import React from 'react';

export default function EnterIdForPassword({ enteredId, setEnteredId, idError, checkIdExists }) {
    return (
        <div className="find-password-body">
            <h2>아이디 입력</h2>

            <input
                type="text"
                placeholder="아이디 입력"
                className="auth-input"
                value={enteredId}
                onChange={(e) => setEnteredId(e.target.value)}
            />

            {idError && <p className="error-message">{idError}</p>}

            <button className="btn orange" onClick={checkIdExists}>
                다음
            </button>
        </div>
    );
}
