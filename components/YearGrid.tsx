
import React, { useState, useEffect } from 'react';
import { Folder } from 'lucide-react';
import { SeloK } from './SeloK';
import { SPECIFIC_ALBUMS } from '../constants';

interface YearGridProps {
  years: number[];
  category: string;
  onSelectYear: (year: number) => void;
}

const CLOUD_NAME = 'Kylie-gallery';

export const YearGrid: React.FC<YearGridProps> = ({ years, category, onSelectYear }) => {
  const [activeYears, setActiveYears] = useState<Set<number>>(new Set());
  const [loadingDiscovery, setLoadingDiscovery] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingDiscovery(true);

    const discoverActiveYears = async () => {
      // 1. Inicia com anos que já sabemos que têm conteúdo via SPECIFIC_ALBUMS
      const found = new Set<number>();
      years.forEach(year => {
        if (SPECIFIC_ALBUMS[`${category}_${year}`]) {
          found.add(year);
        }
      });

      // 2. Tenta buscar um "índice global" ou verificar os anos dinamicamente
      // Como não há API de busca global client-side, fazemos pings inteligentes
      // Focamos nos anos mais recentes ou fazemos pings paralelos controlados
      try {
        // Ping paralelo para todos os anos para verificar existência da tag de lista
        // Usamos Promise.all mas filtramos os que já foram encontrados pelo catálogo
        const yearsToCheck = years.filter(y => !found.has(y));
        
        // Fazemos os pings em lotes para não travar o browser
        const batchSize = 10;
        for (let i = 0; i < yearsToCheck.length; i += batchSize) {
            if (!isMounted) break;
            const batch = yearsToCheck.slice(i, i + batchSize);
            
            await Promise.all(batch.map(async (year) => {
                try {
                    const tag = `${category.toLowerCase()}_${year}`;
                    const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`);
                    if (res.ok) {
                        found.add(year);
                    }
                } catch (e) { /* Falha silenciosa = ano vazio */ }
            }));
            
            if (isMounted) setActiveYears(new Set(found));
        }
      } catch (err) {
        console.warn("Erro na descoberta de anos ativos", err);
      } finally {
        if (isMounted) setLoadingDiscovery(false);
      }
    };

    discoverActiveYears();
    return () => { isMounted = false; };
  }, [category, years]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
      {years.map((year, index) => {
        const hasContent = activeYears.has(year);
        
        return (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            className={`group relative w-full p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-5 overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-klbr text-left
              ${hasContent ? 'opacity-100' : 'opacity-25 grayscale hover:opacity-100 hover:grayscale-0'}
              ${hasContent ? 'hover:bg-white/10 hover:border-klbr/50' : 'hover:bg-white/5 hover:border-white/20'}`}
            style={{ animationDelay: `${index * 0.01}s` }}
          >
            {/* Hover Gradient Background */}
            {hasContent && (
              <div className="absolute inset-0 bg-gradient-to-r from-klbr/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
            
            {/* Icon Container */}
            <div className="relative shrink-0">
              <Folder 
                size={48} 
                strokeWidth={1.5}
                className={`transition-colors duration-300 ${hasContent ? 'text-gray-400 group-hover:text-klbr' : 'text-gray-700'}`} 
              />
              <div className="absolute inset-0 flex items-center justify-center pt-0.5">
                <SeloK 
                  className={`h-5 w-auto transition-colors duration-300 ${hasContent ? 'text-gray-400 group-hover:text-klbr' : 'text-gray-700'}`} 
                />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col z-10">
              <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${hasContent ? 'text-gray-200 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                {year}
              </span>
              <span className={`text-[10px] uppercase tracking-widest transition-colors ${hasContent ? 'text-gray-500 group-hover:text-klbr/80' : 'text-gray-700'}`}>
                {hasContent ? 'Ver coleção' : 'Vazio'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
