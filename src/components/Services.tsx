import React from 'react';
import { useState, useEffect } from 'react';
import { fetchProblemCategories } from '../utils/supabaseData';
import { DivideIcon as LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../utils/supabase';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const [problemCategories, setProblemCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchProblemCategories();
        setProblemCategories(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();

    // Setup realtime subscriptions
    const categoriesChannel = supabase
      .channel('problem_categories_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'problem_categories'
      }, () => {
        fetchProblemCategories().then(setProblemCategories);
      })
      .subscribe();

    const problemsChannel = supabase
      .channel('problems_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'problems'
      }, () => {
        fetchProblemCategories().then(setProblemCategories);
      })
      .subscribe();

    // Cleanup subscriptions
     return () => {
       supabase.removeChannel(categoriesChannel);
       supabase.removeChannel(problemsChannel);
     };
   }, []);

  const getIcon = (iconName: string): LucideIcon => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon;
    return IconComponent || Icons.AlertCircle;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Ringan';
      case 'medium':
        return 'Sedang';
      case 'high':
        return 'Berat';
      default:
        return 'Normal';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat layanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 animated-bg relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 pointer-events-none"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/ee/62/b3/ee62b341b7cfee91d15b05216029e048.jpg)'
        }}
      ></div>
      
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
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16" data-aos="fade-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Kategori Kerusakan Printer
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Kami menangani semua jenis kerusakan printer dari berbagai merk. 
            Temukan masalah printer Anda dan dapatkan solusi terbaik dari teknisi berpengalaman.
          </p>
        </div>

        {/* Service Categories */}
        <div className="space-y-8 sm:space-y-12 lg:space-y-16 mobile-fade-left">
          {problemCategories.map((category, categoryIndex) => {
            const IconComponent = getIcon(category.icon);
            
            return (
              <div 
                key={category.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover-glow"
                data-aos="fade-up"
                data-aos-delay={categoryIndex * 200}
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 lg:p-8" data-aos="fade-right" data-aos-delay={categoryIndex * 200 + 100}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{category.name}</h2>
                        <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                          {category.problems.length} jenis kerusakan yang dapat ditangani
                        </p>
                      </div>
                    </div>
                    
                    {/* Brand Logos */}
                    <div className="hidden lg:flex items-center space-x-4 mt-4 sm:mt-0">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img 
                          src="https://global.canon/en/corporate/logo/img/logo_01.png" 
                          alt="Canon" 
                          className="h-12 sm:h-14 lg:h-16 w-auto bg-white rounded px-2 sm:px-3 py-1.5 sm:py-2 opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                        />
                        <img 
                          src="https://logos-world.net/wp-content/uploads/2020/12/Epson-Logo.png" 
                          alt="Epson" 
                          className="h-12 sm:h-14 lg:h-16 w-auto bg-white rounded px-2 sm:px-3 py-1.5 sm:py-2 opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                        />
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/320px-HP_logo_2012.svg.png" 
                          alt="HP" 
                          className="h-12 sm:h-14 lg:h-16 w-auto bg-white rounded px-2 sm:px-3 py-1.5 sm:py-2 opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                        />
                        <img 
                          src="https://1000logos.net/wp-content/uploads/2021/05/Brother-logo.png" 
                          alt="Brother" 
                          className="h-12 sm:h-14 lg:h-16 w-auto bg-white rounded px-2 sm:px-3 py-1.5 sm:py-2 opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                        />
                        <img 
                          src="https://img.favpng.com/15/25/0/xerox-logo-photocopier-printer-company-png-favpng-ufBabQjnXnRWn29MgcaFiqsyr.jpg" 
                          alt="Xerox" 
                          className="h-12 sm:h-14 lg:h-16 w-auto bg-white rounded px-2 sm:px-3 py-1.5 sm:py-2 opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Brand Logos */}
                  <div className="lg:hidden mt-3 sm:mt-4">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3 flex-wrap gap-1.5 sm:gap-2">
                      <img 
                        src="https://global.canon/en/corporate/logo/img/logo_01.png" 
                        alt="Canon" 
                        className="h-6 sm:h-10 w-auto bg-white rounded px-1 sm:px-5 py-4.5 opacity-90 shadow-sm"
                      />
                      <img 
                        src="https://logos-world.net/wp-content/uploads/2020/12/Epson-Logo.png" 
                        alt="Epson" 
                        className="h-6 sm:h-10 w-auto bg-white rounded px-1 sm:px-5 py-4.5 opacity-90 shadow-sm"
                      />
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/320px-HP_logo_2012.svg.png" 
                        alt="HP" 
                        className="h-6 sm:h-10 w-auto bg-white rounded px-1 sm:px-5 py-4.5 opacity-90 shadow-sm"
                      />
                      <img 
                        src="https://1000logos.net/wp-content/uploads/2021/05/Brother-logo.png" 
                        alt="Brother" 
                        className="h-6 sm:h-10 w-auto bg-white rounded px-1 sm:px-5 py-4.5 opacity-90 shadow-sm"
                      />
                      <img 
                        src="https://img.favpng.com/15/25/0/xerox-logo-photocopier-printer-company-png-favpng-ufBabQjnXnRWn29MgcaFiqsyr.jpg" 
                        alt="Xerox" 
                        className="h-6 sm:h-10 w-auto bg-white rounded px-1 sm:px-5 py-4.5 opacity-90 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {category.problems.map((problem, problemIndex) => (
                      <div
                        key={problem.id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow card-hover-subtle"
                        data-aos="zoom-in"
                        data-aos-delay={categoryIndex * 200 + problemIndex * 100}
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
                            {problem.name}
                          </h3>
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 ${getSeverityColor(
                              problem.severity
                            )}`}
                          >
                            {getSeverityLabel(problem.severity)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                          {problem.description}
                        </p>
                        
                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Estimasi Waktu:</span>
                            <span className="font-medium text-gray-900">
                              {problem.estimatedTime}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Estimasi Biaya:</span>
                            <span className="font-medium text-blue-600">
                              {problem.estimatedCost}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16" data-aos="fade-up" data-aos-delay="400">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 lg:p-12 card-hover-glow">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">
              Tidak Menemukan Masalah Printer Anda?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8">
              Konsultasikan masalah printer Anda dengan teknisi berpengalaman kami
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center" data-aos="fade-up" data-aos-delay="600">
              <button
                onClick={() => onNavigate('booking')}
                className="bg-yellow-400 text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-yellow-300 transition-colors card-hover-bounce"
              >
                Booking Service Sekarang
              </button>
              <button
                onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
                className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors card-hover-bounce"
              >
                Konsultasi Gratis
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 sm:mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mobile-fade-left">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md text-center card-hover" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icons.Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Garansi Resmi</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Semua perbaikan dilengkapi garansi resmi untuk memberikan ketenangan pikiran
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md text-center card-hover" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icons.Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Service Cepat</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Pengerjaan express dengan waktu tunggu minimal untuk kepuasan pelanggan
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md text-center card-hover sm:col-span-2 lg:col-span-1" data-aos="fade-up" data-aos-delay="600">
            <div className="bg-yellow-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icons.Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Teknisi Ahli</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Tim teknisi profesional dengan pengalaman lebih dari 5 tahun
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;