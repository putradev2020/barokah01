import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { fetchGalleryImages } from '../utils/supabaseData';
import { supabase } from '../utils/supabase';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // Load gallery images from database
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const images = await fetchGalleryImages();
        setGalleryImages(images);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGalleryImages();

    // Setup realtime subscription for gallery updates
    const galleryChannel = supabase
      .channel('gallery-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'gallery_images'
      }, () => {
        loadGalleryImages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(galleryChannel);
    };
  }, []);

  const categories = [
    { id: 'all', name: 'Semua', count: galleryImages.length },
    { id: 'service', name: 'Service', count: galleryImages.filter(img => img.category === 'service').length },
    { id: 'workshop', name: 'Workshop', count: galleryImages.filter(img => img.category === 'workshop').length },
    { id: 'team', name: 'Team', count: galleryImages.filter(img => img.category === 'team').length },
    { id: 'products', name: 'Products', count: galleryImages.filter(img => img.category === 'products').length },
    { id: 'store', name: 'Store', count: galleryImages.filter(img => img.category === 'store').length },
    { id: 'equipment', name: 'Equipment', count: galleryImages.filter(img => img.category === 'equipment').length },
    { id: 'parts', name: 'Parts', count: galleryImages.filter(img => img.category === 'parts').length }
  ];

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const openModal = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, currentIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 pointer-events-none"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/ee/62/b3/ee62b341b7cfee91d15b05216029e048.jpg)'
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12" data-aos="fade-right" data-aos-delay="100">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            Galeri <span className="text-blue-600">Barokah Printer</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Lihat koleksi foto layanan, workshop, tim, dan produk kami
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-12 mobile-fade-left px-4" data-aos="fade-left" data-aos-delay="200">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mobile-fade-left px-4" data-aos="fade-right" data-aos-delay="300">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay={index * 50}
              onClick={() => openModal(image, index)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{image.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12 mobile-fade-left" data-aos="fade-left" data-aos-delay="400">
            <p className="text-gray-500 text-lg">Tidak ada foto dalam kategori ini.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative max-w-4xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 sm:p-1"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 p-2 sm:p-1"
                >
                  <ChevronLeft className="h-8 w-8 sm:h-12 sm:w-12" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 p-2 sm:p-1"
                >
                  <ChevronRight className="h-8 w-8 sm:h-12 sm:w-12" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text}
                className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain mx-auto rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 sm:p-6">
                <h3 className="text-white text-base sm:text-xl font-semibold">{selectedImage.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm mt-1">
                  {currentIndex + 1} dari {filteredImages.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;