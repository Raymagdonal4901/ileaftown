import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggleLang } = useLang();
  const { translations: t } = useCMS();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!t) return null;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-charcoal-950/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#hero" className={`text-sm tracking-widest uppercase transition-colors hover:text-gold text-gray-300`}>{t.nav.home[lang]}</a>
          <a href="#collection" className={`text-sm tracking-widest uppercase transition-colors hover:text-gold text-gray-300`}>{t.nav.collection[lang]}</a>
          <a href="#contact" className={`text-sm tracking-widest uppercase transition-colors hover:text-gold text-gray-300`}>{t.nav.contact[lang]}</a>
          
          {/* Language Toggle */}
          <button 
            onClick={toggleLang}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase transition-all duration-300 border-gray-600 text-gray-300 hover:border-gold hover:text-gold`}
          >
            <Globe size={14} />
            <span>{lang === 'th' ? 'EN' : 'TH'}</span>
          </button>

          <a href="#contact" className="border border-gold text-gold hover:bg-gold hover:text-white px-6 py-2 text-sm uppercase tracking-widest transition-all duration-300">
            {t.nav.bookTour[lang]}
          </a>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gold/50 text-gold text-xs font-semibold"
          >
            <Globe size={12} />
            {lang === 'th' ? 'EN' : 'TH'}
          </button>
          <button className="text-gold" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-charcoal-950 py-4 px-6 flex flex-col gap-4 border-t border-charcoal-800 shadow-xl">
          <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-gold uppercase tracking-wider text-sm">{t.nav.home[lang]}</a>
          <a href="#collection" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-gold uppercase tracking-wider text-sm">{t.nav.collection[lang]}</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-gold uppercase tracking-wider text-sm">{t.nav.contact[lang]}</a>
        </div>
      )}
    </header>
  );
};

export default Header;
