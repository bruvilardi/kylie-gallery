
import React, { useState, useEffect } from 'react';
import { Album, CloudinaryListResponse, CloudinaryResource } from '../types';
import { Image as ImageIcon, Camera, Loader2, AlertCircle } from 'lucide-react';
import { SPECIFIC_ALBUMS, getOptimizedUrl, CLOUD_NAME } from '../constants';

interface AlbumGridProps {
  category: string;
  year: number;
  staticAlbums?: Album[]; 
  onSelectAlbum: (album: Album) => void;
}


const formatTitle = (slug: string) => {
  if (slug === slug.toUpperCase() && slug.length > 2) return slug;
  return slug.toLowerCase().split(/[-_ ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const AlbumGrid: React.FC<AlbumGridProps> = ({ category, year, staticAlbums, onSelectAlbum }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchAlbums = async () => {
      // 1. MODO CATÁLOGO (Video Stills e Artwork)
      if (staticAlbums && staticAlbums.length > 0) {
          try {
            const hydratedAlbums = await Promise.all(staticAlbums.map(async (album) => {
                let cover = album.coverImage;
                let count = album.count;
                
                // PRIORIDADE 1: Tenta buscar a capa via coverTag específica
                if (album.coverTag) {
                    try {
                        const cRes = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${album.coverTag}.json`);
                        if (cRes.ok) {
                            const cData: CloudinaryListResponse = await cRes.json();
                            if (cData.resources?.length > 0) {
                                const latestCover = cData.resources.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                                cover = getOptimizedUrl(latestCover.version, latestCover.public_id, 600);
                            }
                        }
                    } catch (e) {}
                }

                // PRIORIDADE 2: Busca contagem de fotos e capa fallback
                try {
                    const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${album.id}.json`);
                    if (res.ok) {
                        const data: CloudinaryListResponse = await res.json();
                        count = data.resources?.length || 0;
                        
                        if (!cover && data.resources?.length > 0) {
                            const coverImg = data.resources.find(r => /[-_]cover$/i.test(r.public_id)) || 
                                             data.resources.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                            cover = getOptimizedUrl(coverImg.version, coverImg.public_id, 600);
                        }
                    }
                } catch (err) {}

                return { ...album, coverImage: cover, count };
            }));

            if (isMounted) {
                setAlbums(hydratedAlbums);
                setLoading(false);
            }
          } catch (e) {
             if (isMounted) {
                 setAlbums(staticAlbums);
                 setLoading(false);
             }
          }
          return;
      }

      // 2. MODO MANUAL (Photoshoots/Live por Ano)
      const baseKey = `${category.toLowerCase()}_${year}`;
      const manualAlbums = SPECIFIC_ALBUMS[baseKey];
      if (manualAlbums && manualAlbums.length > 0) {
        try {
          const loadedAlbums: Album[] = [];
          await Promise.all(manualAlbums.map(async (item) => {
             const tag = `${baseKey}_${item.id}`;
             let resources: CloudinaryResource[] = [];
             let cover = '';
             
             if (item.coverTag) {
                try {
                   const coverRes = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${item.coverTag}.json`);
                   if (coverRes.ok) {
                       const coverData: CloudinaryListResponse = await coverRes.json();
                       if (coverData.resources?.length > 0) {
                           cover = getOptimizedUrl(coverData.resources[0].version, coverData.resources[0].public_id, 600);
                       }
                   }
                } catch (err) {}
             }

             try {
               const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`);
               if (res.ok) {
                 const data: CloudinaryListResponse = await res.json();
                 resources = data.resources || [];
               }
             } catch (err) {}

             if (resources.length > 0 || cover) {
                 if (!cover && resources.length > 0) {
                     const coverRes = resources.find(r => /[-_]cover$/i.test(r.public_id)) || resources[0];
                     cover = getOptimizedUrl(coverRes.version, coverRes.public_id, 600);
                 }
                 loadedAlbums.push({ id: tag, title: item.title, coverImage: cover, count: resources.length, year: year });
             }
          }));
          if (isMounted) {
            setAlbums(loadedAlbums.sort((a, b) => a.title.localeCompare(b.title)));
            setLoading(false);
          }
          return;
        } catch (error) {
           if (isMounted) setLoading(false);
           return;
        }
      }

      // 3. MODO DESCOBERTA AUTOMÁTICA
      try {
        const fetchTag = `${category.toLowerCase()}_${year}`;
        const response = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${fetchTag}.json`);
        
        if (response.ok) {
          const data: CloudinaryListResponse = await response.json();
          const resources = data.resources || [];
          const albumMap = new Map<string, { count: number, cover: string, year: number, title: string, resources: CloudinaryResource[] }>();
          const parserRegex = new RegExp(`(?:^|/)(${category})_(\\d{4})_(.+)$`, 'i');

          resources.forEach(res => {
            const match = res.public_id.match(parserRegex);
            if (match) {
                const fileYear = parseInt(match[2]);
                let rawSlug = match[3].replace(/\.[^/.]+$/, "");
                const isCover = /[-_]cover$/i.test(rawSlug);
                let cleanSlug = rawSlug.replace(/[-_]cover$/i, '').replace(/[-_]\d+$/, '');
                let displayTitle = formatTitle(cleanSlug);
                const albumId = `${category.toLowerCase()}_${fileYear}_${cleanSlug.toLowerCase()}`;

                if (!albumMap.has(albumId)) {
                    albumMap.set(albumId, { count: 0, cover: '', year: fileYear, title: displayTitle, resources: [] });
                }
                const entry = albumMap.get(albumId)!;
                entry.count++;
                entry.resources.push(res);
                if (isCover) entry.cover = getOptimizedUrl(res.version, res.public_id, 600);
            }
          });

          const parsedAlbums: Album[] = Array.from(albumMap.entries()).map(([id, data]) => {
            let finalCover = data.cover;
            if (!finalCover && data.resources.length > 0) {
                 data.resources.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                 finalCover = getOptimizedUrl(data.resources[0].version, data.resources[0].public_id, 600);
            }
            return { id, title: data.title, coverImage: finalCover, count: data.count, year: data.year };
          });

          if (isMounted) {
            parsedAlbums.sort((a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title));
            setAlbums(parsedAlbums);
            setLoading(false);
          }
        } else {
           if (isMounted) { setAlbums([]); setLoading(false); }
        }
      } catch (error) {
        if (isMounted) { setAlbums([]); setLoading(false); }
      }
    };

    fetchAlbums();
    return () => { isMounted = false; };
  }, [category, year, staticAlbums]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-klbr animate-spin" /></div>;

  if (albums.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center px-4 animate-fade-in">
            <AlertCircle size={48} className="mb-4 text-klbr opacity-80" />
            <p className="text-xl font-light text-white mb-2">Nada por aqui (por enquanto)</p>
            <p className="text-sm text-gray-400 max-w-md">Esta coleção ainda não possui álbuns registrados ou as tags ainda estão sendo processadas pelo Cloudinary.</p>
        </div>
      )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up">
      {albums.map((album, index) => (
        <div key={album.id} style={{ animationDelay: `${index * 0.05}s` }}>
          <AlbumItem album={album} onClick={onSelectAlbum} />
        </div>
      ))}
    </div>
  );
};

const AlbumItem: React.FC<{ album: Album; onClick: (album: Album) => void }> = ({ album, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
    <button
      onClick={() => onClick(album)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full aspect-[6/7] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-klbr/20 text-left focus:outline-none focus:ring-2 focus:ring-klbr bg-[#111]"
    >
      {album.coverImage ? (
        <img 
            src={album.coverImage} 
            alt={album.title} 
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-white/5 opacity-50 group-hover:opacity-70 transition-opacity"><Camera size={48} className="text-gray-700 mb-2" /></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <div className={`flex items-center gap-2 text-klbr mb-1 transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
           <ImageIcon size={16} /><span className="text-xs font-bold uppercase tracking-wider">Álbum</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1 leading-tight group-hover:text-klbr transition-colors">{album.title}</h3>
        {album.year && <p className="text-sm text-gray-300 font-light">{album.year}</p>}
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest border-t border-white/10 pt-2 inline-block">{album.count} fotos</p>
      </div>
    </button>
    );
}
