import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const Hero = () => {
  const { lang } = useLang();
  const { translations: t } = useCMS();

  if (!t) return null;

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 bg-charcoal-950">
        <img 
          src="/3.jpg" 
          alt="Luxury Home Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-charcoal-950/50"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
        <p className="text-gold uppercase tracking-[0.3em] text-sm mb-6">
          {t.hero.badge[lang]}
        </p>
        <h1 className="text-6xl md:text-8xl font-display leading-[1.2] text-white mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <span className="block mb-4">{t.hero.title1[lang]}</span>
          <span className="text-gold italic block">{t.hero.title2[lang]}</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12">
          {t.hero.subtitle[lang]}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a href="#collection" className="bg-gold hover:bg-brass text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold transition-all duration-300">
            {t.hero.btnExplore[lang]}
          </a>
          <a href="#contact" className="border border-white/50 text-white hover:bg-white/10 px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 backdrop-blur-sm">
            {t.hero.btnContact[lang]}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-gray-400">
        <span className="text-xs uppercase tracking-widest mb-2">{t.hero.scroll[lang]}</span>
        <ChevronDown size={20} className="text-gold" />
      </div>
    </section>
  );
};

export default Hero;
