import React from 'react';
import PropertyCard from './PropertyCard';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const Showcase = ({ onOpenModal }) => {
  const { lang } = useLang();
  const { properties, translations: t, loading } = useCMS();

  if (loading || !t) {
    return (
      <div className="py-24 bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section id="collection" className="py-24 bg-black relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-[0.2em] text-sm font-semibold block mb-3">{t.showcase.label[lang]}</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">{t.showcase.heading[lang]}</h2>
          <div className="w-16 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t.showcase.desc[lang]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property) => (
            <div key={property.propertyId || property.id}>
              <PropertyCard property={property} onClick={() => onOpenModal(property)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
