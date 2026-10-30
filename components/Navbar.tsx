import React from 'react';
import { ArrowLeft, Menu, ChevronDown } from 'lucide-react';
import { ViewState } from '../types';
import { CATEGORIES, CLOUD_NAME } from '../constants';

interface NavbarProps {
  currentView: ViewState;
  selectedCategory: string | null;
  selectedYear: number | null;
  selectedAlbumTitle?: string | null;
  years: number[];
  onBack: () => void;
  onOpenMenu: () => void;
  onGoHome: () => void;
  onSelectYear: (year: number) => void;
  onSelectCategory: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  selectedCategory, 
  selectedYear, 
  selectedAlbumTitle,
  years,
  onBack, 
  onOpenMenu,
  onGoHome,
  onSelectYear,
  onSelectCategory
}) => {
  
  // URLs dos logos no Cloudinary
  const mainLogo = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/logo_tnfiit.webp`;
  const smallLogo = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/selo_menor_av5nbp.png`;

  // Lógica de seleção do logo: Se estiver na home ('categories'), usa o logo principal, senão usa o selo menor.
  const logoUrl = currentView === 'categories' ? mainLogo : smallLogo;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/60 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentView !== 'categories' && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              aria-label="Voltar"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          
          <img 
            src={logoUrl}
            alt="Kylie Lovers BR Logo"
            onClick={onGoHome}
            className="h-8 md:h-10 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            title="Voltar para o Início"
          />
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
           {/* Breadcrumbs / Selectors */}
           <div className="flex items-center gap-2 text-sm md:text-base">
             
             {/* Category Selector */}
             {selectedCategory && (
               <div className="relative group flex items-center">
                 <select
                    value={selectedCategory}
                    onChange={(e) => onSelectCategory(e.target.value)}
                    className="appearance-none bg-transparent text-gray-400 font-bold uppercase tracking-widest cursor-pointer hover:text-klbr transition-colors pr-4 focus:outline-none"
                    aria-label="Selecionar categoria"
                 >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-black text-gray-300">
                        {cat.title}
                      </option>
                    ))}
                 </select>
                 <ChevronDown size={12} className="absolute right-0 text-gray-500 pointer-events-none group-hover:text-klbr" />
               </div>
             )}
             
             {/* Divider */}
             {selectedCategory && selectedYear && (
               <span className="text-gray-600">/</span>
             )}

             {/* Year Selector */}
             {selectedYear ? (
               <div className="relative group flex items-center">
                 <select
                   value={selectedYear}
                   onChange={(e) => onSelectYear(Number(e.target.value))}
                   className="appearance-none bg-transparent text-white font-bold uppercase tracking-widest cursor-pointer hover:text-klbr transition-colors pr-6 focus:outline-none text-right md:text-left"
                   aria-label="Selecionar ano"
                 >
                   {years.map((year) => (
                     <option key={year} value={year} className="bg-black text-gray-300">
                       {year}
                     </option>
                   ))}
                 </select>
                 <ChevronDown size={14} className="absolute right-0 text-gray-400 pointer-events-none group-hover:text-klbr" />
               </div>
             ) : (
               /* Show "Galeria" only if no year is selected AND no category (Home state handled by logo, this is fallback) */
               !selectedCategory && (
                 <span className="text-gray-400 hidden md:block uppercase tracking-widest font-xs">
                   Galeria
                 </span>
               )
             )}
           </div>

           <div className="h-6 w-px bg-white/10 mx-1 hidden md:block"></div>

           <button 
             onClick={onOpenMenu}
             className="p-2 text-white hover:text-klbr transition-colors"
             aria-label="Abrir Menu"
           >
             <Menu size={24} />
           </button>
        </div>
      </div>
    </nav>
  );
};