import React, { useState } from 'react';
import { Layers, ChevronRight, Square, Maximize2 } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';

const FloorPlans = () => {
  const { lang } = useLang();
  const { translations: t } = useCMS();
  const [activeFloor, setActiveFloor] = useState(1);

  if (!t || !t.floorPlans) return null;

  return (
    <section id="floor-plans" className="py-24 bg-black text-white relative border-t border-charcoal-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">
            <Layers size={14} />
            <span>Architectural Layout</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display italic mb-6">
            {t.floorPlans.heading[lang]}
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
            {t.floorPlans.subtitle[lang]}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left: Interactive Tabs & Info */}
          <div className="w-full lg:w-5/12 space-y-6">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setActiveFloor(1)}
                className={`p-6 text-left border transition-all duration-300 flex justify-between items-center group ${activeFloor === 1 ? 'border-gold bg-charcoal-900' : 'border-charcoal-800 hover:border-gold/50'}`}
              >
                <div>
                  <h3 className={`font-display text-xl mb-1 ${activeFloor === 1 ? 'text-gold' : 'text-white'}`}>
                    {t.floorPlans.floor1.title[lang]}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Ground Floor Layout</p>
                </div>
                <ChevronRight size={20} className={activeFloor === 1 ? 'text-gold' : 'text-gray-600'} />
              </button>

              <button 
                onClick={() => setActiveFloor(2)}
                className={`p-6 text-left border transition-all duration-300 flex justify-between items-center group ${activeFloor === 2 ? 'border-gold bg-charcoal-900' : 'border-charcoal-800 hover:border-gold/50'}`}
              >
                <div>
                  <h3 className={`font-display text-xl mb-1 ${activeFloor === 2 ? 'text-gold' : 'text-white'}`}>
                    {t.floorPlans.floor2.title[lang]}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Upper Floor Layout</p>
                </div>
                <ChevronRight size={20} className={activeFloor === 2 ? 'text-gold' : 'text-gray-600'} />
              </button>
            </div>

            <div className="p-8 bg-charcoal-950 border border-charcoal-800 mt-8 animate-in fade-in slide-in-from-left-5 duration-500">
              <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-4">รายละเอียดแพลนบ้าน</h4>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                {activeFloor === 1 ? t.floorPlans.floor1.desc[lang] : t.floorPlans.floor2.desc[lang]}
              </p>
              <div className="space-y-3">
                {(activeFloor === 1 ? t.floorPlans.floor1.rooms[lang] : t.floorPlans.floor2.rooms[lang]).map((room, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-400">
                    <Square size={10} className="text-gold fill-gold/20" />
                    <span>{room}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Plan Image Display */}
          <div className="w-full lg:w-7/12 flex justify-center relative group">
            <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full opacity-20 pointer-events-none"></div>
            <div className="relative bg-white p-4 sm:p-6 border border-charcoal-800 shadow-2xl transition-all duration-500 max-w-md mx-auto">
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-charcoal-900/80 backdrop-blur-md p-2 text-gold">
                  <Maximize2 size={16} />
                </div>
              </div>
              <img 
                src={activeFloor === 1 ? "/1.jpg" : "/2.jpg"} 
                alt={`Floor ${activeFloor} Plan`}
                className="w-full h-auto object-contain bg-white min-h-[300px] animate-in fade-in zoom-in-95 duration-700"
              />
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-black">
                <span className="font-display text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                   {activeFloor === 1 ? '01 // Ground Level' : '02 // Private Suite'}
                </span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em]">iLeaf Town</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FloorPlans;
