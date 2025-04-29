import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap'; // Row, Col 제거!
import '../LandingPage.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeState('fade-out');
    }, 2000);

    const timer2 = setTimeout(() => {
      navigate('/login');
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <Container fluid className={`landing-container ${fadeState}`}>
      <div className="logo-wrapper">
        <img src={logo} alt="Logo" className="landing-logo" />
      </div>

      <div className="title-wrapper">
        <h1 className="landing-title">
          Catch Me If You Can
        </h1>
      </div>
    </Container>
  );
};

export default LandingPage;
