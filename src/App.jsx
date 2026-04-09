import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CMSProvider } from './contexts/CMSContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import FloorPlans from './components/FloorPlans';
import Location from './components/Location';
import Footer from './components/Footer';
import PropertyModal from './components/PropertyModal';
import AdminDashboard from './components/AdminDashboard';

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const openModal = (property) => {
    setSelectedProperty(property);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProperty(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <Showcase onOpenModal={openModal} />
        <FloorPlans />
        <Location />
      </main>
      <Footer />
      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={closeModal} />
      )}
    </>
  );
};

function App() {
  return (
    <CMSProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col font-sans bg-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </LanguageProvider>
    </CMSProvider>
  );
}

export default App;
