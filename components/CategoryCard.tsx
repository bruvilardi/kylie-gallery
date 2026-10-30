
import React, { useState, useEffect } from 'react';
import { Category, CloudinaryListResponse } from '../types';
import { Image as ImageIcon } from 'lucide-react';
import { getOptimizedUrl, generateSrcSet } from '../constants';

interface CategoryCardProps {
  category: Category;
  onClick: (id: string) => void;
}

const CLOUD_NAME = 'Kylie-gallery';

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const [displayImage, setDisplayImage] = useState<string | null>(category.coverImage);
  const [srcSet, setSrcSet] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMainCover = async () => {
      try {
        const tagName = `main_${category.id}`;
        const response = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tagName}.json`);
        
        if (response.ok) {
          const data: CloudinaryListResponse = await response.json();
          
          if (data.resources && data.resources.length > 0) {
            const sortedResources = data.resources.sort((a, b) => {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            const latestResource = sortedResources[0];
            
            if (isMounted) {
              setDisplayImage(getOptimizedUrl(latestResource.version, latestResource.public_id));
              setSrcSet(generateSrcSet(latestResource.version, latestResource.public_id));
            }
          }
        }
      } catch (error) {}
    };

    fetchMainCover();

    return () => {
      isMounted = false;
    };
  }, [category.id]);

  return (
    <div 
      onClick={() => onClick(category.id)}
      className="group relative w-full aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transform hover:scale-[1.02] bg-[#1a1a1a]"
    >
      {displayImage ? (
        <img 
          src={displayImage}
          srcSet={srcSet}
          // Sizes agressivos para mobile/desktop
          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 25vw"
          alt={category.title}
          onLoad={() => setIsLoaded(true)}
          // Alta prioridade para imagens de categoria (são a "hero" da home)
          fetchPriority="high"
          loading="eager"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 
            ${isLoaded ? 'opacity-100' : 'opacity-0'} 
            ${displayImage !== category.coverImage ? 'animate-fade-in' : ''}`}
        />
      ) : null}
      
      <div className={`absolute inset-0 bg-[#1a1a1a] -z-10 flex items-center justify-center transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
         <div className="text-white/10 group-hover:text-white/20 transition-colors">
            <ImageIcon size={64} strokeWidth={1} />
         </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
      
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg leading-tight">
          {category.title}
        </h2>
        
        <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-[max-height] duration-500 ease-out">
           <p className="text-gray-300 text-lg pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
};
