
import React, { useState, useEffect } from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { Photo, CloudinaryListResponse, CloudinaryResource } from '../types';
import { getOptimizedUrl, generateSrcSet } from '../constants';

interface PhotoGridProps {
  category: string;
  year: number;
  albumId?: string;
  coverTag?: string; 
  onPhotoClick: (photo: Photo) => void;
  onPhotosLoaded?: (count: number) => void;
  onPhotosFetched?: (photos: Photo[]) => void;
}

const CLOUD_NAME = 'Kylie-gallery';

export const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  category, 
  year, 
  albumId, 
  coverTag,
  onPhotoClick, 
  onPhotosLoaded,
  onPhotosFetched 
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchPhotos = async () => {
      if (!albumId) { setLoading(false); return; }

      try {
        let allResources: CloudinaryResource[] = [];
        let fetchedViaSpecificTag = false;

        const albumPromise = fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${albumId}.json`)
            .then(res => res.ok ? res.json() : null)
            .then(data => data ? (data as CloudinaryListResponse).resources : [])
            .catch(() => []);

        const coverPromise = (coverTag && coverTag !== albumId) 
            ? fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${coverTag}.json`)
                .then(res => res.ok ? res.json() : null)
                .then(data => data ? (data as CloudinaryListResponse).resources : [])
                .catch(() => [])
            : Promise.resolve([]);

        const [albumResources, coverResources] = await Promise.all([albumPromise, coverPromise]);

        if (albumResources.length > 0) {
            allResources = [...albumResources];
            fetchedViaSpecificTag = true;
        }

        if (albumResources.length === 0) {
            const fallbackTag = (category.toLowerCase() === 'artwork' || category.toLowerCase() === 'video') 
                ? category.toLowerCase() 
                : `${category}_${year}`;
            
            try {
                const response = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${fallbackTag}.json`);
                if (response.ok) {
                    const data: CloudinaryListResponse = await response.json();
                    allResources = data.resources || [];
                }
            } catch (e) {}
        }

        if (coverResources.length > 0) allResources = [...allResources, ...coverResources];

        if (isMounted) {
            if (!fetchedViaSpecificTag) {
                const idParts = albumId.match(/([^_]+)_(\d{4})_(.+)$/);
                if (idParts) {
                    const targetSlug = idParts[3].toLowerCase();
                    const parserRegex = new RegExp(`(?:^|/)(${category})_(\\d{4})_(.+)$`, 'i');

                    allResources = allResources.filter(res => {
                        const match = res.public_id.match(parserRegex);
                        if (!match) return false;
                        let rawSlug = match[3].replace(/\.[^/.]+$/, "").replace(/[-_]cover$/i, '').replace(/[-_]\d+$/, '');
                        return rawSlug.toLowerCase() === targetSlug;
                    });
                }
            }

            const uniqueMap = new Map<string, CloudinaryResource>();
            allResources.forEach(res => uniqueMap.set(res.public_id, res));
            const uniqueResources = Array.from(uniqueMap.values());

            const cloudinaryPhotos: Photo[] = uniqueResources.map((res) => {
              return {
                id: res.public_id,
                // Fullscreen URL (maior qualidade)
                url: getOptimizedUrl(res.version, res.public_id), 
                // Grid URL (gerenciada via srcSet, mas mantemos uma base)
                thumbnailUrl: getOptimizedUrl(res.version, res.public_id, 500), 
                title: '', 
                width: res.width,
                height: res.height,
                // Propriedades extras para srcSet
                version: res.version,
                public_id: res.public_id
              } as Photo & { version: number, public_id: string };
            });
            
            cloudinaryPhotos.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

            setPhotos(cloudinaryPhotos);
            setLoading(false);
            if (onPhotosLoaded) onPhotosLoaded(cloudinaryPhotos.length);
            if (onPhotosFetched) onPhotosFetched(cloudinaryPhotos);
        }
      } catch (error) {
        if (isMounted) { setPhotos([]); setLoading(false); }
      }
    };

    fetchPhotos();
    return () => { isMounted = false; };
  }, [category, year, albumId, coverTag, onPhotosLoaded, onPhotosFetched]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-klbr animate-spin" /></div>;

  if (photos.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 gap-4 text-center px-4">
        <ImageOff size={48} className="opacity-20 text-klbr" />
        <div className="space-y-1">
          <p className="text-xl font-light text-white">Nada por aqui (por enquanto)</p>
          <p className="text-sm text-gray-500">Este álbum ainda não possui fotos publicadas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up">
      {photos.map((photo, index) => {
        // As 4 primeiras fotos carregam "eager" para melhorar LCP, o resto "lazy"
        const isPriority = index < 4;
        const p = photo as Photo & { version: number, public_id: string };

        return (
          <div 
            key={photo.id}
            onClick={() => onPhotoClick(photo)}
            className="group relative aspect-[6/7] rounded-xl overflow-hidden cursor-zoom-in bg-gray-900 border border-white/5 shadow-lg transition-all duration-300 hover:z-10 hover:scale-105"
            style={{ contentVisibility: 'auto' }} // Otimização de renderização
          >
            <img 
              src={photo.thumbnailUrl}
              srcSet={generateSrcSet(p.version, p.public_id)}
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt={photo.title}
              loading={isPriority ? "eager" : "lazy"}
              fetchPriority={isPriority ? "high" : "auto"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>
        );
      })}
    </div>
  );
};
