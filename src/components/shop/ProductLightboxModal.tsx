'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';

interface ProductLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productTitle?: string;
}

export const ProductLightboxModal: React.FC<ProductLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productTitle = 'Product Image',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = fit, 2.5, 3.5, 4.5
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Sync index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
      setZoomLevel(1);
      setMousePos({ x: 50, y: 50 });
      setIsPlaying(false);
    }
  }, [isOpen, initialIndex, images.length]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Step zoom: 1x -> 2.5x -> 3.5x -> 4.5x -> 1x
  const handleCycleZoom = () => {
    setZoomLevel((prev) => {
      if (prev === 1) return 2.5;
      if (prev === 2.5) return 3.5;
      if (prev === 3.5) return 4.5;
      return 1;
    });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => {
      if (prev < 2.5) return 2.5;
      if (prev < 3.5) return 3.5;
      return 4.5;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      if (prev > 3.5) return 3.5;
      if (prev > 2.5) return 2.5;
      return 1;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Auto slideshow player
  useEffect(() => {
    if (!isOpen || !isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, images.length, handleNext]);

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Track mouse coordinates over image for smooth zoomed panning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel === 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];
  const isZoomed = zoomLevel > 1;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 z-30 bg-gradient-to-b from-black/85 via-black/50 to-transparent">
        {/* Left: Counter & Current Zoom Indicator */}
        <div className="flex items-center gap-2">
          <div className="text-white font-mono text-xs sm:text-sm font-bold tracking-widest px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            {currentIndex + 1} / {images.length}
          </div>
          {isZoomed && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-500 text-white shadow-md animate-in fade-in">
              {zoomLevel}x Active
            </span>
          )}
        </div>

        {/* Center/Right: Zoom Level Selector Pills & Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-white">
          {/* Direct Zoom Level Selector Pills */}
          <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10 text-xs font-bold mr-1">
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                zoomLevel === 1
                  ? 'bg-white text-black shadow-sm font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="Fit to screen"
            >
              Fit
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(2.5)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                zoomLevel === 2.5
                  ? 'bg-sky-500 text-white shadow-sm font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="2.5x Zoom"
            >
              2.5x
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(3.5)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                zoomLevel === 3.5
                  ? 'bg-sky-500 text-white shadow-sm font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="3.5x Zoom"
            >
              3.5x
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(4.5)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                zoomLevel === 4.5
                  ? 'bg-sky-500 text-white shadow-sm font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="4.5x Ultra Zoom"
            >
              4.5x
            </button>
          </div>

          {/* Zoom Out Step Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel === 1}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white border border-white/10 transition-all cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom In Step Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel === 4.5}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white border border-white/10 transition-all cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Slideshow Play/Pause (only if multiple images) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              }`}
              title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white border border-red-500/50 transition-all cursor-pointer ml-1 sm:ml-2 shadow-lg"
            title="Close Gallery (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Pan & Zoom */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-12 my-2">
        {/* Left Navigation Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Center Display Image with Multi-level Zoom & Pan */}
        <div
          ref={imageContainerRef}
          onMouseMove={handleMouseMove}
          onClick={handleCycleZoom}
          className={`relative max-w-full max-h-full flex items-center justify-center overflow-hidden transition-all duration-150 ${
            zoomLevel === 4.5 ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          title={
            zoomLevel === 1
              ? 'Click to Zoom In (2.5x)'
              : zoomLevel === 2.5
              ? 'Click for Deeper Zoom (3.5x)'
              : zoomLevel === 3.5
              ? 'Click for Ultra Zoom (4.5x)'
              : 'Click to Reset Zoom (Fit)'
          }
        >
          <img
            key={currentImage}
            src={currentImage}
            alt={productTitle}
            className="max-w-[90vw] max-h-[72vh] sm:max-h-[76vh] object-contain select-none will-change-transform drop-shadow-2xl transition-transform"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
              transition: isZoomed ? 'transform 0.08s ease-out' : 'transform 0.3s ease-out',
            }}
          />
        </div>

        {/* Right Navigation Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Bar: Instructions & Thumbnails */}
      <div className="z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-2 pb-4 px-4 flex flex-col items-center gap-2">
        {/* Zoom Hint */}
        <p className="text-[11px] text-white/70 font-medium tracking-wide">
          {isZoomed
            ? `Zoomed at ${zoomLevel}x • Move cursor to explore fabric & stitching • Click image to cycle zoom (2.5x → 3.5x → 4.5x) or click Fit`
            : 'Click image or select 2.5x, 3.5x, 4.5x above to inspect product details'}
        </p>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex items-center gap-2.5 max-w-full overflow-x-auto px-4 py-1.5 scrollbar-thin">
            {images.map((imgUrl, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setCurrentIndex(idx);
                  }}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 bg-white/5 transition-all shrink-0 p-1 flex items-center justify-center cursor-pointer ${
                    isActive
                      ? 'border-sky-500 ring-2 ring-sky-500/50 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                  }`}
                  title={`View image ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {isActive && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-sky-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
