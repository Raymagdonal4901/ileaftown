import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageLightbox = ({ images, currentIndex, onClose, onIndexChange }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handlePrev = useCallback(() => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, images.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onClose]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Upper Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[210]">
        <div className="text-white/60 text-xs tracking-widest uppercase font-light">
          {currentIndex + 1} / {images.length}
        </div>
        <button 
          onClick={onClose}
          className="bg-white/10 text-white p-3 rounded-full hover:bg-gold hover:text-black transition-all duration-300"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden">
        {/* Navigation Buttons - Desktop only */}
        <button 
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex bg-white/10 text-white p-4 rounded-full hover:bg-gold hover:text-black transition-all duration-300 z-[210]"
        >
          <ChevronLeft size={32} />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex bg-white/10 text-white p-4 rounded-full hover:bg-gold hover:text-black transition-all duration-300 z-[210]"
        >
          <ChevronRight size={32} />
        </button>

        {/* Content */}
        <div className="relative w-full h-full flex items-center justify-center select-none animate-in fade-in zoom-in duration-300">
          <img 
            src={images[currentIndex]} 
            alt={`Image ${currentIndex + 1}`} 
            className="max-w-full max-h-full object-contain shadow-2xl"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </div>

      {/* Thumbnails / Bottom Info (Optional) */}
      <div className="absolute bottom-8 left-0 right-0 px-6 overflow-x-auto no-scrollbar flex justify-center gap-2">
        {images.length > 1 && images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onIndexChange(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-gold w-8' : 'bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageLightbox;
