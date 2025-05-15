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
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
    const [files, setFiles] = useState([]);
    // 미리보기 용 URL
    const [previewUrls, setPreviewUrls] = useState([]);
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

        if (state?.previewUrls) {
            setPreviewUrls(state.previewUrls);

            const restoredFiles = [];
            Promise.all(
                state.previewUrls.map((url) =>
                    fetch(url)
                        .then((res) => res.blob())
                        .then((blob) => new File([blob], 'witness.jpg', { type: blob.type }))
                )
            )
                .then((files) => setFiles(files))
                .catch((err) => console.error('파일 복원 실패:', err));
        }
    }, [locationState]);

    // 작성
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
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

            formData.append('post', JSON.stringify(witnessData));
            files.forEach((file) => formData.append('files', file));

            const res = await axios.post('/api/posts/witness', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            console.log({ location, date, desc, files });
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
        if (files.length >= 5) {
            showToast('사진은 최대 5장까지 등록할 수 있습니다.');
            return;
        }
        const userChoice = confirm('사진을 촬영하시겠습니까?');

        const handleAddPhoto = (newFile, newPreviewUrl) => {
            setFiles([...files, newFile]);
            setPreviewUrls([...previewUrls, newPreviewUrl]);
        };

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
                },
            });

            console.log('🚀 localPath:', localPath);
            console.log('🚀 mimeType:', mimeType);
            console.log('🚀 uploadUrl:', uploadUrl);
            console.log('📸 previewUrls:', previewUrls);

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
                indicator: false,
                finish: (status, header, body) => {
                    const result = JSON.parse(body);
                    const uploadedPath = result.photoPath;

                    handleAddPhoto(file, getImageUrl(uploadedPath));

                    console.log('🔥 업로드 응답:', result);
                    console.log('🔥 저장된 경로:', result.photoPath);
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
                mediaType: 'PHOTO',
                path: '/media',
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

    // 사진 삭제
    const handleRemovePhoto = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    // Drag & Drop
    const handleDragDrop = (result) => {
        if (!result.destination) return;

        const reorderedUrls = Array.from(previewUrls);
        const [removedUrl] = reorderedUrls.splice(result.source.index, 1);
        reorderedUrls.splice(result.destination.index, 0, removedUrl);
        setPreviewUrls(reorderedUrls);

        const reorderedFiles = Array.from(files);
        const [removedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, removedFile);
        setFiles(reorderedFiles);
    };

    // 사진 5장 초과 시 Toast 메세지
    const showToast = (message) => {
        const toast = document.createElement('div');

        toast.innerText = message;

        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '9999';
        toast.style.whiteSpace = 'nowrap'; // ✅ 줄바꿈 방지
        toast.style.textOverflow = 'ellipsis'; // ✅ 넘치면 ...
        toast.style.overflow = 'hidden';
        toast.style.maxWidth = '80vw'; // 화면 너비 기준 최대 크기

        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    };

    return (
        <div className="mpf-containers">
            <header className="missing-headers">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <IoIosArrowBack />
                </button>
                <h1>목격게시글 작성</h1>
            </header>

            <form className="mpf-form" onSubmit={handleSubmit}>
                <label>
                    목격된 동물의 사진 <span className="required">*</span> &nbsp;&nbsp;
                    <span style={{ color: '#999', fontSize: '16px' }}>({previewUrls.length}/5)</span>
                </label>
                <div className="photo-section">
                    {/* 포토 박스 */}
                    <DragDropContext onDragEnd={handleDragDrop}>
                        <Droppable droppableId="photo-list" direction="horizontal">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="photo-list">
                                    {previewUrls.map((url, idx) => (
                                        <Draggable key={idx} draggableId={`photo-${idx}`} index={idx}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        position: 'relative',
                                                        flex: '0 0 auto',
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    {idx === 0 && <div className="photo-representative">대표</div>}
                                                    <img
                                                        src={url}
                                                        alt={`사진 미리보기 ${idx + 1}`}
                                                        className="witness-photo-preview"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="photo-remove-btn"
                                                        onClick={() => handleRemovePhoto(idx)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}

                                    {/* 카메라 아이콘 (고정)) */}
                                    <button type="button" onClick={handleMorpheusImageUpload}>
                                        <label htmlFor="file-upload" className="photo-upload-box">
                                            <AiOutlineCamera className="camera-icon" />
                                        </label>
                                    </button>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <label>
                    목격 장소 <span className="required">*</span>
                </label>
                <div
                    className="mpf-input mpf-input--select"
                    onClick={() => {
                        navigate('/report-found/select-location', {
                            state: {
                                date,
                                desc,
                                latitude,
                                longitude,
                                files,
                                previewUrls,
                            },
                        });
                    }}
                >
                    {location ? `${location}` : '장소를 선택해주세요'}
                </div>

                <label>
                    목격 일시 <span className="required">*</span>
                </label>
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

                <label>
                    목격 당시 상황 <span className="required">*</span>
                </label>
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
