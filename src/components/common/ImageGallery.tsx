import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  productName, 
  className = '' 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };
  const openModal = (index: number) => {
    setModalImage(index);
    setShowModal(true);
  };

  const nextModalImage = () => {
    setModalImage((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextModalImage();
    if (e.key === 'ArrowLeft') prevModalImage();
  };

  const getImageUrl = (imageId: string) => {
    // Check if it's already a full URL
    if (imageId.startsWith('http') || imageId.startsWith('/api/')) {
      return imageId;
    }
    // Otherwise, construct the API URL
    return `/api/upload/images/${imageId}`;
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
          <p>No image available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-3 md:space-y-4 ${className}`}>
        {/* Main Image */}
        <div className="relative group">
          <div 
            className="aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={getImageUrl(images[selectedImage])}
              alt={`${productName} - Image ${selectedImage + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
              onClick={() => openModal(selectedImage)}
              draggable={false}
            />
          </div>
          
          {/* Zoom indicator */}
          <div className="hidden md:block absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} />
          </div>

          {/* Navigation arrows for main image */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 md:p-3 shadow-lg opacity-0 md:group-hover:opacity-100 md:opacity-0 transition-opacity touch-manipulation"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} className="md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 md:p-3 shadow-lg opacity-0 md:group-hover:opacity-100 md:opacity-0 transition-opacity touch-manipulation"
                aria-label="Next image"
              >
                <ChevronRight size={16} className="md:w-5 md:h-5" />
              </button>
            </>
          )}

          {/* Mobile image indicator */}
          {images.length > 1 && (
            <div className="md:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedImage ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 touch-manipulation ${
                  selectedImage === index 
                    ? 'border-purple-600 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 md:p-4"
          onClick={() => setShowModal(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-8 md:-top-12 right-0 text-white hover:text-gray-300 transition-colors p-2 touch-manipulation"
              aria-label="Close gallery"
            >
              <X size={24} className="md:w-8 md:h-8" />
            </button>

            {/* Main modal image */}
            <img
              src={getImageUrl(images[modalImage])}
              alt={`${productName} - Image ${modalImage + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevModalImage();
                  }}
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 md:p-3 transition-all touch-manipulation"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="md:w-6 md:h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextModalImage();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 md:p-3 transition-all touch-manipulation"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="md:w-6 md:h-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base">
              {modalImage + 1} / {images.length}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="hidden md:flex absolute -bottom-20 left-1/2 transform -translate-x-1/2 space-x-2 max-w-full overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImage(index);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                      modalImage === index 
                        ? 'border-white' 
                        : 'border-transparent opacity-60 hover:opacity-80'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover select-none"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;