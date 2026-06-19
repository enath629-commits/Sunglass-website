import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { PromoBanner } from '../types';

interface BannerSliderProps {
  banners: PromoBanner[];
  onActionClick?: (targetProductCat: string) => void;
  theme: 'light' | 'dark';
}

export default function BannerSlider({ banners, onActionClick, theme }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleAction = () => {
    if (onActionClick) {
      const isSunglass = /(sunglass|সানগ্লাস)/i.test(banners[current].title) || 
                          /(sunglass|সানগ্লাস)/i.test(banners[current].subtitle || '');
      onActionClick(isSunglass ? 'sunglass' : 'watch');
    }
  };

  if (!banners.length) return null;

  const isDark = theme === 'dark';

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl" id="campaign-banner-slider">
      {/* Absolute Carousel Wrapper with 16:9 viewport ratio constraints */}
      <div className="relative aspect-[21/9] min-h-[220px] md:min-h-[350px] lg:min-h-[420px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image / Complete Full-bleeding Image - Clickable for promotion */}
            <div 
              onClick={handleAction} 
              className="w-full h-full cursor-pointer relative group overflow-hidden"
            >
              <img
                src={banners[current].imageUrl}
                alt={banners[current].title || 'Chrono & Shade Banner'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control Navigation Arrows (Only if we have more than 1 banner) */}
      {banners.length > 1 && (
        <>
          <button
            id="slider-prev-btn"
            onClick={handlePrev}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-1.5 md:p-3 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-xs transition-colors z-10 select-none cursor-pointer hidden sm:block"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            id="slider-next-btn"
            onClick={handleNext}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-1.5 md:p-3 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-xs transition-colors z-10 select-none cursor-pointer hidden sm:block"
          >
            <ChevronRight size={18} />
          </button>

          {/* Pagination dots indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10" id="slider-indicators">
            {banners.map((_, idx) => (
              <button
                key={idx}
                id={`slider-dot-${idx}`}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  current === idx ? 'w-5 bg-emerald-500' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
