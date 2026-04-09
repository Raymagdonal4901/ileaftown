import React from 'react';
import { BedDouble, Bath, ChefHat, Maximize, Eye } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const PropertyCard = ({ property, onClick }) => {
  const { lang } = useLang();
  const { translations: t } = useCMS();

  if (!t) return null;

  const title = property.title;
  const description = property.description;

  return (
    <div className="bg-charcoal-900 group cursor-pointer border border-charcoal-800 hover:border-gold/30 transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-charcoal-950/80 backdrop-blur-sm text-white px-3 py-1 text-xs tracking-widest uppercase flex items-center gap-2">
          <Eye size={12} className="text-gold" />
          <span>{(property.views || 0).toLocaleString()} {t.card.views[lang]}</span>
        </div>
        {property.originalPrice && (
          <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg">
            PROMOTION
          </div>
        )}
        <img 
          src={property.coverImage} 
          alt={title} 
          referrerPolicy="no-referrer"
          onError={(e) => { e.target.onError = null; e.target.src = 'https://placehold.co/1200x800/1a1a1a/D4AF37?text=Image+Unavailable' }}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-charcoal-950/20 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>

      {/* Content Container */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-gold text-xs font-semibold tracking-widest uppercase">
            {t.card.residency[lang]} — {property.houseNumber}
          </span>
        </div>
        <h3 className="font-display text-2xl text-white mb-2 group-hover:text-gold transition-colors">{title}</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gold font-light text-xl">{property.price}</span>
          {property.originalPrice && (
            <span className="text-gray-500 text-xs line-through opacity-60">
              {property.originalPrice}
            </span>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-light">
          {description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-charcoal-800 mb-6 mt-auto">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Maximize size={18} className="mb-1 text-gold" />
            <span className="text-xs">{property.area} {t.card.sqm[lang]}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-400 border-l border-charcoal-800">
            <BedDouble size={18} className="mb-1 text-gold" />
            <span className="text-xs">{property.bedrooms} {t.card.bed[lang]}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-400 border-l border-charcoal-800">
            <Bath size={18} className="mb-1 text-gold" />
            <span className="text-xs">{property.bathrooms} {t.card.bath[lang]}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-400 border-l border-charcoal-800">
            <ChefHat size={18} className="mb-1 text-gold" />
            <span className="text-xs">{property.kitchens} {t.card.kit[lang]}</span>
          </div>
        </div>

        <button 
          onClick={onClick}
          className="w-full bg-black text-white hover:bg-gold hover:text-black py-3 text-sm uppercase tracking-widest transition-colors duration-300 font-semibold"
        >
          {t.card.viewBtn[lang]}
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
