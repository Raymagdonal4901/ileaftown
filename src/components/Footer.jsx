import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const Footer = () => {
  const { lang } = useLang();
  const { translations: t } = useCMS();
  const navigate = useNavigate();
  const [pressTimer, setPressTimer] = useState(null);

  const startPress = () => {
    const timer = setTimeout(() => {
      navigate('/admin');
      window.scrollTo(0, 0);
    }, 3000); // 3 seconds
    setPressTimer(timer);
  };

  const endPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  if (!t) return null;

  return (
    <footer id="contact" className="bg-charcoal-950 pt-20 pb-10 border-t border-charcoal-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-display text-xl font-semibold tracking-wide text-white">
                ไอลีฟ<span className="text-gold">ทาวน์</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
              {t.footer.tagline[lang]}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-white uppercase tracking-widest text-sm mb-6">{t.footer.contactAgent[lang]}</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-light">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gold shrink-0 mt-1" />
                <span>+66 2 123 4567<br/>+66 81 234 5678</span>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div className="lg:col-span-1">
            <h4 className="text-white uppercase tracking-widest text-sm mb-6">{t.footer.location[lang]}</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-light">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold shrink-0 mt-1" />
                <span className="whitespace-pre-line">{t.footer.address[lang]}</span>
              </li>
            </ul>
          </div>

          {/* Amenities */}
          <div className="lg:col-span-1">
            <h4 className="text-white uppercase tracking-widest text-sm mb-6">{t.footer.amenities[lang]}</h4>
            <ul className="space-y-2 text-gray-400 text-sm font-light">
              {t.footer.amenityList[lang].map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            className="text-gray-500 text-xs tracking-wider uppercase cursor-default select-none active:text-gold transition-colors duration-500"
          >
            {t.footer.copyright[lang]}
          </p>
          <div className="flex gap-4 text-gray-500 text-xs tracking-wider uppercase">
            <a href="#" className="hover:text-gold transition-colors">{t.footer.privacy[lang]}</a>
            <a href="#" className="hover:text-gold transition-colors">{t.footer.terms[lang]}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
