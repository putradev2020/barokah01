import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Calendar, Clock, MapPin, Phone, User, Mail, Printer, CheckCircle } from 'lucide-react';
import { saveBookingToSupabase } from '../utils/bookingSupabase';
import { fetchPrinterBrands, fetchProblemCategories } from '../utils/supabaseData';
import { supabase } from '../utils/supabase';

interface BookingFormProps {
  onNavigate: (page: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onNavigate }) => {
  const [printerBrands, setPrinterBrands] = useState<any[]>([]);
  const [problemCategories, setProblemCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    printerBrand: '',
    printerModel: '',
    problemCategory: '',
    problemDescription: '',
    serviceType: 'antar-ke-toko',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          fetchPrinterBrands(),
          fetchProblemCategories()
        ]);
        setPrinterBrands(brandsData);
        setProblemCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Setup realtime subscriptions
    const brandsChannel = supabase
      .channel('printer_brands_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'printer_brands'
      }, () => {
        fetchPrinterBrands().then(setPrinterBrands);
      })
      .subscribe();

    const modelsChannel = supabase
      .channel('printer_models_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'printer_models'
      }, () => {
        fetchPrinterBrands().then(setPrinterBrands);
      })
      .subscribe();

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
       supabase.removeChannel(brandsChannel);
       supabase.removeChannel(modelsChannel);
       supabase.removeChannel(categoriesChannel);
       supabase.removeChannel(problemsChannel);
     };
   }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedBrand = printerBrands.find(brand => brand.id === formData.printerBrand);
  const selectedCategory = problemCategories.find(cat => cat.id === formData.problemCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save booking to Supabase
      const newBookingId = await saveBookingToSupabase({
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        printerBrand: selectedBrand?.name || formData.printerBrand,
        printerModel: selectedBrand?.models.find(m => m.id === formData.printerModel)?.name || formData.printerModel,
        problemCategory: selectedCategory?.name || formData.problemCategory,
        problemDescription: formData.problemDescription,
        serviceType: formData.serviceType,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        notes: formData.notes
      });
      
      setBookingId(newBookingId);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error saving booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat menyimpan booking. Silakan coba lagi.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      printerBrand: '',
      printerModel: '',
      problemCategory: '',
      problemDescription: '',
      serviceType: 'bring-to-shop',
      appointmentDate: '',
      appointmentTime: '',
      notes: ''
    });
    setCurrentStep(1);
    setIsSuccess(false);
    setBookingId('');
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Show loading while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Success Page
  if (isSuccess) {
    return (
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover-glow" data-aos="zoom-in">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6 lg:p-8 text-white text-center">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Booking Berhasil!</h1>
              <p className="text-green-100 text-sm sm:text-base">Terima kasih atas kepercayaan Anda</p>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8" data-aos="fade-up" data-aos-delay="200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 card-hover-subtle">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">ID Booking Anda</h2>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-blue-600 mb-3 sm:mb-4 break-all">
                    {bookingId}
                  </div>
                  <p className="text-blue-700 text-sm sm:text-base">
                    Simpan ID ini untuk melacak status service printer Anda
                  </p>
                </div>

                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-left">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 card-hover-subtle" data-aos="fade-right" data-aos-delay="400">
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Detail Booking</h3>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nama:</span>
                        <span className="font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">HP:</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Printer:</span>
                        <span className="font-medium">
                          {selectedBrand?.name} {selectedBrand?.models.find(m => m.id === formData.printerModel)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">
                          {formData.serviceType === 'bring-to-shop' ? 'Antar ke Toko' : 'Teknisi Datang'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal:</span>
                        <span className="font-medium">{formData.appointmentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Waktu:</span>
                        <span className="font-medium">{formData.appointmentTime} WIB</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 card-hover-subtle" data-aos="fade-left" data-aos-delay="600">
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Langkah Selanjutnya</h3>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                        <span>Kami akan menghubungi Anda dalam 1-2 jam untuk konfirmasi</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                        <span>Teknisi akan datang sesuai jadwal yang telah ditentukan</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                        <span>Gunakan ID Booking untuk melacak status service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center" data-aos="fade-up" data-aos-delay="800">
                <button
                  onClick={() => onNavigate('check-status')}
                  className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium card-hover-scale text-sm sm:text-base"
                >
                  Cek Status Booking
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/6285368148449?text=Halo, saya baru saja booking service dengan ID ${bookingId}`, '_blank')}
                  className="bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium card-hover-scale text-sm sm:text-base"
                >
                  Hubungi via WhatsApp
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium card-hover-scale text-sm sm:text-base"
                >
                  Booking Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 lg:py-12 bg-gray-50 animated-bg">
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12" data-aos="fade-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Booking Service Printer
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">
            Isi form berikut untuk menjadwalkan service printer Anda
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 sm:mb-10 lg:mb-12 mobile-fade-left" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-2 sm:ml-3 hidden sm:block">
                  <div className={`text-xs sm:text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Data Pribadi'}
                    {step === 2 && 'Detail Printer'}
                    {step === 3 && 'Jadwal Service'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="400">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Data */}
            {currentStep === 1 && (
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center" data-aos="fade-right">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                  Data Pribadi
                </h2>
                
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div data-aos="fade-up" data-aos-delay="200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div data-aos="fade-up" data-aos-delay="300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor HP *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      placeholder="+62853-6814-8449"
                    />
                  </div>

                  <div data-aos="fade-up" data-aos-delay="400">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="500">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 sm:mt-8" data-aos="fade-up" data-aos-delay="600">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium card-hover-scale text-sm sm:text-base"
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Printer Details */}
            {currentStep === 2 && (
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center" data-aos="fade-right">
                  <Printer className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                  Detail Printer & Masalah
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div data-aos="fade-up" data-aos-delay="200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Merk Printer *
                      </label>
                      <select
                        name="printerBrand"
                        value={formData.printerBrand}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      >
                        <option value="">Pilih Merk Printer</option>
                        {printerBrands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Printer *
                      </label>
                      <select
                        name="printerModel"
                        value={formData.printerModel}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.printerBrand}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 card-hover-subtle text-sm sm:text-base"
                      >
                        <option value="">Pilih Model Printer</option>
                        {selectedBrand?.models.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div data-aos="fade-up" data-aos-delay="400">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Masalah *
                    </label>
                    <select
                      name="problemCategory"
                      value={formData.problemCategory}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                    >
                      <option value="">Pilih Kategori Masalah</option>
                      {problemCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCategory && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 card-hover-subtle" data-aos="fade-up" data-aos-delay="500">
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                        Jenis Masalah dalam Kategori "{selectedCategory.name}":
                      </h4>
                      <ul className="space-y-1 text-xs sm:text-sm text-blue-800">
                        {selectedCategory.problems.map(problem => (
                          <li key={problem.id}>• {problem.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div data-aos="fade-up" data-aos-delay="600">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Masalah Detail *
                    </label>
                    <textarea
                      name="problemDescription"
                      value={formData.problemDescription}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      placeholder="Jelaskan masalah printer Anda secara detail..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8" data-aos="fade-up" data-aos-delay="700">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium card-hover-scale text-sm sm:text-base"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium card-hover-scale text-sm sm:text-base"
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center" data-aos="fade-right">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                  Jadwal & Jenis Service
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div data-aos="fade-up" data-aos-delay="200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Jenis Service</h3>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-full">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-900">Antar ke Toko</div>
                          <div className="text-sm text-blue-700">Bawa printer Anda ke toko kami untuk diperbaiki</div>
                        </div>
                      </div>
                      <input type="hidden" name="serviceType" value="antar-ke-toko" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div data-aos="fade-up" data-aos-delay="300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal *
                      </label>
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      />
                    </div>

                    <div data-aos="fade-up" data-aos-delay="400">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waktu *
                      </label>
                      <select
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      >
                        <option value="">Pilih Waktu</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>
                            {time} WIB
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div data-aos="fade-up" data-aos-delay="500">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan Tambahan
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                      placeholder="Catatan khusus atau permintaan tambahan..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8" data-aos="fade-up" data-aos-delay="600">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium card-hover-scale text-sm sm:text-base"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed card-hover-scale text-sm sm:text-base"
                  >
                    {isSubmitting ? 'Memproses...' : 'Kirim Booking'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white text-center card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="800">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Butuh Bantuan?</h3>
          <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
            Tim customer service kami siap membantu Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
              className="bg-green-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>WhatsApp: +62853-6814-8449</span>
            </button>
            <button
              onClick={() => window.open('tel:+6285368148449')}
              className="bg-white text-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Telepon: +62853-6814-8449</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;