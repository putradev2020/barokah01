import React, { useState, useEffect } from 'react';
import { Shield, Clock, Users, Star, CheckCircle, ArrowRight, Phone, MapPin, ChevronLeft, ChevronRight, Monitor, Laptop, Printer } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typewriterText1, setTypewriterText1] = useState('');
  const [typewriterText2, setTypewriterText2] = useState('');
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);

  const fullText1 = 'Cepat, Bergaransi, Teknisi Berpengalaman';
  const fullText2 = 'Solusi terpercaya untuk semua masalah printer Anda. Melayani service printer Canon, Epson, HP, Brother, dan semua merk lainnya dengan garansi resmi.';

  const heroImages = [
    '/img/1.jpeg',
    '/img/2.jpeg',
    '/img/3.jpeg',
    '/img/4.jpeg',
    '/img/5.jpeg'
  ];

  const features = [
    {
      icon: Shield,
      title: 'Bergaransi',
      description: 'Semua perbaikan dilengkapi garansi resmi untuk kepuasan Anda'
    },
    {
      icon: Clock,
      title: 'Cepat & Tepat',
      description: 'Service express dengan waktu pengerjaan yang efisien'
    },
    {
      icon: Users,
      title: 'Teknisi Berpengalaman',
      description: 'Tim teknisi profesional dengan pengalaman 5+ tahun'
    },
    {
      icon: Star,
      title: 'Rating 4.9/5',
      description: 'Kepercayaan dari 1000+ pelanggan puas'
    }
  ];

  const supportedBrands = [
    '🔰 Canon 🔰', '🔰 Epson 🔰', '🔰 HP 🔰', '🔰 Brother 🔰', '🔰 Xerox 🔰'
  ];

  const serviceCategories = {
    komputer: [
      'Install Ulang Windows',
      'Upgrade RAM & Storage',
      'Cleaning & Maintenance',
      'Virus Removal & Security',
      'Data Recovery',
      'Network Setup & Configuration'
    ],
    laptop: [
      'Ganti Keyboard',
      'Ganti LCD/LED Screen',
      'Ganti Baterai',
      'Repair Charging Port',
      'Cooling System Repair',
      'Motherboard Repair'
    ],
    printer: [
      'Head Cleaning & Maintenance',
      'Refill Tinta Original',
      'Ganti Cartridge',
      'Paper Jam Repair',
      'Roller Cleaning',
      'Driver Installation'
    ]
  };

  const services = [
    'Service & Perbaikan Printer',
    'Refill Tinta Original',
    'Reset Printer Error',
    'Instalasi Driver & Software',
    'Konsultasi Gratis'
  ];

  // Typewriter effect with loop
  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    let timeout3: NodeJS.Timeout;
    let timeout4: NodeJS.Timeout;
    let cursorInterval1: NodeJS.Timeout;
    let cursorInterval2: NodeJS.Timeout;
    let isActive = true;

    // First text animation (typing)
    const animateText1 = () => {
      if (!isActive) return;
      let i = 0;
      const typeInterval = setInterval(() => {
        if (!isActive) {
          clearInterval(typeInterval);
          return;
        }
        if (i < fullText1.length) {
          setTypewriterText1(fullText1.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setShowCursor1(false);
          setShowCursor2(true);
          // Start second text after first is complete
          timeout2 = setTimeout(animateText2, 500);
        }
      }, 50);
    };

    // Second text animation (typing)
    const animateText2 = () => {
      if (!isActive) return;
      let i = 0;
      const typeInterval = setInterval(() => {
        if (!isActive) {
          clearInterval(typeInterval);
          return;
        }
        if (i < fullText2.length) {
          setTypewriterText2(fullText2.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setShowCursor2(false);
          // Wait 3 seconds then start erasing
          timeout3 = setTimeout(eraseText2, 3000);
        }
      }, 30);
    };

    // Erase second text
    const eraseText2 = () => {
      if (!isActive) return;
      let i = fullText2.length;
      setShowCursor2(true);
      const eraseInterval = setInterval(() => {
        if (!isActive) {
          clearInterval(eraseInterval);
          return;
        }
        if (i > 0) {
          setTypewriterText2(fullText2.slice(0, i - 1));
          i--;
        } else {
          clearInterval(eraseInterval);
          setShowCursor2(false);
          // Start erasing first text
          timeout4 = setTimeout(eraseText1, 500);
        }
      }, 20);
    };

    // Erase first text
    const eraseText1 = () => {
      if (!isActive) return;
      let i = fullText1.length;
      setShowCursor1(true);
      const eraseInterval = setInterval(() => {
        if (!isActive) {
          clearInterval(eraseInterval);
          return;
        }
        if (i > 0) {
          setTypewriterText1(fullText1.slice(0, i - 1));
          i--;
        } else {
          clearInterval(eraseInterval);
          setShowCursor1(true);
          // Restart the cycle
          timeout1 = setTimeout(animateText1, 1000);
        }
      }, 30);
    };

    // Cursor blinking
    cursorInterval1 = setInterval(() => {
      setShowCursor1(prev => prev);
    }, 500);

    cursorInterval2 = setInterval(() => {
      setShowCursor2(prev => prev);
    }, 500);

    // Start animation after component mounts
    timeout1 = setTimeout(animateText1, 1000);

    return () => {
      isActive = false;
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearInterval(cursorInterval1);
      clearInterval(cursorInterval2);
    };
  }, []);

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-white py-20 relative" 
        data-aos="fade-in" 
        data-aos-duration="1000"
        style={{
          backgroundImage: 'url(https://img.pikbest.com/backgrounds/20200516/golden-light-bokeh--image-created-by-soft-and-blur-style-for-background--wallpaper-and-bac-v_1763547jpg!sw800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-yellow-100 bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right" data-aos-delay="200">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Service Printer
                <span className="text-yellow-400"> Segala Merk</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-8 text-black font-bold min-h-[2rem] sm:min-h-[3rem]" data-aos="fade-up" data-aos-delay="400">
                 {typewriterText1}
                 {showCursor1 && <span className="animate-pulse">|</span>}
               </p>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-8 text-white min-h-[3rem] sm:min-h-[4rem]" data-aos="fade-up" data-aos-delay="600">
                {typewriterText2}
                {showCursor2 && <span className="animate-pulse">|</span>}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-8" data-aos="fade-up" data-aos-delay="800">
                <button
                  onClick={() => onNavigate('booking')}
                  className="bg-yellow-400 text-blue-900 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2 card-hover-bounce w-full sm:w-auto"
                >
                  <span>Booking Sekarang</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
                  className="border-2 border-white text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-white hover:text-blue-800 transition-colors flex items-center justify-center space-x-2 card-hover-bounce w-full sm:w-auto"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Hubungi Teknisi</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-blue-200" data-aos="fade-up" data-aos-delay="1000">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Melayani Kota Jambi & Sekitarnya</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Service Harian</span>
                </div>
              </div>
            </div>

            {/* Image Slider */}
            <div className="relative mt-8 lg:mt-0 lg:w-full xl:w-[110%] 2xl:w-[115%]" data-aos="fade-left" data-aos-delay="300">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden card-hover-glow">
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96 rounded-lg overflow-hidden shadow-2xl">
                  {/* Images */}
                  <div 
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {heroImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Printer Service ${index + 1}`}
                        className="w-full h-full object-cover flex-shrink-0"
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors card-hover-scale"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors card-hover-scale"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors card-hover-scale ${
                          currentSlide === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-bold shadow-lg card-hover-bounce" data-aos="bounce" data-aos-delay="1200">
                  Service Express!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 animated-bg mobile-fade-left">
        {/* Animated Cubes */}
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        
        {/* Floating Particles */}
        <div className="floating-particles">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-4">
              Mengapa Pilih Barokah Printer?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Kepercayaan adalah prioritas utama kami
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center card-hover transform hover:scale-105 hover:z-10"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="bg-blue-100 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Brands */}
      <section className="py-20 animated-bg">
        {/* Animated Cubes */}
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        
        {/* Floating Particles */}
        <div className="floating-particles">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
              Merk Printer yang Kami Support
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Semua merk printer ditangani oleh teknisi berpengalaman
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full px-4">
            {supportedBrands.map((brand, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 text-center transform hover:scale-105 md:hover:scale-125 hover:z-20 hover:-translate-y-1 md:hover:-translate-y-2 w-full h-32 sm:h-40 md:h-48 lg:h-64 flex flex-col justify-center items-center group cursor-pointer"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="h-30 w-25 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-40 lg:w-36 xl:h-35 xl:w-35 bg-white rounded-lg md:rounded-2xl mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 flex items-center justify-center p-2 sm:p-6 md:p-4 lg:p-5 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={(() => {
                      const brandLogos: { [key: string]: string } = {
                        '🔰 Canon 🔰': 'https://global.canon/en/corporate/logo/img/logo_01.png',
                        '🔰 Epson 🔰': 'https://logos-world.net/wp-content/uploads/2020/12/Epson-Logo.png',
                        '🔰 HP 🔰': 'https://logos-world.net/wp-content/uploads/2020/07/HP-Logo.png',
                        '🔰 Brother 🔰': 'https://1000logos.net/wp-content/uploads/2021/05/Brother-logo.png',
                        '🔰 Xerox 🔰': 'https://img.favpng.com/15/25/0/xerox-logo-photocopier-printer-company-png-favpng-ufBabQjnXnRWn29MgcaFiqsyr.jpg'
                      };
                      return brandLogos[brand] || `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112"><rect width="112" height="112" fill="#f3f4f6"/><text x="56" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#374151">${brand.replace(/🔰|\s/g, '')[0]}</text></svg>`)}`;
                    })()} 
                    alt={`${brand} logo`}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbackLogos: { [key: string]: string } = {
                        '🔰 Canon 🔰': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Canon_wordmark.svg/320px-Canon_wordmark.svg.png',
                        '🔰 Epson 🔰': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Epson_logo.svg/320px-Epson_logo.svg.png',
                        '🔰 HP 🔰': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/320px-HP_logo_2012.svg.png',
                        '🔰 Brother 🔰': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Brother_logo.svg/320px-Brother_logo.svg.png',
                        '🔰 Xerox 🔰': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Xerox_logo.svg/320px-Xerox_logo.svg.png'
                      };
                      target.src = fallbackLogos[brand] || `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112"><rect width="112" height="112" fill="#f3f4f6"/><text x="56" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#374151">${brand.replace(/🔰|\s/g, '')[0]}</text></svg>`)}`;
                    }}
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg group-hover:text-blue-600 transition-colors duration-300">{brand}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Video */}
      <section 
        className="py-20 text-white mobile-fade-left relative" 
        data-aos="fade-up"
        style={{
          backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/011/171/111/small_2x/white-background-with-orange-geometric-free-vector.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 px-4">
                Layanan Lengkap
              </h2>
              
              {/* Service Categories */}
              <div className="space-y-4 md:space-y-6 lg:space-y-8 px-4">
                {/* Komputer Services */}
                <div className="bg-yellow-500/60 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                    <div className="bg-blue-400 p-1.5 md:p-2 rounded-md md:rounded-lg">
                      <Monitor className="h-4 w-4 md:h-6 md:w-6 text-blue-900" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-900">Layanan Komputer</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {serviceCategories.komputer.map((service, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-2 md:space-x-3 p-1.5 md:p-2 rounded-md md:rounded-lg hover:bg-blue-500/80 transition-colors"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                      >
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Laptop Services */}
                <div className="bg-yellow-500/60 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                    <div className="bg-blue-400 p-1.5 md:p-2 rounded-md md:rounded-lg">
                      <Laptop className="h-4 w-4 md:h-6 md:w-6 text-blue-900" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-900">Layanan Laptop</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {serviceCategories.laptop.map((service, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-2 md:space-x-3 p-1.5 md:p-2 rounded-md md:rounded-lg hover:bg-blue-500/80 transition-colors"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                      >
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Printer Services */}
                <div className="bg-yellow-500/60 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                    <div className="bg-blue-400 p-1.5 md:p-2 rounded-md md:rounded-lg">
                      <Printer className="h-4 w-4 md:h-6 md:w-6 text-blue-900" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-900">Layanan Printer</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {serviceCategories.printer.map((service, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-2 md:space-x-3 p-1.5 md:p-2 rounded-md md:rounded-lg hover:bg-blue-500/80 transition-colors"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                      >
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onNavigate('services')}
                className="mt-6 md:mt-8 bg-yellow-400 text-blue-900 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-yellow-300 transition-colors card-hover-bounce mx-4"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                Lihat Semua Layanan
              </button>
            </div>

            {/* YouTube Video */}
            <div className="relative mt-8 lg:mt-0 h-full flex flex-col" data-aos="fade-left" data-aos-delay="300">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 card-hover-glow mx-4 lg:mx-0 lg:mr-[-2rem] xl:mr-[-4rem] 2xl:mr-[-6rem] flex-1">
                <div className="relative w-full lg:w-[110%] xl:w-[120%] 2xl:w-[130%] h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] rounded-lg overflow-hidden shadow-xl md:shadow-2xl">
                  <iframe
                    src="https://www.youtube.com/embed/oUfRTOqXBI4?autoplay=1&mute=1&loop=1&playlist=oUfRTOqXBI4&controls=1&modestbranding=1&rel=0"
                    title="Printer Service Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="absolute -bottom-2 md:-bottom-4 -right-2 md:-right-4 bg-yellow-400 text-blue-900 px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-md md:rounded-lg font-bold text-xs sm:text-sm md:text-base shadow-lg card-hover-bounce" data-aos="bounce" data-aos-delay="1000">
                  Lihat Proses Service!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-900 text-white" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 md:mb-6" data-aos="fade-up">
            Printer Bermasalah? Hubungi Kami Sekarang!
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-gray-300" data-aos="fade-up" data-aos-delay="200">
            Teknisi berpengalaman siap membantu mengatasi semua masalah printer Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
            <button
              onClick={() => onNavigate('booking')}
              className="bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-blue-700 transition-colors card-hover-bounce"
            >
              Booking Service Online
            </button>
            <button
              onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
              className="bg-green-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 card-hover-bounce"
            >
              <Phone className="h-4 w-4 md:h-5 md:w-5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;