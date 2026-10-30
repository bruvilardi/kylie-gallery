
import React, { useEffect, useState, useRef } from 'react';
import { X, Download, Share2, ChevronLeft, ChevronRight, Loader2, Check, ZoomIn } from 'lucide-react';
import { Photo } from '../types';

interface ImageViewerProps {
  photo: Photo | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  currentIndex?: number;
  totalPhotos?: number;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  photo, 
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  currentIndex = 0,
  totalPhotos = 0
}) => {
  // --- States para Zoom e Pan ---
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // --- Refs para Gestos ---
  const imgRef = useRef<HTMLImageElement>(null);
  const lastTouchRef = useRef<{ x: number, y: number } | null>(null);
  const initialDistanceRef = useRef<number | null>(null);
  const lastScaleRef = useRef<number>(1);

  // --- Swipe State (Navegação) ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;
  
  // --- Action States ---
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareFeedback, setShowShareFeedback] = useState(false);

  // Resetar estados ao trocar de foto
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    lastScaleRef.current = 1;
    setIsImageLoading(true);
  }, [photo?.id]);

  // Teclado
  useEffect(() => {
    if (!photo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Só navega se não estiver com zoom ativo
      if (scale === 1) {
        if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
        if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, onNext, onPrev, hasNext, hasPrev, scale]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialDistanceRef.current = distance;
    } else if (e.touches.length === 1) {
      setTouchStart(e.touches[0].clientX);
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (scale > 1) setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistanceRef.current !== null) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance / initialDistanceRef.current;
      const newScale = Math.min(Math.max(lastScaleRef.current * delta, 1), 4);
      setScale(newScale);
    } else if (e.touches.length === 1) {
      if (scale > 1 && lastTouchRef.current) {
        const deltaX = e.touches[0].clientX - lastTouchRef.current.x;
        const deltaY = e.touches[0].clientY - lastTouchRef.current.y;
        setPosition(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
        lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        setTouchEnd(e.touches[0].clientX);
      }
    }
  };

  const handleTouchEnd = () => {
    initialDistanceRef.current = null;
    lastScaleRef.current = scale;
    setIsDragging(false);
    lastTouchRef.current = null;

    if (scale === 1 && touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      if (distance > minSwipeDistance && hasNext && onNext) onNext();
      if (distance < -minSwipeDistance && hasPrev && onPrev) onPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      lastScaleRef.current = 1;
    } else {
      setScale(2.5);
      lastScaleRef.current = 2.5;
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!photo || isDownloading) return;
    setIsDownloading(true);
    try {
        const response = await fetch(photo.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = photo.id.split('/').pop() || 'kylie-image';
        link.download = fileName.includes('.') ? fileName : `${fileName}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        const attachmentUrl = photo.url.replace(/\/upload\/(.*?)\/v/, '/upload/$1,fl_attachment/v');
        window.open(attachmentUrl, '_blank');
    } finally {
        setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!photo) return;
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Kylie Lovers BR Gallery',
                text: 'Confira esta foto na Galeria Kylie Lovers BR',
                url: photo.url
            });
        } catch (err) {}
    } else {
        try {
            await navigator.clipboard.writeText(photo.url);
            setShowShareFeedback(true);
            setTimeout(() => setShowShareFeedback(false), 2000);
        } catch (err) {}
    }
  };

  if (!photo) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-fade-in touch-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={(e) => {
        if (e.ctrlKey) {
          const delta = -e.deltaY * 0.01;
          setScale(s => Math.min(Math.max(s + delta, 1), 4));
        }
      }}
    >
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                <ZoomIn size={14} className="text-klbr" />
                <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold hidden sm:inline">Pinch para Zoom</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold sm:hidden">Zoom</span>
            </div>
            {totalPhotos > 0 && (
                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 text-[11px] font-bold tracking-[0.2em] text-white">
                    {currentIndex + 1} / {totalPhotos}
                </div>
            )}
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all pointer-events-auto active:scale-90"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navegação Transparente Laterais (Desktop) */}
      {scale === 1 && (
        <>
          <div 
            className="absolute left-0 top-0 bottom-0 w-[15%] z-[105] cursor-pointer group hidden md:block pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
          >
            {hasPrev && (
               <div className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-klbr">
                 <ChevronLeft size={32} />
               </div>
            )}
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-[15%] z-[105] cursor-pointer group hidden md:block pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
          >
            {hasNext && (
               <div className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-klbr">
                 <ChevronRight size={32} />
               </div>
            )}
          </div>
        </>
      )}

      {/* Navigation Mobile Chevrons */}
      {scale === 1 && (
        <div className="md:hidden absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-[110]">
          {hasPrev && (
            <button 
                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                className="p-2 rounded-full bg-black/50 text-white/50 pointer-events-auto"
            >
                <ChevronLeft size={24} />
            </button>
          )}
          {hasNext && (
            <button 
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                className="p-2 rounded-full bg-black/50 text-white/50 pointer-events-auto"
            >
                <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}

      {/* Container da Imagem */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-zoom-in relative"
        onClick={onClose}
        onDoubleClick={handleDoubleTap}
      >
        {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-klbr animate-spin opacity-50" />
            </div>
        )}
        
        <div 
          className="relative transition-transform duration-75 ease-out"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            touchAction: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            ref={imgRef}
            src={photo.url} 
            alt={photo.title}
            onLoad={() => setIsImageLoading(false)}
            className={`max-h-[82vh] max-w-[95vw] md:max-h-[85vh] object-contain rounded-sm shadow-[0_20px_80px_rgba(0,0,0,0.8)] select-none transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            draggable={false}
          />
        </div>
      </div>
      
      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 px-6 z-[110] pointer-events-none">
        {scale > 1 && (
            <button 
                onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
                className="px-5 py-2.5 bg-klbr text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-md shadow-2xl pointer-events-auto animate-fade-in"
            >
                Resetar Zoom
            </button>
        )}
        
        <div className="flex gap-4 pointer-events-auto">
          <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/10 hover:bg-klbr text-white transition-all backdrop-blur-xl border border-white/5 shadow-2xl disabled:opacity-50"
          >
              {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />}
              <span className="text-xs font-bold uppercase tracking-[0.15em] hidden sm:inline">Salvar Foto</span>
          </button>
          
          <button 
              onClick={handleShare}
              className="p-4 rounded-full bg-white/10 hover:bg-blue-600 text-white transition-all backdrop-blur-xl border border-white/5 relative shadow-2xl"
          >
              {showShareFeedback ? <Check size={20} /> : <Share2 size={20} />}
              {showShareFeedback && (
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase py-1.5 px-3 rounded-full whitespace-nowrap animate-bounce shadow-xl">
                      Link Copiado!
                  </span>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};
