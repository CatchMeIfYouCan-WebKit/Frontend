// src/pages/AdoptionPostEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import '../AdoptionPostEdit.css';
import { FaPlus } from 'react-icons/fa';

export default function AdoptionPostEdit() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { post } = state || {};
  const fileInputRef = useRef(null);

  // 잘못된 접근 방지
  useEffect(() => {
    if (!post) navigate(-1);
  }, [post, navigate]);

  // form 상태
  const [petName, setPetName] = useState(post?.name || '');
  const [weight, setWeight] = useState(post?.weight || '');
  const [comment, setComment] = useState(post?.description || post?.comments || '');
  const [neutered, setNeutered] = useState(post?.neutered || false);

  // 이미지 상태: 기존 URL 목록, 새로 선택한 File 목록
  const rawImages = Array.isArray(post?.photoPaths)
    ? post.photoPaths.map(path =>
      path.startsWith('http') ? path : `http://localhost:8080${path}`
    )
    : typeof post?.image === 'string'
      ? post.image.split(',').map(img => img.trim()).filter(Boolean)
      : [];

  const [existingImages, setExistingImages] = useState(rawImages);

  const [newFiles, setNewFiles] = useState([]);

  // 이미지 미리보기 URL 목록
  const previews = [
    ...existingImages.map(url => ({ type: 'url', src: url })),
    ...newFiles.map(file => ({ type: 'file', src: URL.createObjectURL(file), file }))
  ];

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    const slots = 4 - existingImages.length - newFiles.length;
    if (slots <= 0) return;
    const toAdd = files.slice(0, slots);
    setNewFiles(f => [...f, ...toAdd]);
    e.target.value = '';
  };

  const handleRemove = index => {
    const item = previews[index];
    if (item.type === 'url') {
      setExistingImages(imgs => imgs.filter((_, i) => i !== index));
    } else {
      // file index = index - existingImages.length
      setNewFiles(files => files.filter((_, i) => i !== index - existingImages.length));
    }
  };

  // 지도 & 마커 생략… (이전 코드 그대로)
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState({
    lat: post?.latitude ?? 37.5665,
    lng: post?.longitude ?? 126.9780,
  });
  const [address, setAddress] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=9402031e36074f7a2da9f3094bc383e7&autoload=false&libraries=services';
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        const kakao = window.kakao;
        const container = mapRef.current;
        const map = new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(coords.lat, coords.lng),
          level: 4,
        });
        const geocoder = new kakao.maps.services.Geocoder();
        markerRef.current = new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(coords.lat, coords.lng),
        });
        geocoder.coord2Address(coords.lng, coords.lat, (res, status) => {
          if (status === kakao.maps.services.Status.OK && res[0]) {
            setAddress(res[0].address.address_name);
          }
        });
        const placeMarker = latLng => {
          markerRef.current && markerRef.current.setMap(null);
          markerRef.current = new kakao.maps.Marker({ map, position: latLng });
          const lat = latLng.getLat(), lng = latLng.getLng();
          setCoords({ lat, lng });
          geocoder.coord2Address(lng, lat, (r, s) => {
            if (s === kakao.maps.services.Status.OK && r[0]) {
              setAddress(r[0].address.address_name);
            }
          });
        };
        kakao.maps.event.addListener(map, 'click', e => placeMarker(e.latLng));
        kakao.maps.event.addListener(map, 'rightclick', e => placeMarker(e.latLng));
      });
    };
    return () => document.head.removeChild(script);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const total = existingImages.length + newFiles.length;
    if (total < 1) {
      alert('최소 1개의 이미지를 유지해야 합니다.');
      return;
    }

    const formData = new FormData();

    // ✅ adopt JSON 생성
    const adoptData = {
      name: petName,
      weight,
      comments: comment,
      isNeutered: neutered,
      latitude: coords.lat,
      longitude: coords.lng,
    };

    // ✅ adopt JSON을 문자열로 첨부
    formData.append('adopt', JSON.stringify(adoptData));

    // ✅ 기존 이미지 URL도 JSON 배열로 전달 (백엔드에서 @RequestParam 등으로 받도록 구현되어야 함)
    formData.append('keepImages', JSON.stringify(existingImages));

    // ✅ 새 이미지 파일 추가
    newFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      await axios.put(`/api/adopt/${post.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('수정에 실패했습니다.');
    }
  };



  return (
    <div className="ape-page">
      <header className="ape-header">
        <button className="ape-back" onClick={() => navigate(-1)}>
          <IoIosArrowBack size={24} />
        </button>
        <h1 className="ape-title">분양 게시글 수정</h1>
      </header>

      <form className="ape-form" onSubmit={handleSubmit}>

        {/* 이미지 업로드 & 미리보기 */}
        <div className="ape-field">
          <label>대표 이미지 (1~4장)</label>

          <div className="profile-pics">
            {previews.map((p, idx) => (
              <div
                key={idx}
                className="profile-placeholder"
                onClick={() => handleRemove(idx)}
              >
                <img
                  src={p.src}
                  alt={`pet-${idx}`}
                  className="uploaded-image"
                />
              </div>
            ))}

            {[...Array(Math.max(0, 4 - previews.length))].map((_, i) => (
              <div
                key={`add-${i}`}
                className="add-pic"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPlus size={24} />
              </div>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>


        {/* 이름, 몸무게, 중성화, 코멘트 (이전 코드 그대로) */}
        <div className="ape-field">
          <label>이름</label>
          <input type="text" value={petName} onChange={e => setPetName(e.target.value)} />
        </div>
        <div className="ape-field">
          <label>몸무게(kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div className="ape-field">
          <label>중성화 여부</label>
          <select value={neutered ? 'yes' : 'no'} onChange={e => setNeutered(e.target.value === 'yes')}>
            <option value="yes">O</option>
            <option value="no">X</option>
          </select>
        </div>
        <div className="ape-field">
          <label>코멘트</label>
          <textarea rows="4" value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        {/* 지도 & 마커 */}
        <div className="ape-field">
          <label>거래 위치 설정</label>
          <div ref={mapRef} className="ape-map" />
          <div className="ape-address">
            {address || '주소를 불러오는 중...'}
          </div>
          <small>지도 클릭 또는 롱프레스하여 위치를 선택하세요.</small>
        </div>

        <button type="submit" className="ape-submit">수정 완료</button>
      </form>
    </div>
  );
}
