
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CategoryCard } from './components/CategoryCard';
import { YearGrid } from './components/YearGrid';
import { AlbumGrid } from './components/AlbumGrid';
import { PhotoGrid } from './components/PhotoGrid';
import { ImageViewer } from './components/ImageViewer';
import { Sidebar } from './components/Sidebar';
import { CATEGORIES, YEARS, getAllArtworkAlbums, getAllVideoAlbums } from './constants';
import { ViewState, Photo, Album } from './types';

const formatTitleFromId = (id: string) => {
  const parts = id.split('_');
  const slug = parts[parts.length - 1];
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentViewPhotos, setCurrentViewPhotos] = useState<Photo[]>([]);

  const displayedYears = useMemo(() => YEARS, []);

  const updateUrl = useCallback((category?: string | null, year?: number | null, album?: Album | null) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('year');
    url.searchParams.delete('album');
    url.searchParams.delete('title');

    if (category) url.searchParams.set('category', category);
    if (year) url.searchParams.set('year', year.toString());
    if (album) {
      url.searchParams.set('album', album.id);
      url.searchParams.set('title', album.title);
    }
    window.history.pushState({}, '', url);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const yearParam = params.get('year');
      const albumIdParam = params.get('album');
      const albumTitleParam = params.get('title');

      if (albumIdParam && catParam) {
        setSelectedCategory(catParam);
        const year = yearParam ? parseInt(yearParam) : 0;
        setSelectedYear(year);
        setSelectedAlbum({
          id: albumIdParam,
          title: albumTitleParam || formatTitleFromId(albumIdParam),
          year: year,
          coverImage: '',
          count: 0
        });
        setView('photos');
      } else if (catParam && (catParam === 'artwork' || catParam === 'video')) {
        setSelectedCategory(catParam);
        setSelectedYear(null);
        setSelectedAlbum(null);
        setView('albums');
      } else if (catParam && yearParam) {
        setSelectedCategory(catParam);
        setSelectedYear(parseInt(yearParam));
        setSelectedAlbum(null);
        setView('albums');
      } else if (catParam) {
        setSelectedCategory(catParam);
        setSelectedYear(null);
        setSelectedAlbum(null);
        setView('years');
      } else {
        setSelectedCategory(null);
        setSelectedYear(null);
        setSelectedAlbum(null);
        setView('categories');
      }
    };
    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    if (id === 'artwork' || id === 'video') {
      setView('albums');
      setSelectedYear(null);
      updateUrl(id, null, null);
    } else {
      setView('years');
      setSelectedYear(null);
      updateUrl(id, null, null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setView('albums');
    updateUrl(selectedCategory, year, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAlbumSelect = (album: Album) => {
    setSelectedAlbum(album);
    setView('photos');
    updateUrl(selectedCategory, selectedYear || album.year, album);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotosLoaded = useCallback((count: number) => {
    setSelectedAlbum(prev => prev ? { ...prev, count } : null);
  }, []);

  const handlePhotosFetched = useCallback((photos: Photo[]) => {
    setCurrentViewPhotos(photos);
  }, []);

  const handleBack = () => {
    if (view === 'photos') {
      setView('albums');
      setSelectedAlbum(null);
      updateUrl(selectedCategory, selectedYear, null);
    } else if (view === 'albums') {
      if (selectedCategory === 'artwork' || selectedCategory === 'video') {
        setView('categories');
        setSelectedCategory(null);
        updateUrl(null, null, null);
      } else {
        setView('years');
        setSelectedYear(null);
        updateUrl(selectedCategory, null, null);
      }
    } else if (view === 'years') {
      setView('categories');
      setSelectedCategory(null);
      updateUrl(null, null, null);
    }
  };

  const handleGoHome = () => {
    setView('categories');
    setSelectedCategory(null);
    setSelectedYear(null);
    setSelectedAlbum(null);
    updateUrl(null, null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lógica de navegação do visualizador de imagens
  const currentIndex = selectedPhoto ? currentViewPhotos.findIndex(p => p.id === selectedPhoto.id) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < currentViewPhotos.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNextPhoto = useCallback(() => {
    if (hasNext) {
      setSelectedPhoto(currentViewPhotos[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, currentViewPhotos]);

  const handlePrevPhoto = useCallback(() => {
    if (hasPrev) {
      setSelectedPhoto(currentViewPhotos[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, currentViewPhotos]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-klbr selection:text-white flex flex-col">
      <Navbar 
        currentView={view} 
        selectedCategory={selectedCategory} 
        selectedYear={selectedYear}
        selectedAlbumTitle={selectedAlbum?.title}
        years={displayedYears}
        onBack={handleBack}
        onOpenMenu={() => setIsMenuOpen(true)}
        onGoHome={handleGoHome}
        onSelectYear={handleYearSelect}
        onSelectCategory={handleCategorySelect}
      />
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onSelectCategory={handleCategorySelect} onGoHome={handleGoHome} />
      <main className="flex-grow pt-24 px-6 pb-12 w-full max-w-7xl mx-auto">
        {view === 'categories' && (
          <div className="space-y-8 animate-fade-in">
             <div className="text-center py-10 flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-extralight tracking-tight mb-4 text-white/90">Galeria oficial</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">A primeira galeria criada por fãs brasileiros para fãs de todo o mundo.</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {CATEGORIES.map((cat) => (<CategoryCard key={cat.id} category={cat} onClick={handleCategorySelect} />))}
            </div>
          </div>
        )}
        {view === 'years' && selectedCategory && (
          <div className="space-y-6">
            <header className="mb-10 animate-fade-in"><h2 className="text-3xl font-light tracking-wide text-white border-b border-white/10 pb-4 inline-block">Selecione o Ano</h2></header>
            <YearGrid 
              years={displayedYears} 
              category={selectedCategory}
              onSelectYear={handleYearSelect} 
            />
          </div>
        )}
        {view === 'albums' && selectedCategory && (
          <div className="space-y-6">
            <header className="mb-10 animate-fade-in">
              <h2 className="text-3xl font-light tracking-wide text-white border-b border-white/10 pb-4 inline-block">
                {selectedCategory === 'artwork' ? 'Discografia & Artwork' : selectedCategory === 'video' ? 'Videoclipes & Bastidores' : `Álbuns de ${selectedYear}`}
              </h2>
            </header>
            <AlbumGrid 
              category={selectedCategory}
              year={selectedYear || 0} 
              staticAlbums={selectedCategory === 'artwork' ? getAllArtworkAlbums() : selectedCategory === 'video' ? getAllVideoAlbums() : undefined}
              onSelectAlbum={handleAlbumSelect} 
            />
          </div>
        )}
        {view === 'photos' && selectedCategory && selectedAlbum && (
          <div className="space-y-6">
             <header className="mb-10 flex flex-col md:flex-row md:items-baseline md:justify-between animate-fade-in gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white text-klbr">{selectedAlbum.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-sm uppercase tracking-widest">{selectedAlbum.year || selectedYear}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-sm uppercase tracking-widest">{selectedCategory}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 border px-3 py-1 rounded-full border-white/10 self-start md:self-auto transition-all duration-500">{selectedAlbum.count} Fotos</div>
            </header>
            <PhotoGrid 
              category={selectedCategory} 
              year={selectedAlbum.year || (selectedYear || 0)}
              albumId={selectedAlbum.id}
              coverTag={selectedAlbum.coverTag}
              onPhotoClick={(p) => setSelectedPhoto(p)}
              onPhotosLoaded={handlePhotosLoaded}
              onPhotosFetched={handlePhotosFetched}
            />
          </div>
        )}
      </main>
      <Footer />
      <ImageViewer 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
        onNext={handleNextPhoto} 
        onPrev={handlePrevPhoto} 
        hasNext={hasNext} 
        hasPrev={hasPrev} 
        currentIndex={currentIndex}
        totalPhotos={currentViewPhotos.length}
      />
    </div>
  );
};

export default App;
