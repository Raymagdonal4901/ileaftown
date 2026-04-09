import React, { useState } from 'react';
import { ShoppingBag, BookOpen, Stethoscope, MapPin, X, ZoomIn } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const Location = () => {
  const { lang } = useLang();
  const { translations: t } = useCMS();
  const [isZoomed, setIsZoomed] = useState(false);

  if (!t || !t.location) return null;

  const categories = [
    {
      icon: <ShoppingBag className="text-gold" size={24} />,
      title: t.location.shopping.title[lang],
      items: t.location.shopping.list[lang]
    },
    {
      icon: <BookOpen className="text-gold" size={24} />,
      title: t.location.education.title[lang],
      items: t.location.education.list[lang]
    },
    {
      icon: <Stethoscope className="text-gold" size={24} />,
      title: t.location.healthcare.title[lang],
      items: t.location.healthcare.list[lang]
    }
  ];

  return (
    <section id="location" className="py-24 bg-charcoal-950 text-white relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Content */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">
              <MapPin size={14} />
              <span>{t.footer.location[lang]}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display italic mb-6">
              {t.location.heading[lang]}
            </h2>
            
            <p className="text-gray-400 text-lg font-light mb-12 max-w-xl">
              {t.location.subtitle[lang]}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {categories.map((cat, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-charcoal-900 p-3 rounded-none border border-charcoal-800 group-hover:border-gold transition-colors duration-300">
                      {cat.icon}
                    </div>
                    <h3 className="font-display text-xl text-white tracking-wide">{cat.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {cat.items.map((item, i) => (
                      <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                        <div className="w-1 h-1 bg-gold rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Map Image */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-4 border border-gold/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <div 
              className="relative overflow-hidden border border-charcoal-800 bg-charcoal-900 p-2 cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <img 
                src="/4.jpg" 
                alt="Project Location Map" 
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover grayscale-[20%] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 ease-out transform group-hover:scale-[1.02]"
              />
              {/* Zoom Trigger Hint */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={18} />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Full Screen Zoom Overlay */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <X size={32} />
          </button>
          <img 
            src="/4.jpg" 
            alt="Expanded Map" 
            className="max-w-full max-h-full object-contain shadow-2xl border border-charcoal-800 animate-in zoom-in-95 duration-500"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Location;
