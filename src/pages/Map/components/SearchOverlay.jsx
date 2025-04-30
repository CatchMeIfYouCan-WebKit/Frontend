import React, { useState } from 'react';
import { GoChevronLeft } from 'react-icons/go';

export default function SearchOverlay({ psRef, mapRef, exit }) {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);

    const search = (value) => {
        if (!psRef.current || !value.trim()) {
            setResults([]);
            return;
        }
        psRef.current.keywordSearch(value, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setResults(data);
            } else {
                setResults([]);
            }
        });
    };

    const handleSelect = (place) => {
        const loc = new window.kakao.maps.LatLng(place.y, place.x);
        mapRef.current.setCenter(loc);
        new window.kakao.maps.Marker({ map: mapRef.current, position: loc });
        exit();
    };

    return (
        <div className="search-overlay">
            <div className="search-input-wrapper">
                <button onClick={() => setIsSearchMode(false)} className="back-button">
                    <GoChevronLeft size={24} />
                </button>
                <input
                    autoFocus
                    type="text"
                    placeholder="주소를 검색하세요"
                    className="search-input"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        handleChange(e);
                    }}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <ul className="search-result-list">
                {results.map((place, idx) => (
                    <li key={idx} onClick={() => handleSelect(place)}>
                        <div className="search-result-title">{place.place_name}</div>
                        <div className="search-result-address">{place.road_address_name || place.address_name}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
