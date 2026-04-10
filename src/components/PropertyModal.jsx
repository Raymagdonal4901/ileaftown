import React, { useState } from 'react';
import { X, CheckCircle, PlaySquare, Image as ImageIcon, MapPin, Send, ChevronRight } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const PropertyModal = ({ property, onClose }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { lang } = useLang();
  const { translations: t } = useCMS();

  if (!t) return null;

  const title = property.title;
  const description = property.description;
  const highlights = property.highlights || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-950/90 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-charcoal-900 w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-charcoal-950 text-white p-2 rounded-full hover:bg-gold transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Column: Media */}
        <div className="w-full md:w-3/5 bg-charcoal-950 relative min-h-[35vh] md:min-h-full flex flex-col border-r border-white/5">
          {/* Tabs */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest backdrop-blur-sm transition-colors ${activeTab === 'gallery' ? 'bg-gold text-white' : 'bg-charcoal-950/50 text-gray-300 hover:bg-charcoal-900'}`}
            >
              <ImageIcon size={14} /> {t.modal.gallery[lang]}
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest backdrop-blur-sm transition-colors ${activeTab === 'video' ? 'bg-gold text-white' : 'bg-charcoal-950/50 text-gray-300 hover:bg-charcoal-900'}`}
            >
              <PlaySquare size={14} /> {t.modal.virtualTour[lang]}
            </button>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center p-0">
            {activeTab === 'gallery' ? (
              <div className="w-full h-full flex flex-col">
                <div className="flex-grow flex items-center justify-center bg-black overflow-hidden relative min-h-[40vh] md:min-h-[500px]">
                  <img 
                    src={(property.gallery && property.gallery.length > 0) ? property.gallery[currentImageIndex] : property.coverImage} 
                    alt={title} 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.onError = null; e.target.src = 'https://placehold.co/1200x800/1a1a1a/D4AF37?text=Image+Unavailable' }}
                    className="w-full h-full object-cover md:object-contain"
                  />

                  {/* Mobile Mobile-only Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent md:hidden">
                    <div className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-1 opacity-80">{property.houseNumber} — iLeaf Town</div>
                    <div className="flex justify-between items-end">
                      <h3 className="text-white font-display text-xl">{title}</h3>
                      <div className="text-gold font-light">{property.price}</div>
                    </div>
                  </div>
                  
                  {/* Gallery Navigation Arrows (if more than 1 image) */}
                  {property.gallery && property.gallery.length > 1 && (
                    <>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : property.gallery.length - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white hover:bg-gold transition-colors rounded-full"
                      >
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => (prev < property.gallery.length - 1 ? prev + 1 : 0))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white hover:bg-gold transition-colors rounded-full"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {property.gallery && property.gallery.length > 0 && (
                  <div className="flex gap-2 p-4 bg-charcoal-900 border-t border-charcoal-800 overflow-x-auto no-scrollbar">
                    {/* Include Cover Image if it's not already in the gallery or just always the gallery */}
                    {property.gallery.map((url, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-20 h-16 shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={url} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center min-h-[300px] md:min-h-full">
                {property.videoUrl ? (
                  <video 
                    src={property.videoUrl} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay 
                    muted 
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex flex-col items-center justify-center text-charcoal-500">
                    <PlaySquare size={48} className="mb-4 opacity-50" />
                    <p className="uppercase tracking-widest text-sm">{t.modal.tourPlaceholder[lang]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details & Contact (Scrollable on mobile by parent, unique on desktop) */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col bg-charcoal-950 overflow-y-auto custom-scrollbar">
          <div className="mb-2">
            <span className="text-gold text-xs font-semibold tracking-widest uppercase">
              <MapPin size={12} className="inline mr-1 -mt-1" />
              {property.houseNumber} — iLeaf Town
            </span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">{title}</h2>
          <div className="flex items-baseline gap-4 mb-6">
            <div className="text-2xl font-light text-gold">{property.price}</div>
            {property.originalPrice && (
              <div className="text-sm text-gray-500 line-through opacity-60 font-light">
                {property.originalPrice}
              </div>
            )}
          </div>
          
          <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light">
            {description}
          </p>

          <div className="mb-8">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-300 mb-4">{t.modal.highlights[lang]}</h4>
            <ul className="space-y-3">
              {highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                  <CheckCircle size={16} className="text-gold shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8 border-t border-charcoal-800">
            <h4 className="text-lg font-display text-white mb-4">{t.modal.requestTour[lang]}</h4>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder={t.modal.yourName[lang]}
                className="w-full border-b border-charcoal-700 py-2 px-1 focus:outline-none focus:border-gold transition-colors text-sm bg-transparent text-gray-200"
              />
              <input 
                type="tel" 
                placeholder={t.modal.phone[lang]}
                className="w-full border-b border-charcoal-700 py-2 px-1 focus:outline-none focus:border-gold transition-colors text-sm bg-transparent text-gray-200"
              />
              <button className="w-full bg-gold text-black font-semibold hover:bg-brass hover:text-black py-4 text-sm uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2 mt-4">
                <Send size={16} /> {t.modal.sendRequest[lang]}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyModal;
