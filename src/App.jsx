// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./NavBar/Navbar";
import Footer from "./Footer/Footer";
import MessagePage from "./Pages/MessagePage";
import SentStatusPage from "./Pages/SentStatusPage";
import "./App.css";
// import EmailSender from "./Pages/EmailSender";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<MessagePage />} />
          <Route path="/sent-status" element={<SentStatusPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
