import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const navigation = [
    { name: 'Beranda', id: 'home' },
    { name: 'Layanan', id: 'services' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Cek Barang', id: 'check-status' },
    { name: 'Testimoni', id: 'testimonials' },
    { name: 'Kontak', id: 'contact' }
  ];

  return (
    <header className="relative bg-yellow-100 shadow-lg sticky top-0 z-50 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/0c/3c/d3/0c3cd33bf0753f07db4bc735db8329ff.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-8 right-20 w-1.5 h-1.5 bg-green-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-6 left-1/4 w-1 h-1 bg-yellow-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/img/logo.jpeg" 
                alt="Barokah Printer Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 object-contain"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  mixBlendMode: 'multiply'
                }}
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight transition-colors duration-300 group-hover:text-blue-600">Barokah Printer</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight hidden sm:block">Service Printer Terpercaya</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
            {/* Hidden Admin Link */}
            <button
              onClick={() => onNavigate('root_admin')}
              className="hidden"
              style={{ display: 'none' }}
            >
              Admin
            </button>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
              <span className="font-medium whitespace-nowrap">+62853-6814-8449</span>
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="bg-gray-600 text-white p-2 lg:p-2.5 rounded-lg hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg touch-manipulation"
              title="Admin Login"
            >
              <svg className="h-4 w-4 lg:h-5 lg:w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className="bg-blue-600 text-white px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium text-sm lg:text-base shadow-md hover:shadow-lg whitespace-nowrap touch-manipulation"
            >
              Booking
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Menu className="h-6 w-6 sm:h-7 sm:w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Slide from Left */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Slide Menu */}
            <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="flex flex-col h-full">
                {/* Header */}
                 <div className="flex items-center justify-between p-4 border-b border-gray-200">
                   <div className="flex items-center space-x-2">
                     <img 
                       src="/img/logo.jpeg" 
                       alt="Barokah Printer" 
                       className="h-8 w-8 object-contain"
                     />
                     <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900">Barokah Printer</span>
                <span className="text-[10px] text-gray-600">Service Printer Terpercaya</span>
              </div>
                   </div>
                   <div className="flex items-center space-x-2 ml-auto">
                     <div className="text-right mr-2">
                       <div className="text-[5px] text-gray-500 font-medium">Waktu</div>
                       <div className="text-[7px] font-mono font-bold text-blue-600">
                         {formatTime(currentTime)}
                       </div>
                     </div>
                     <button
                       onClick={() => setIsMenuOpen(false)}
                       className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                     >
                       <X className="h-6 w-6 text-gray-600" />
                     </button>
                   </div>
                 </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-left font-medium text-base transition-all duration-200 touch-manipulation min-h-[48px] flex items-center ${
                        currentPage === item.id
                          ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600 shadow-sm'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
                
                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 px-2 py-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">+62853-6814-8449</span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg flex items-center justify-center touch-manipulation"
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('booking');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg flex items-center justify-center touch-manipulation"
                  >
                    Booking Sekarang
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;