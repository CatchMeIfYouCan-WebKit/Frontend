import React from 'react';
import '../Adoption.css';
import Footer from '../../../shared/Footer/Footer';
import testdog from '../../../assets/testdog.png';
import bell from '../../../assets/bell.svg';
import topmypage from '../../../assets/topmypage.svg';
import chatimg from '../../../assets/chatimg.svg';
import mark from '../../../assets/mark.svg';
import { useNavigate } from 'react-router-dom';
import tag from '../../../assets/tag.svg';

export default function Adoption() {
    const navigate = useNavigate();

    // 예시로 5개짜리 더미 데이터
    const posts = Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        image: testdog, // 대표 이미지
        title: '비숑 분양합니다',
        breed: '골든 리트리버',
        birth: '2025년 1월 생',
        gender: '남아',
        location: '구미시 거의동',
        timeAgo: '7일 전',
    }));

    return (
        <div className="adoption-page">
            {/* 상단 헤더 */}
            <div className="adoption-header">
                <div className="location-select">
                    <div style={{ marginLeft: '10px' }}>
                        구미시 거의동 <span className="arrow">▾</span>
                    </div>
                    <div style={{ gap: '20px', marginRight: '10px' }}>
                        <img src={bell} alt="알림" />
                        <img src={topmypage} alt="마이페이지" onClick={() => navigate('/mypage')} />
                    </div>
                </div>
                <div className="filters">
                    <div className='filter'>나이</div>
                    <div className='filter'>품종</div>
                    <div className='filter'>색상</div>
                    <div>
                        <img src={tag} alt="" />
                    </div>
                </div>
            </div>

            {/* 게시글 리스트 */}
            <div className="post-list">
                {posts.map((p) => (
                    <div key={p.id} className="post-card" onClick={() => navigate('')}>
                        <img src={p.image} alt={p.title} className="post-img" />
                        <div className="post-info">
                            <div className="post-title">
                                {p.title}{' '}
                                <span className="verified">
                                    <img src={mark} alt="" />
                                </span>
                            </div>
                            <div className="post-meta" style={{ marginBottom: '18px' }}>
                                {p.breed}
                                <br />
                                {p.birth} {p.gender}
                            </div>
                            <div className="post-footer">
                                <span className="post-location">{p.location}</span>
                                <span className="post-time">{p.timeAgo}</span>
                                <button className="comment-btn">
                                    <img src={chatimg} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 글쓰기 플로팅 버튼 */}
            <button className="write-btn">게시글 작성</button>

            {/* 하단 내비게이션 */}
            <Footer />
        </div>
    );
}
