// MedicalPage.jsx
import React from "react";
import "../Medical.css";
import Header from "./Header";
import RecordBox from "./RecordBox";
import Banner from "./Banner";
import RecentHospitals from "./RecentHospitals";
import PopularHospitals from "./PopularHospitals";
import Footer from "../../../shared/Footer/Footer";

// import PopularHospitals from "./components/PopularHospitals";
// import BottomNav from "./components/BottomNav";

const MedicalPage = () => {
    return (
        <div className="medical-page">
            <Header />
            <RecordBox />
            <Banner />
            <RecentHospitals />
            <PopularHospitals />
            <Footer />
        </div>
    );
};

export default MedicalPage;
