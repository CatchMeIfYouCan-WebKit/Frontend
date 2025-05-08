import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { AiOutlineCamera } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../WitnessPostForm.css';
import { format } from 'date-fns';
import axios from 'axios';

export default function WitnessPostForm() {
    const navigate = useNavigate();
    const locationState = useLocation();
    const pet = locationState.state?.pet;

    const [date, setDate] = useState(locationState.state?.date);
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [desc, setDesc] = useState(locationState.state?.desc);
    // 서버에 보낼 파일
    const [file, setFile] = useState(null);
    // 미리보기 용 URL
    const [previewUrl, setPreviewUrl] = useState();
    // 모피어스 내부 경로

    // 선택된 위치 좌표 수신
    useEffect(() => {
        const state = locationState.state;
        if (state?.latitude && state?.longitude) {
            setLatitude(state.latitude);
            setLongitude(state.longitude);
        }
    }, [locationState]);

    // 위도, 경도 -> 주소 변환 (1, 2, 3 중에 골라쓰면 됨. 1이 제일 짧아서 1로 함)
    useEffect(() => {
        if (latitude && longitude && window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.coord2Address(longitude, latitude, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    // 1. 도로명 주소
                    const address = result[0].road_address?.address_name || result[0].address.address_name;
                    setLocation(address);

                    // 2. 도로명 주소 + 지번
                    // const road = result[0].road_address?.address_name;
                    // const jibun = result[0].address?.address_name;
                    // const fullAddress = road && jibun ? `${road} (${jibun})` : road || jibun;
                    // setLocation(fullAddress);

                    // 3. 건물명 포함
                    // const buildingName = result[0].road_address?.building_name;
                    // const road = result[0].road_address?.address_name;
                    // const fullAddress = buildingName ? `${road} (${buildingName})` : road;
                    // setLocation(fullAddress);
                }
            });
        }
    }, [latitude, longitude]);

    // 파일 복원
    useEffect(() => {
        const state = locationState.state;

        if (state?.previewUrl) {
            setPreviewUrl(state.previewUrl);

            fetch(state.previewUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const f = new File([blob], 'witness.jpg', { type: blob.type });
                    setFile(f);
                })
                .catch((err) => console.error('파일 복원 실패:', err));
        }
    }, [locationState]);

    // 작성
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('사진을 첨부해주세요.');
            return;
        }

        if (!date) {
            alert('날짜 및 시간을 입력해주세요.');
            return;
        }

        if (!desc) {
            alert('상세설명을 입력해주세요.');
            return;
        }

        try {
            const formData = new FormData();

            const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");

            const witnessData = {
                postType: 'witness',
                witnessDatetime: formattedDate,
                witnessLocation: location,
                detailDescription: desc,
            };

            formData.append('post', new Blob([JSON.stringify(witnessData)], { type: 'application/json' }));
            formData.append('file', file);

            const res = await axios.post('/api/posts/witness', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            console.log({ location, date, desc, file });
            alert('목격 신고를 했습니다.');
            navigate('/main');
        } catch (error) {
            console.error('등록 실패:', error);
            alert('게시글 등록에 실패했습니다.');
        }
    };

    // 이미지 가져오기
    const getImageUrl = (path) => {
        if (!path) return '';
        const host = window.location.hostname;
        const port = 8080;
        return `http://${host}:${port}${path}`;
    };

    // 사진 업로드
    const handleMorpheusImageUpload = () => {
        const userChoice = confirm('사진을 촬영하시겠습니까?');

        const uploadImage = async (localPath) => {
            const fileExt = localPath.split('.').pop().toLowerCase();
            const mimeTypeMap = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
            };
            const mimeType = mimeTypeMap[fileExt] || 'image/jpeg';

            const response = await fetch(localPath);
            const blob = await response.blob();
            const file = new File([blob], `profile.${fileExt}`, { type: mimeType });

            const formData = new FormData();
            formData.append('file', file);

            const uploadUrl = `http://${window.location.hostname}:8080/api/posts/witness/image-upload`;

            const res = await axios.post(uploadUrl, formData, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('🚀 localPath:', localPath);
            console.log('🚀 mimeType:', mimeType);
            console.log('🚀 uploadUrl:', uploadUrl);
            console.log('📸 previewUrl:', previewUrl);

            M.net.http.upload({
                url: `http://${window.location.hostname}:8080/api/animal-profile/image-upload`,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: [
                    {
                        name: 'file',
                        content: localPath, // ex: /sdcard/...
                        type: 'FILE', // MIME type
                    },
                ],
                finish: (status, header, body) => {
                    const result = JSON.parse(body);
                    const uploadedPath = result.photoPath;

                    setPreviewUrl(uploadedPath);
                    setPreviewUrl(getImageUrl(uploadedPath));
                    console.log('🔥 업로드 응답:', result);
                    console.log('🔥 저장된 경로:', result.photoPath);

                    alert('업로드 성공!');
                },
            });
        };

        const handleResult = (status, result) => {
            if (status !== 'SUCCESS' || !result.path) {
                alert('사진 선택 실패');
                return;
            }

            const path = result.fullpath || result.path;
            if (!/\.(jpg|jpeg|png|gif)$/i.test(path)) {
                alert('이미지 파일만 선택해주세요.');
                return;
            }

            uploadImage(path);
        };

        if (userChoice) {
            M.media.camera({
                path: '/media',
                mediaType: 'PHOTO',
                saveAlbum: true,
                callback: handleResult,
            });
        } else {
            M.media.picker({
                mode: 'SINGLE',
                mediaType: 'ALL',
                path: '/media',
                column: 3,
                callback: handleResult,
            });
        }
    };

    return (
        <div className="mpf-container">
            <header className="missing-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <IoIosArrowBack />
                </button>
                <h1>목격게시글 작성</h1>
            </header>

            <form className="mpf-form" onSubmit={handleSubmit}>
                <label>목격된 동물의 사진</label>
                <div className="photo-section">
                    <div className="photo-grid">
                        <label htmlFor="file-upload" className="photo-upload-box">
                            <button type="button" onClick={handleMorpheusImageUpload}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="사진 미리보기" className="photo-preview" />
                                ) : (
                                    <AiOutlineCamera
                                        className="camera-icon"
                                        id="camera-icon"
                                        style={{ color: 'lightgray' }}
                                    />
                                )}
                            </button>
                        </label>
                    </div>
                </div>

                <label>목격 장소</label>
                <div
                    className="mpf-input mpf-input--select"
                    onClick={() => {
                        navigate('/report-found/select-location', {
                            state: {
                                date,
                                desc,
                                latitude,
                                longitude,
                                file,
                                previewUrl,
                            },
                        });
                    }}
                >
                    {location ? `${location}` : '장소를 선택해주세요'}
                </div>

                <label>목격 일시</label>
                <div className="react-datepicker__input-container" style={{ position: 'relative' }}>
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText="날짜 및 시간을 선택해주세요"
                        className="mpf-input"
                    />
                </div>

                <label>목격 당시 상황</label>
                <textarea
                    className="mpf-input"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder={[
                        '길 잃은 동물을 발견하고 제보해주셔서 진심으로 감사합니다!',
                        '보호자의 품으로 돌아가거나 안전하게 구조되는 데 소중한 정보가 될 수 있습니다.',
                        '아래 내용을 참고하여 보신 내용을 아시는 범위 내에서 최대한 자세히 작성해주세요. (정확하지 않아도 괜찮습니다!)',
                        '',
                        '1. 동물의 종류 및 외모 (아시는 만큼만)',
                        '2. 당시 동물의 상태 및 행동',
                        '3. 동물의 이동 방향 (혹시 보셨다면)',
                        '4. 제보자 연락처 (선택 사항):',
                    ].join('\n')}
                />

                <button type="submit" className="mpf-submit">
                    게시글 작성
                </button>
            </form>
        </div>
    );
}
