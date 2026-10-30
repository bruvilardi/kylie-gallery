import React from 'react';
import { X, Home, Camera, Palette, Music, Video } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (id: string) => void;
  onGoHome: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onSelectCategory, onGoHome }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'photoshoots': return <Camera size={20} />;
      case 'artwork': return <Palette size={20} />;
      case 'live': return <Music size={20} />;
      case 'video': return <Video size={20} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-[#0a0a0a] border-l border-white/10 z-[70] transform transition-transform duration-300 ease-out p-6 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center mb-10">
          <span className="text-xl font-light tracking-widest uppercase">Menu</span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-col space-y-2">
          <button 
            onClick={() => { onGoHome(); onClose(); }}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 hover:text-klbr transition-all group text-left"
          >
            <Home size={20} className="text-gray-500 group-hover:text-klbr" />
            <span className="text-lg font-light">Início</span>
          </button>

          <div className="h-px bg-white/10 my-4" />

          {CATEGORIES.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onClose(); }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 hover:text-klbr transition-all group text-left"
            >
              <span className="text-gray-500 group-hover:text-klbr">
                {getIcon(cat.id)}
              </span>
              <span className="text-lg font-light">{cat.title}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4">Kylie Lovers BR Gallery</p>
          <p className="text-xs text-gray-600">
            Navegue pela história visual da princesa do pop.
          </p>
        </div>

      </div>
    </>
  );
};